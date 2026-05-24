export type DomainStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid' | 'tooShort' | 'reserved' | 'empty'

export interface OnboardingForm {
  siteName: string
  domain: string
  domainType: string
  language: string
  theme: string
  focus: string
  username: string
  email: string
  password: string
  passwordConfirm: string
  acceptTos: boolean
  website: string
  selectedPlan: 'PRO' | 'PREMIUM' | null
}

export const TOTAL_STEPS = 6

const STEP_ROUTE_NAMES = {
  1: 'onboarding-site',
  2: 'onboarding-design',
  3: 'onboarding-account',
  4: 'onboarding-plan',
  5: 'onboarding-verify',
  6: 'onboarding-summary',
} as const

export const useOnboarding = () => {
  const store = useOnboardingStore()
  const localePath = useLocalePath()
  const refs = storeToRefs(store)

  const close = () => navigateTo(localePath('/'))
  const goBack = (to: number) => {
    const name = STEP_ROUTE_NAMES[to as keyof typeof STEP_ROUTE_NAMES]
    if (name) navigateTo(localePath({ name }))
  }

  return {
    form: store.form,
    loading: refs.loading,
    userEditedDomain: refs.userEditedDomain,
    domainStatus: refs.domainStatus,
    domainStatusIcon: refs.domainStatusIcon,
    domainStatusColor: refs.domainStatusColor,
    fullDomainPreview: refs.fullDomainPreview,
    challenge: refs.challenge,
    verifiedToken: refs.verifiedToken,
    code: refs.code,
    codeSending: refs.codeSending,
    codeVerifying: refs.codeVerifying,
    codeError: refs.codeError,
    resendCooldown: refs.resendCooldown,
    canAdvanceStep1: refs.canAdvanceStep1,
    canAdvanceStep3: refs.canAdvanceStep3,
    canAdvanceStep4: refs.canAdvanceStep4,
    summaryRows: refs.summaryRows,
    totalSteps: TOTAL_STEPS,
    sendCode: store.sendCode,
    verifyCode: store.verifyCode,
    submit: store.submit,
    onCodeInput: store.onCodeInput,
    registerCodeInput: store.registerCodeInput,
    close,
    goBack,
  }
}
