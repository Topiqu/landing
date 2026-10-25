import * as vue from 'vue'
import { afterAll, afterEach, beforeAll, expect, mock, test } from 'bun:test'

const names = [...Object.keys(vue), 'useOnboardingStore', 'useBroadcastChannel']
const originalGlobals = Object.fromEntries(names.map((name) => [name, Reflect.get(globalThis, name)]))
const messages: unknown[] = []
const channels: {
  data: vue.ShallowRef<unknown>
  isClosed: vue.ShallowRef<boolean>
  isSupported: vue.ShallowRef<boolean>
}[] = []
const scopes: vue.EffectScope[] = []
const makeStore = (ready = true, email = 'owner@example.test') => ({
  form: { siteName: 'Blog', email, password: ready ? 'a password only in this tab' : '' },
  canAdvanceAccount: ready,
  challenge: ready ? 'active-challenge' : null,
  verifiedToken: null as string | null,
  markStep: mock(),
})
let activeStore: ReturnType<typeof makeStore>
let useVerification: (typeof import('../app/composables/useOnboardingVerification'))['useOnboardingVerification']

beforeAll(async () => {
  Object.assign(globalThis, vue, {
    useOnboardingStore: () => activeStore,
    useBroadcastChannel: () => {
      const channel = {
        data: vue.shallowRef<unknown>(),
        isClosed: vue.shallowRef(false),
        isSupported: vue.shallowRef(true),
      }
      channels.push(channel)
      vue.onScopeDispose(() => {
        channel.isClosed.value = true
      })
      return {
        ...channel,
        post: (message: unknown) => {
          messages.push(message)
          for (const other of channels) {
            if (other !== channel && !other.isClosed.value) other.data.value = structuredClone(message)
          }
        },
      }
    },
  })
  ;({ useOnboardingVerification: useVerification } = await import('../app/composables/useOnboardingVerification'))
})

afterEach(() => {
  for (const scope of scopes.splice(0)) scope.stop()
  channels.length = 0
  messages.length = 0
})

afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else Reflect.set(globalThis, name, value)
  }
})

const tab = (store: ReturnType<typeof makeStore>) => {
  activeStore = store
  const scope = vue.effectScope()
  scopes.push(scope)
  return { scope, verification: scope.run(useVerification)! }
}

test('completes the original registration without copying its password into the email link tab', async () => {
  const originalStore = makeStore()
  const original = tab(originalStore)
  const linkStore = makeStore(false)
  linkStore.verifiedToken = 'server-signed-proof'
  const link = tab(linkStore)

  expect(await link.verification.share('email-link-challenge')).toBe(true)
  expect(originalStore.verifiedToken).toBe('server-signed-proof')
  expect(originalStore.markStep).toHaveBeenCalledWith('verify', 'done')
  expect(original.verification.received.value).toBe(true)
  expect(link.verification.shared.value).toBe(true)
  expect(linkStore.form.password).toBe('')
  expect(originalStore.form.password).toBe('a password only in this tab')
  expect(messages).toEqual([
    {
      type: 'verified',
      email: 'owner@example.test',
      verifiedToken: 'server-signed-proof',
      challenge: 'email-link-challenge',
    },
    { type: 'received', challenge: 'email-link-challenge' },
  ])
})

test.each(['different email', 'missing password', 'reset registration'])(
  'does not complete another or incomplete draft: %s',
  async (mode) => {
    const originalStore = makeStore(
      mode !== 'missing password',
      mode === 'different email' ? 'other@example.test' : undefined,
    )
    if (mode === 'reset registration') originalStore.challenge = null
    const original = tab(originalStore)
    const linkStore = makeStore(false)
    linkStore.verifiedToken = 'proof'
    const link = tab(linkStore)
    const pending = link.verification.share('link-challenge')
    await vue.nextTick()
    expect(originalStore.verifiedToken).toBeNull()
    expect(original.verification.received.value).toBe(false)
    expect(originalStore.markStep).not.toHaveBeenCalled()
    link.scope.stop()
    expect(await pending).toBe(false)
  },
)

test('ignores malformed messages and acknowledgements for other links', async () => {
  const store = makeStore()
  const current = tab(store)
  channels[0]!.data.value = { type: 'verified', email: store.form.email, verifiedToken: 123 }
  await vue.nextTick()
  channels[0]!.data.value = { type: 'received', challenge: 'unknown' }
  await vue.nextTick()
  expect(store.verifiedToken).toBeNull()
  expect(current.verification.received.value).toBe(false)
  expect(current.verification.shared.value).toBe(false)
})

test('keeps the standalone continuation when no original tab acknowledges', async () => {
  const store = makeStore(false)
  store.verifiedToken = 'proof'
  const link = tab(store)
  expect(await link.verification.share('link-challenge')).toBe(false)
  expect(link.verification.shared.value).toBe(false)
  expect(store.verifiedToken).toBe('proof')
})

test.each(['isSupported', 'isClosed'] as const)('does not wait for unavailable messaging: %s', async (flag) => {
  const store = makeStore(false)
  store.verifiedToken = 'proof'
  const link = tab(store)
  channels[0]![flag].value = flag === 'isClosed'
  expect(await link.verification.share('link-challenge')).toBe(false)
  expect(messages).toEqual([])
  expect(store.verifiedToken).toBe('proof')
})
