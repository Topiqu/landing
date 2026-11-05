/** The app hosts the one privacy policy; the landing only links to it. */
export const usePrivacyPolicyUrl = () => {
  const { locale } = useI18n()
  const { platformUrl } = useRuntimeConfig().public
  return computed(() => `${platformUrl}${locale.value === 'cs' ? '/cs/ochrana-soukromi' : '/en/privacy-policy'}`)
}
