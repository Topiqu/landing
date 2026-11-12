import { ref, watch } from 'vue'
import { START_LOCATION } from 'vue-router'
import { afterAll, beforeEach, describe, expect, mock, test } from 'bun:test'

const names = [
  'defineNuxtPlugin',
  'useRuntimeConfig',
  'useCookieConsent',
  'onNuxtReady',
  'watch',
  'useRouter',
  'trackMetaEvent',
  'window',
  'document',
]
const originalGlobals = Object.fromEntries(names.map((name) => [name, (globalThis as any)[name]]))

const config = { public: { metaPixelId: 'pixel-1' } }
// Fresh per test, so an earlier test's watcher never reacts.
let trackingAllowed = ref(false)
const reloadWithoutTracking = mock(() => {})
const trackMetaEvent = mock((_name: string) => true)
const scripts: { src: string; async: boolean }[] = []
const cookies: string[] = []
let afterEach: (to: { path: string }, from: unknown) => void
let target: Record<string, any>

Object.assign(globalThis, {
  defineNuxtPlugin: (setup: () => void) => setup,
  useRuntimeConfig: () => config,
  useCookieConsent: () => ({ trackingAllowed, reloadWithoutTracking }),
  onNuxtReady: (run: () => void) => run(),
  watch,
  useRouter: () => ({
    afterEach: (hook: typeof afterEach) => {
      afterEach = hook
    },
  }),
  trackMetaEvent,
  document: {
    createElement: () => ({ src: '', async: false }),
    head: { appendChild: (script: { src: string; async: boolean }) => scripts.push(script) },
    set cookie(value: string) {
      cookies.push(value)
    },
  },
})

const { default: setup } = (await import('../app/plugins/meta-pixel.client')) as unknown as { default: () => void }

beforeEach(() => {
  trackingAllowed = ref(false)
  config.public.metaPixelId = 'pixel-1'
  target = { location: { hostname: 'topiqu.com' } }
  ;(globalThis as any).window = target
  scripts.length = 0
  cookies.length = 0
  reloadWithoutTracking.mockClear()
  trackMetaEvent.mockClear()
})

afterAll(() => {
  for (const [name, value] of Object.entries(originalGlobals)) {
    if (value === undefined) Reflect.deleteProperty(globalThis, name)
    else (globalThis as any)[name] = value
  }
})

const settle = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('Meta Pixel', () => {
  test('loads only after consent and queues the first PageView', async () => {
    setup()
    expect(scripts).toHaveLength(0)
    expect(target.fbq).toBeUndefined()

    trackingAllowed.value = true
    await settle()
    expect(scripts).toEqual([{ src: 'https://connect.facebook.net/en_US/fbevents.js', async: true }])
    expect(target.fbq.queue).toEqual([
      ['init', 'pixel-1'],
      ['track', 'PageView'],
    ])
    expect(target._fbq).toBe(target.fbq)
  })

  test('drops its cookies on the registrable domain and reloads once it has run', async () => {
    trackingAllowed.value = true
    setup()
    trackingAllowed.value = false
    await settle()
    expect(reloadWithoutTracking).toHaveBeenCalledTimes(1)
    expect(cookies).toContain('_fbp=; Max-Age=0; Path=/; Domain=.topiqu.com; SameSite=Lax')
    expect(cookies).toContain('_fbc=; Max-Age=0; Path=/; SameSite=Lax')
  })

  test('declining before it ever ran needs no reload', () => {
    setup()
    expect(reloadWithoutTracking).not.toHaveBeenCalled()
    expect(scripts).toHaveLength(0)
  })

  test('sends a PageView for each client-side page, not for the first one or a query change', () => {
    setup()
    afterEach({ path: '/en' }, START_LOCATION)
    afterEach({ path: '/en' }, { path: '/en' })
    afterEach({ path: '/en/agencies' }, { path: '/en' })
    expect(trackMetaEvent.mock.calls).toEqual([['PageView']])
  })

  test('does nothing without a pixel id', () => {
    config.public.metaPixelId = ''
    trackingAllowed.value = true
    setup()
    expect(scripts).toHaveLength(0)
    expect(target.fbq).toBeUndefined()
  })
})
