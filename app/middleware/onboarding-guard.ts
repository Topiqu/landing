export default defineNuxtRouteMiddleware((to) => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const routeName = String(to.name ?? '')

  const is = (page: string) => routeName.includes(`onboarding-${page}`)

  if ((is('account') || is('plan') || is('verify') || is('summary')) && !store.form.siteName) {
    if (import.meta.client) console.warn('[onboarding-guard] → site (missing siteName)', { route: routeName })
    return navigateTo(localePath({ name: 'onboarding-site' }))
  }

  if (is('summary') && !store.verifiedToken) {
    if (import.meta.client) console.warn('[onboarding-guard] → verify (missing verifiedToken)', { route: routeName })
    return navigateTo(localePath({ name: 'onboarding-verify' }))
  }
})
