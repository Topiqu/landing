/** Replays a stored consent decision on boot, or asks for one. */
export default defineNuxtPlugin(() => {
  if (!useRuntimeConfig().public.gtagId) return

  const { decided, granted, apply, banner } = useCookieConsent()

  if (granted.value) apply()
  else if (!decided.value) banner.value = true
})
