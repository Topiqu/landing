import * as vue from 'vue'
import { afterAll, afterEach, beforeAll, expect, mock, spyOn, test } from 'bun:test'

const names = ['shallowRef', 'watch', 'onScopeDispose', 'defineEventHandler', 'setResponseHeader', 'useRuntimeConfig']
const originalGlobals = Object.fromEntries(names.map((name) => [name, Reflect.get(globalThis, name)]))
let useVerificationCodeRequest: (typeof import('../app/composables/useVerificationCodeRequest'))['useVerificationCodeRequest']
let verificationConfig: (typeof import('../server/api/verification-config.get'))['default']
const scopes: vue.EffectScope[] = []
const responseHeader = mock()

beforeAll(async () => {
  Object.assign(globalThis, {
    shallowRef: vue.shallowRef,
    watch: vue.watch,
    onScopeDispose: vue.onScopeDispose,
    defineEventHandler: (run: unknown) => run,
    setResponseHeader: responseHeader,
    useRuntimeConfig: () => ({
      turnstile: { secretKey: 'private-test-secret' },
      public: { turnstile: { siteKey: 'public-test-key' } },
    }),
  })
  ;({ useVerificationCodeRequest } = await import('../app/composables/useVerificationCodeRequest'))
  ;({ default: verificationConfig } = await import('../server/api/verification-config.get'))
})
afterEach(() => {
  scopes.splice(0).forEach((scope) => scope.stop())
})
afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else Reflect.set(globalThis, name, value)
  }
})

const setup = (siteKey = 'public-test-key') => {
  const scope = vue.effectScope()
  scopes.push(scope)
  const token = vue.ref<string>()
  const key = vue.ref(siteKey)
  const blocked = vue.ref(false)
  const send = mock(async (_token: string) => true)
  const reset = mock(() => {})
  const request = scope.run(() => useVerificationCodeRequest({ siteKey: key, token, blocked, send, reset }))!
  return { ...request, scope, token, key, blocked, send, reset }
}

test('returns only the current public key and disables caching', async () => {
  expect(await verificationConfig({} as never)).toEqual({ siteKey: 'public-test-key' })
  expect(responseHeader).toHaveBeenCalledWith({}, 'Cache-Control', 'no-store')
})

test('reports missing configuration immediately without sending', async () => {
  const request = setup('')
  expect(await request.request()).toBe(false)
  expect(request.error.value).toBe('unavailable')
  expect(request.waiting.value).toBe(false)
  expect(request.send).not.toHaveBeenCalled()
})

test('waits for security verification and ignores double clicks', async () => {
  const request = setup()
  const pending = request.request()
  expect(request.waiting.value).toBe(true)
  expect(await request.request()).toBe(false)
  request.token.value = 'fresh-token'
  expect(await pending).toBe(true)
  expect(request.send).toHaveBeenCalledTimes(1)
  expect(request.send).toHaveBeenCalledWith('fresh-token')
  expect(request.reset).toHaveBeenCalledTimes(1)
  expect(request.token.value).toBeUndefined()
  expect(request.waiting.value).toBe(false)
})

test('reports provider errors and can retry with a fresh token', async () => {
  const request = setup()
  const pending = request.request()
  request.fail()
  expect(await pending).toBe(false)
  expect(request.error.value).toBe('verification')
  expect(request.send).not.toHaveBeenCalled()
  const retry = request.request()
  expect(request.reset).toHaveBeenCalledTimes(1)
  request.token.value = 'fresh-token'
  expect(await retry).toBe(true)
  expect(request.error.value).toBeNull()
})

test('shows a timeout and releases the token watcher', async () => {
  let timeout!: () => void
  const timer = spyOn(globalThis, 'setTimeout').mockImplementation(((run: () => void) => {
    timeout = run
    return 1
  }) as typeof setTimeout)
  try {
    const request = setup()
    const pending = request.request()
    timeout()
    expect(await pending).toBe(false)
    expect(request.error.value).toBe('verification')
    expect(request.waiting.value).toBe(false)
    request.token.value = 'late-token'
    await vue.nextTick()
    expect(request.send).not.toHaveBeenCalled()
  } finally {
    timer.mockRestore()
  }
})

test('cancels token waiting on navigation without sending later', async () => {
  const request = setup()
  const pending = request.request()
  request.scope.stop()
  expect(await pending).toBe(false)
  request.token.value = 'late-token'
  await vue.nextTick()
  expect(request.send).not.toHaveBeenCalled()
  expect(await request.request()).toBe(false)
})

test('does not send automatically on a background token refresh or during cooldown', async () => {
  const request = setup()
  request.token.value = 'background-token'
  await vue.nextTick()
  expect(request.send).not.toHaveBeenCalled()
  request.blocked.value = true
  expect(await request.request()).toBe(false)
  expect(request.send).not.toHaveBeenCalled()
})

test('preserves a synchronous fresh token when resetting a used widget', async () => {
  const request = setup()
  request.token.value = 'first-token'
  request.reset.mockImplementation(() => {
    request.token.value = 'replacement-token'
  })
  expect(await request.request()).toBe(true)
  expect(request.token.value).toBe('replacement-token')
})

test('keeps all verification feedback translated in both landing locales', async () => {
  const en = await Bun.file('i18n/locales/en/landing.json').json()
  const cs = await Bun.file('i18n/locales/cs/landing.json').json()
  expect(Object.keys(cs.landing.onboarding.verify).sort()).toEqual(Object.keys(en.landing.onboarding.verify).sort())
  expect(Object.values(cs.landing.onboarding.verify).every((text) => typeof text === 'string' && text.length > 0)).toBe(
    true,
  )
})
