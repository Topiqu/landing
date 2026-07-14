export default defineNuxtRouteMiddleware((to) => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const routeName = String(to.name ?? '')

  const is = (page: string) => routeName.includes(`onboarding-${page}`)

  if ((is('account') || is('plan') || is('verify') || is('summary')) && !store.form.siteName) {
    return navigateTo(localePath({ name: 'onboarding-site' }))
  }

  if (is('summary') && !store.verifiedToken) {
    return navigateTo(localePath({ name: 'onboarding-verify' }))
  }
})
