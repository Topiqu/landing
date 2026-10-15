/** Replays a stored consent decision on boot, or asks for one. */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  if (!config.gtagId && !config.adsensePublisherId) return

  const { decided, trackingAllowed, apply, banner, reloadWithoutTracking } = useCookieConsent()

  watch(
    trackingAllowed,
    (allowed, wasAllowed) => {
      if (allowed) apply()
      else if (wasAllowed && config.gtagId) reloadWithoutTracking()
    },
    { immediate: true },
  )
  if (!decided.value) banner.value = true
})
