export type ConsentChoice = 'granted' | 'denied'

const CONSENT_COOKIE = 'cookie_consent'
const SIX_MONTHS = 60 * 60 * 24 * 180

const GRANTED = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
} as const

const DENIED = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
} as const

/**
 * Consent Mode v2 gate for the landing site's own GA4.
 *
 * Denied means nothing loads — gtag runs in `initMode: 'manual'`, so declining
 * never fetches the script at all. The cookie is domain-scoped, so this choice
 * is independent of the one a visitor makes on a tenant blog in the platform.
 */
export function useCookieConsent() {
  const choice = useCookie<ConsentChoice | null>(CONSENT_COOKIE, {
    maxAge: SIX_MONTHS,
    sameSite: 'lax',
    secure: !import.meta.dev,
    path: '/',
  })

  const banner = useState('consentBannerOpen', () => false)
  const granted = computed(() => choice.value === 'granted')
  const decided = computed(() => choice.value === 'granted' || choice.value === 'denied')

  /** Loads GA4. No-op unless consent was granted. */
  function apply() {
    const id = useRuntimeConfig().public.gtagId
    if (!import.meta.client || !granted.value || !id) return

    const { initialize, gtag } = useGtag()
    initialize(id)
    gtag('consent', 'update', { ...GRANTED })
  }

  function accept() {
    choice.value = 'granted'
    banner.value = false
    apply()
  }

  function reject() {
    choice.value = 'denied'
    banner.value = false
    // Nothing loads on a fresh denial, but a tab granted earlier in this
    // session still holds a live gtag instance that must be told to stop.
    if (import.meta.client && window.dataLayer) {
      useGtag().gtag('consent', 'update', { ...DENIED })
    }
  }

  /** Reopens the banner from the footer so a decision can be changed. */
  function reopen() {
    banner.value = true
  }

  return { choice, granted, decided, banner, apply, accept, reject, reopen }
}
