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
  accentColor: string
  gradient: GradientStyle | null
  typography: TypographyPreset
  tagline: string
  username: string
  email: string
  password: string
  passwordConfirm: string
  acceptTos: boolean
  website: string
  selectedPlan: SelectedPlan
  billingInterval: SelectedBillingInterval
}

// The fun, optional steps come first; the account and its verification close the flow.
export const ONBOARDING_STEPS = ['site', 'design', 'plan', 'account', 'verify', 'summary'] as const
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number]
export const TOTAL_STEPS = ONBOARDING_STEPS.length
export const OPTIONAL_STEPS: readonly OnboardingStep[] = ['design', 'plan']
export type StepProgress = 'done' | 'skipped'

export const stepRouteName = (step: OnboardingStep) => `onboarding-${step}` as const
export const nextStep = (step: OnboardingStep) => ONBOARDING_STEPS[ONBOARDING_STEPS.indexOf(step) + 1] ?? step

export const useOnboarding = () => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const refs = storeToRefs(store)

  const goTo = (step: OnboardingStep) => navigateTo(localePath({ name: stepRouteName(step) }))
  const complete = (step: OnboardingStep) => {
    store.markStep(step, 'done')
    return goTo(nextStep(step))
  }
  const skip = (step: OnboardingStep) => {
    store.markStep(step, store.isStepDirty(step) ? 'done' : 'skipped')
    return goTo(nextStep(step))
  }

  return {
    form: store.form,
    loading: refs.loading,
    userEditedDomain: refs.userEditedDomain,
    domainStatus: refs.domainStatus,
    fullDomainPreview: refs.fullDomainPreview,
    brandAccent: refs.brandAccent,
    brandGradientValue: refs.brandGradientValue,
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
    complete,
    skip,
  }
}
