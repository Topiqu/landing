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
const fetch = mock(async (url: string, options: any) => {
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
  })
  ;({ useOnboardingStore } = await import('../app/stores/onboarding'))
  ;({ default: checkout } = await import('../server/api/checkout.post'))
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
})
