export default defineNuxtRouteMiddleware((to) => {
  // Progress lives in localStorage, so only the client can judge it; Nuxt re-runs route
  // middleware during hydration, which is where a reloaded step is checked.
  if (import.meta.server) return
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const routeName = String(to.name ?? '')

  const is = (...pages: string[]) => pages.some((page) => routeName.includes(`onboarding-${page}`))

  // Design and plan are optional and can be skipped, but every later step needs a named blog.
  if (is('design', 'plan', 'account', 'verify', 'summary') && !store.form.siteName) {
    return navigateTo(localePath({ name: 'onboarding-site' }))
  }

  // Passwords are deliberately not persisted, so a reload past the account step lands back on it.
  if (is('verify', 'summary') && !store.form.password) {
    return navigateTo(localePath({ name: 'onboarding-account' }))
  }

  if (is('summary') && !store.verifiedToken) {
    return navigateTo(localePath({ name: 'onboarding-verify' }))
  }
})
