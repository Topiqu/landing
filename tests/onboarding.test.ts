import * as vue from 'vue'
import { resolve } from 'node:path'
import { createPinia, setActivePinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, mock, test } from 'bun:test'

import * as plans from '../shared/utils/plans'
import * as branding from '../shared/utils/branding'

const names = [
  ...Object.keys(vue),
  ...Object.keys(branding),
  ...Object.keys(plans),
  'useNuxtApp',
  'useLegacyToast',
  'useDebounceFn',
  '$fetch',
  'window',
  'defineEventHandler',
  'readValidatedBody',
  'useRuntimeConfig',
  'createError',
  'getRequestIP',
  'getQuery',
]
const originalGlobals = Object.fromEntries(names.map((name) => [name, (globalThis as any)[name]]))
const storageValues = new Map<string, string>()
const storage = {
  getItem: (key: string) => storageValues.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storageValues.set(key, value)
  },
}
const requests: { url: string; options: any }[] = []
const config = { authSecret: 'test-onboarding-secret', platformApiUrl: 'https://platform.example.test' }
const fetch = mock(async (url: string, options: any): Promise<unknown> => {
  requests.push({ url, options })
  return { url: 'https://workspace.example.test', ok: true }
})

Bun.plugin({
  name: 'onboarding-root-alias',
  setup(builder) {
    builder.onResolve({ filter: /^~~\// }, ({ path }) => ({ path: resolve(process.cwd(), path.slice(3)) }))
  },
})

let useOnboardingStore: (typeof import('../app/stores/onboarding'))['useOnboardingStore']
let checkout: (typeof import('../server/api/checkout.post'))['default']
let checkDomain: (typeof import('../server/api/check-domain.get'))['default']
let issueVerifiedToken: (typeof import('../server/utils/onboardingTokens'))['issueVerifiedToken']
const stores: ReturnType<typeof useOnboardingStore>[] = []
const createStore = () => {
  const pinia = createPinia().use(createPersistedState({ storage }))
  vue.createApp({}).use(pinia)
  setActivePinia(pinia)
  const store = useOnboardingStore()
  stores.push(store)
  return store
}

beforeAll(async () => {
  Object.assign(globalThis, vue, branding, plans, {
    useNuxtApp: () => ({ $i18n: { locale: { value: 'en' }, t: (key: string) => key } }),
    useLegacyToast: () => ({ success: mock(), error: mock() }),
    useDebounceFn: (run: any) => run,
    $fetch: fetch,
    window: { location: { href: '' } },
    defineEventHandler: (run: any) => run,
    readValidatedBody: async (event: any, parse: any) => parse(event.body),
    useRuntimeConfig: () => config,
    createError: (options: any) => Object.assign(new Error(options.message), options),
    getRequestIP: () => '203.0.113.4',
    getQuery: (event: any) => event.query,
  })
  ;({ useOnboardingStore } = await import('../app/stores/onboarding'))
  ;({ default: checkout } = await import('../server/api/checkout.post'))
  ;({ default: checkDomain } = await import('../server/api/check-domain.get'))
  ;({ issueVerifiedToken } = await import('../server/utils/onboardingTokens'))
})
beforeEach(() => {
  storageValues.clear()
  requests.length = 0
  fetch.mockClear()
})
afterEach(() => {
  for (const store of stores.splice(0)) store.$dispose()
})
afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else (globalThis as any)[name] = value
  }
})

