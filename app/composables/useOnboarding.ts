export type DomainStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'tooShort' | 'reserved' | 'empty'
export type DomainType = 'SUBDOMAIN' | 'CUSTOM'
export type SelectedPlan = 'PRO' | 'PREMIUM' | null
export type SelectedBillingInterval = 'month' | 'year'

export interface OnboardingForm {
  siteName: string
  domain: string
  domainType: DomainType
  language: ContentLanguage
  theme: ThemeKey
  username: string
  email: string
  password: string
  passwordConfirm: string
  acceptTos: boolean
  website: string
  selectedPlan: SelectedPlan
  billingInterval: SelectedBillingInterval
}

export const ONBOARDING_STEPS = ['site', 'design', 'account', 'plan', 'verify', 'summary'] as const
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]
export const TOTAL_STEPS = ONBOARDING_STEPS.length

export const stepRouteName = (step: OnboardingStep) => `onboarding-${step}` as const

export const useOnboarding = () => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const refs = storeToRefs(store)

  const goTo = (step: OnboardingStep) => navigateTo(localePath({ name: stepRouteName(step) }))

  return {
    form: store.form,
    loading: refs.loading,
    userEditedDomain: refs.userEditedDomain,
    domainStatus: refs.domainStatus,
    fullDomainPreview: refs.fullDomainPreview,
    challenge: refs.challenge,
    verifiedToken: refs.verifiedToken,
    code: refs.code,
    codeSending: refs.codeSending,
    codeVerifying: refs.codeVerifying,
    codeError: refs.codeError,
    resendCooldown: refs.resendCooldown,
    passwordStrong: refs.passwordStrong,
    canAdvanceSite: refs.canAdvanceSite,
    canAdvanceAccount: refs.canAdvanceAccount,
    canVerify: refs.canVerify,
    trialEndsOn: refs.trialEndsOn,
    setDomainType: store.setDomainType,
    sendCode: store.sendCode,
    verifyCode: store.verifyCode,
    submit: store.submit,
    goTo,
  }
}
