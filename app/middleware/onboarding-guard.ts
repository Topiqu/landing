import { readVerificationLink } from '../utils/verificationLink'

export default defineNuxtRouteMiddleware((to) => {
  // Passwords and verification state are intentionally not persisted. Check the hydrated
  // client store; Nuxt re-runs this middleware during hydration after a reload.
  if (import.meta.server) return
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const routeName = String(to.name ?? '').split('___')[0]

  const is = (...pages: string[]) => pages.some((page) => routeName === `onboarding-${page}`)

  const link = is('verify') ? readVerificationLink(to.query, to.hash) : null
  if (link) {
    return navigateTo(
      localePath({
        name: 'onboarding-verify-email',
        hash: `#${new URLSearchParams({ code: link.code, token: link.challenge })}`,
      }),
      { replace: true },
    )
  }

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