describe('verification email feedback', () => {
  const emailStore = () => {
    const store = createStore()
    store.form.email = 'owner@example.test'
    return store
  }

  test('confirms sending only with an SES receipt and starts the resend cooldown', async () => {
    const store = emailStore()
    fetch.mockResolvedValueOnce({ challenge: 'challenge', delivery: 'ses', messageId: 'receipt' })
    expect(await store.sendCode('security-token')).toBe(true)
    expect(store.codeDelivery).toBe('sent')
    expect(store.challenge).toBe('challenge')
    expect(store.resendCooldown).toBe(60)
    expect(store.codeSendError).toBe('')
    expect(fetch.mock.calls[0]![1]).toMatchObject({ retry: 0, timeout: 20_000 })
    expect(await store.sendCode('another-token')).toBe(false)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  test.each([{ challenge: 'ok' }, { challenge: 'challenge', delivery: 'ses' }])(
    'does not claim success for an incomplete receipt: %j',
    async (response) => {
      const store = emailStore()
      fetch.mockResolvedValueOnce(response)
      expect(await store.sendCode('security-token')).toBe(false)
      expect(store.codeDelivery).toBe('idle')
      expect(store.challenge).toBeNull()
      expect(store.codeSendError).toBe('landing.onboarding.verify.sendFailed')
      expect(store.resendCooldown).toBe(0)
    },
  )

  test('distinguishes development console delivery from a sent email', async () => {
    const store = emailStore()
    fetch.mockResolvedValueOnce({ challenge: 'challenge', delivery: 'development' })
    expect(await store.sendCode('security-token')).toBe(true)
    expect(store.codeDelivery).toBe('development')
    expect(store.challenge).toBe('challenge')
  })

  test('keeps the previous code usable after a failed resend and allows retry', async () => {
    const store = emailStore()
    store.challenge = 'previous-challenge'
    store.code = '123'
    fetch.mockRejectedValueOnce(new Error('Network unavailable'))
    expect(await store.sendCode('security-token')).toBe(false)
    expect(store.codeSendError).toBe('landing.onboarding.verify.sendFailed')
    expect(store.challenge).toBe('previous-challenge')
    expect(store.code).toBe('123')
    expect(store.codeSending).toBe(false)
    fetch.mockResolvedValueOnce({ challenge: 'new-challenge', delivery: 'ses', messageId: 'receipt' })
    expect(await store.sendCode('new-security-token')).toBe(true)
    expect(store.codeSendError).toBe('')
    expect(store.code).toBe('')
  })

  test('ignores a late response after changing the email and resets the cooldown', async () => {
    const store = emailStore()
    let finish!: (value: unknown) => void
    fetch.mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)))
    const pending = store.sendCode('security-token')
    expect(store.codeSending).toBe(true)
    const signal = fetch.mock.calls[0]![1].signal as AbortSignal
    store.form.email = 'different@example.test'
    expect(signal.aborted).toBe(true)
    finish({ challenge: 'old-challenge', delivery: 'ses', messageId: 'receipt' })
    expect(await pending).toBe(false)
    expect(store.challenge).toBeNull()
    expect(store.codeDelivery).toBe('idle')
    expect(store.codeSending).toBe(false)
    expect(store.resendCooldown).toBe(0)
    fetch.mockResolvedValueOnce({ challenge: 'current-challenge', delivery: 'ses', messageId: 'receipt' })
    expect(await store.sendCode('new-security-token')).toBe(true)
    store.form.email = 'corrected@example.test'
    expect(store.resendCooldown).toBe(0)
    expect(store.challenge).toBeNull()
  })

  test('does not submit twice or wipe completed verification', async () => {
    const store = emailStore()
    let finish!: (value: unknown) => void
    fetch.mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)))
    const pending = store.sendCode('security-token')
    expect(await store.sendCode('duplicate-token')).toBe(false)
    finish({ challenge: 'challenge', delivery: 'ses', messageId: 'receipt' })
    await pending
    expect(fetch).toHaveBeenCalledTimes(1)
    store.resendCooldown = 0
    store.verifiedToken = 'verified'
    expect(await store.sendCode('another-token')).toBe(false)
    expect(store.verifiedToken).toBe('verified')
  })
})

