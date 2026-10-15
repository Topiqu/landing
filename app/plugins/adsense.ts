export default defineNuxtPlugin(() => {
  const publisherId = String(useRuntimeConfig().public.adsensePublisherId || '').trim()
  if (!publisherId) return

  useHead({ meta: [{ name: 'google-adsense-account', content: publisherId }] })

  const { trackingAllowed, reloadWithoutTracking } = useCookieConsent()
  onNuxtReady(() => {
    let script: HTMLScriptElement | null = null
    watch(
      trackingAllowed,
      (accepted) => {
        if (!accepted) {
          // Removing a script cannot stop a running ad runtime.
          if (script) reloadWithoutTracking()
          return
        }
        if (script) return

        const adWindow = window as unknown as { adsbygoogle?: unknown[] & { requestNonPersonalizedAds?: number } }
        const queue = (adWindow.adsbygoogle ??= [])
        queue.requestNonPersonalizedAds = 1

        // Keep the AdSense tag free of Unhead's hydration and event attributes.
        script = document.createElement('script')
        script.setAttribute('async', '')
        script.crossOrigin = 'anonymous'
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(publisherId)}`
        document.head.appendChild(script)
      },
      { immediate: true },
    )
  })
})
