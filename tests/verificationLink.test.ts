import { afterAll, beforeAll, expect, test } from 'bun:test'

import { readVerificationLink } from '../app/utils/verificationLink'

const names = ['defineNuxtRouteMiddleware', 'useOnboardingStore', 'useLocalePath', 'navigateTo']
const originalGlobals = Object.fromEntries(names.map((name) => [name, Reflect.get(globalThis, name)]))
const store = { form: { siteName: 'Draft', password: '' }, verifiedToken: null }
let guard: (typeof import('../app/middleware/onboarding-guard'))['default']

beforeAll(async () => {
  Object.assign(globalThis, {
    defineNuxtRouteMiddleware: (run: unknown) => run,
    useOnboardingStore: () => store,
    useLocalePath: () => (route: unknown) => route,
    navigateTo: (route: unknown) => route,
  })
  ;({ default: guard } = await import('../app/middleware/onboarding-guard'))
})
afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else Reflect.set(globalThis, name, value)
  }
})

test('routes an existing emailed verification link before requiring the missing password', async () => {
  expect(
    await guard(
      { name: 'onboarding-verify___en', query: { code: '123456', token: 'test-challenge' } } as never,
      {} as never,
    ),
  ).toMatchObject({
    name: 'onboarding-verify-email',
  })
})

test('still requires account details for the regular verification form', async () => {
  expect(await guard({ name: 'onboarding-verify___en', query: {} } as never, {} as never)).toMatchObject({
    name: 'onboarding-account',
  })
})

test('accepts fragments and older query links, and rejects incomplete or repeated parameters', () => {
  expect(readVerificationLink({}, '#code=123456&token=challenge')).toEqual({ code: '123456', challenge: 'challenge' })
  expect(readVerificationLink({ code: '123456', token: 'challenge' })).toEqual({
    code: '123456',
    challenge: 'challenge',
  })
  expect(readVerificationLink({ code: ['123456', '654321'], token: 'challenge' })).toBeNull()
  expect(readVerificationLink({ code: '123456' })).toBeNull()
  expect(readVerificationLink({}, '#code=abc&token=challenge')).toBeNull()
  expect(readVerificationLink({}, '#code=123456&code=654321&token=challenge')).toBeNull()
})