describe('company website onboarding', () => {
  test('keeps the website across reloads while leaving passwords out of persistence', async () => {
    const store = createStore()
    store.form.websiteUrl = 'https://firma.cz/about'
    store.form.password = 'private-password'
    await vue.nextTick()
    const saved = JSON.parse(storageValues.get('onboarding')!)
    expect(saved.form.websiteUrl).toBe('https://firma.cz/about')
    expect(saved.form.password).toBeUndefined()
    expect(createStore().form.websiteUrl).toBe('https://firma.cz/about')
  })

  test('reset clears the persisted draft, progress, and verification state', async () => {
    const store = createStore()
    Object.assign(store.form, {
      siteName: 'Draft',
      domain: 'draft',
      email: 'draft@example.test',
      password: 'secret',
      selectedPlan: 'PRO',
    })
    store.markStep('site', 'done')
    store.challenge = 'challenge'
    store.verifiedToken = 'proof'
    store.code = '123456'
    store.userEditedDomain = true
    await vue.nextTick()

    store.reset()
    await vue.nextTick()

    expect(store.form.siteName).toBe('')
    expect(store.form.password).toBe('')
    expect(store.form.selectedPlan).toBeNull()
    expect(store.progress).toEqual({})
    expect(store.challenge).toBeNull()
    expect(store.verifiedToken).toBeNull()
    expect(store.code).toBe('')
    expect(store.userEditedDomain).toBe(false)
    const restored = createStore()
    expect(restored.form.siteName).toBe('')
    expect(restored.form.email).toBe('')
    expect(restored.progress).toEqual({})
  })

  test.each([' firma.cz ', ''])('passes the optional website from the form through checkout: %s', async (website) => {
    const store = createStore()
    Object.assign(store.form, {
      siteName: 'Firma',
      domain: 'firma',
      username: 'Owner',
      email: 'owner@firma.cz',
      websiteUrl: website,
      password: 'Winter-coffee Forest!fiction 7382',
      passwordConfirm: 'Winter-coffee Forest!fiction 7382',
      acceptTos: true,
    })
    store.verifiedToken = 'proof'
    await store.submit()
    const request = requests.find(({ url }) => url === '/api/checkout')!
    expect(request.options.body.websiteUrl).toBe(website.trim() || undefined)
    expect(request.options.body.websiteImportConsentVersion).toBe(website.trim() ? 1 : undefined)
    expect(request.options.body.website).toBeUndefined()
  })

  test('forwards the website in the validated, signed platform request', async () => {
    const email = 'owner@firma.cz'
    const result = await checkout({
      body: {
        siteName: 'Firma',
        domain: 'firma',
        language: 'cs',
        username: 'Owner',
        email,
        password: 'test-password',
        verifiedToken: issueVerifiedToken(email),
        websiteUrl: ' firma.cz ',
        websiteImportConsentVersion: 1,
        website: 'honeypot',
      },
    } as never)
    expect(result.url).toBe('https://workspace.example.test')
    const request = requests[0]!
    expect(request.url).toBe('https://platform.example.test/api/onboarding/checkout')
    expect(request.options.body.websiteUrl).toBe('firma.cz')
    expect(request.options.body.websiteImportConsentVersion).toBe(1)
    expect(request.options.body.website).toBeUndefined()
    expect(request.options.headers['X-Landing-Client-Ip']).toBe('203.0.113.4')
    expect(request.options.headers['X-Landing-Sig']).toHaveLength(64)
    expect(request.options.headers['Idempotency-Key']).toHaveLength(64)
    expect(request.options.retry).toBe(0)
    expect(request.options.timeout).toBe(30_000)
  })

  test('rejects an unverified email before forwarding the website', async () => {
    await expect(
      checkout({
        body: {
          siteName: 'Firma',
          domain: 'firma',
          language: 'cs',
          username: 'Owner',
          email: 'owner@firma.cz',
          password: 'test-password',
          verifiedToken: 'invalid',
          websiteUrl: 'firma.cz',
        },
      } as never),
    ).rejects.toMatchObject({ statusCode: 400 })
    expect(fetch).not.toHaveBeenCalled()
  })

  test('does not retry an uncertain platform result or expose its raw error', async () => {
    const email = 'uncertain@example.test'
    const event = {
      body: {
        siteName: 'Uncertain',
        domain: 'uncertain',
        language: 'en',
        username: 'Owner',
        email,
        password: 'test-password',
        verifiedToken: issueVerifiedToken(email),
      },
    }
    fetch.mockImplementationOnce(async () => {
      throw new Error('Internal error containing private provider details')
    })
    await expect(checkout(event as never)).rejects.toMatchObject({
      statusCode: 503,
      data: { reason: 'checkoutUnknown' },
    })
    await expect(checkout(event as never)).rejects.toMatchObject({
      statusCode: 503,
      message: 'Registration outcome could not be confirmed. Check your email or sign in before trying again.',
    })
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('domain availability', () => {
  test('never reports available when the platform is down', async () => {
    fetch.mockImplementationOnce(async () => {
      throw new Error('Unavailable')
    })
    await expect(checkDomain({ query: { domain: 'example', type: 'SUBDOMAIN' } } as never)).rejects.toMatchObject({
      statusCode: 503,
    })
  })
  test('rejects malformed upstream responses', async () => {
    await expect(checkDomain({ query: { domain: 'example', type: 'SUBDOMAIN' } } as never)).rejects.toMatchObject({
      statusCode: 503,
    })
  })
  test('only reports availability confirmed by the platform', async () => {
    fetch.mockImplementationOnce(async () => ({ ok: true, fullDomain: 'example.topiqu.com' }) as any)
    expect(await checkDomain({ query: { domain: 'example', type: 'SUBDOMAIN' } } as never)).toEqual({
      ok: true,
      fullDomain: 'example.topiqu.com',
    })
  })
})
