import { START_LOCATION } from 'vue-router'

type Queue = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  push: Queue
  loaded: boolean
  version: string
}

// Meta's base code without the inline script: calls queue until fbevents.js takes over.
const install = (id: string) => {
  const target = window as unknown as { fbq?: Queue; _fbq?: Queue }
  if (target.fbq) return
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) Reflect.apply(fbq.callMethod, fbq, args)
    else fbq.queue.push(args)
  } as Queue
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [] })
  target.fbq = fbq
  target._fbq ??= fbq

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  fbq('init', id)
  fbq('track', 'PageView')
}

// The pixel sets these on the registrable domain, so a host-only delete would miss them.
const forget = () => {
  const parts = window.location.hostname.split('.')
  const domains = ['', ...parts.map((_, index) => `; Domain=.${parts.slice(index).join('.')}`)]
  for (const name of ['_fbp', '_fbc'])
    for (const domain of domains) document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`
}

export default defineNuxtPlugin(() => {
  const id = String(useRuntimeConfig().public.metaPixelId || '').trim()
  if (!id) return

  const { trackingAllowed, reloadWithoutTracking } = useCookieConsent()
  let loaded = false
  onNuxtReady(() => {
    watch(
      trackingAllowed,
      (accepted) => {
        if (accepted) {
          if (!loaded) install(id)
          loaded = true
          return
        }
        forget()
        // A running pixel cannot be unloaded.
        if (loaded) reloadWithoutTracking()
      },
      { immediate: true },
    )
  })

  // The base code counts only the first page; client-side navigation sends its own.
  useRouter().afterEach((to, from) => {
    if (from !== START_LOCATION && to.path !== from.path) trackMetaEvent('PageView')
  })
})
