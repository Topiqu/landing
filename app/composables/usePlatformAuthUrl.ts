// The app localizes its auth route per language; `/cs/auth` is a 404 there.
const AUTH_PATHS: Record<string, string> = { cs: '/cs/autorizace', en: '/en/auth' }

export const usePlatformAuthUrl = () => {
  const { locale } = useI18n()
  const { platformUrl } = useRuntimeConfig().public
  return computed(() => `${platformUrl}${AUTH_PATHS[locale.value] ?? AUTH_PATHS.en}`)
}
