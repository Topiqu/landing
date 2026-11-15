export type DomainStatus =
  'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'tooShort' | 'reserved' | 'empty' | 'unavailable'
export type DomainType = 'SUBDOMAIN' | 'CUSTOM'
export type SelectedPlan = 'PRO' | 'PREMIUM' | 'CUSTOM' | null
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
  websiteUrl: string
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

/** `?plan=` of a CTA: the plan to open on, `null` from a CTA that promises free, `undefined` to keep the draft. */
export const planFromQuery = (value: unknown): SelectedPlan | undefined => {
  const plan = String(value ?? '').toUpperCase()
  if (plan === 'FREE') return null
  return plan === 'PRO' || plan === 'PREMIUM' || plan === 'CUSTOM' ? plan : undefined
}

export const stepRouteName = (step: OnboardingStep) => `onboarding-${step}` as const
export const nextStep = (step: OnboardingStep) => ONBOARDING_STEPS[ONBOARDING_STEPS.indexOf(step) + 1] ?? step

export const useOnboarding = () => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const refs = storeToRefs(store)

  const goTo = (step: OnboardingStep) => navigateTo(localePath({ name: stepRouteName(step) }))
  const complete = (step: OnboardingStep) => {
    store.markStep(step, 'done')
    store.reportProgress(step)
    return goTo(nextStep(step))
  }
  const skip = (step: OnboardingStep) => {
    store.markStep(step, store.isStepDirty(step) ? 'done' : 'skipped')
    store.reportProgress(step)
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
    codeDelivery: refs.codeDelivery,
    codeSendError: refs.codeSendError,
    codeVerifying: refs.codeVerifying,
    codeError: refs.codeError,
    resendCooldown: refs.resendCooldown,
    passwordStrong: refs.passwordStrong,
    canAdvanceSite: refs.canAdvanceSite,
    canAdvanceAccount: refs.canAdvanceAccount,
    canVerify: refs.canVerify,
    trialEndsOn: refs.trialEndsOn,
    setDomainType: store.setDomainType,
    retryDomainCheck: store.retryDomainCheck,
    sendCode: store.sendCode,
    verifyCode: store.verifyCode,
    submit: store.submit,
    goTo,
    complete,
    skip,
  }
}
