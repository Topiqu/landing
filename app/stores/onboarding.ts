import slugify from 'slugify'
import { defineStore } from 'pinia'
import { zxcvbn } from '@zxcvbn-ts/core'

import type { DomainStatus, OnboardingForm } from '~/composables/useOnboarding'

export const useOnboardingStore = defineStore(
  'onboarding',
  () => {
    // i18n and toast are resolved lazily instead of at store-setup time: a
    // top-level useI18n()/useToast() throws "Must be called at the top of a
    // setup function" when this store is first instantiated from route
    // middleware (onboarding-guard) during SSR. Consumers resolve them where a
    // valid Nuxt context exists — inside computeds (component render) and at the
    // very top of each action (before any await, so the context isn't lost).
    const $t = (key: string, named?: Record<string, unknown>): string =>
      (useNuxtApp().$i18n as { t: (k: string, n?: Record<string, unknown>) => string }).t(key, named)

    // For async actions: capture i18n/toast synchronously (before the first
    // await) so they can be used after awaits without losing the Nuxt context.
    const captureI18nToast = () => {
      const i18n = useNuxtApp().$i18n as { t: (k: string, n?: Record<string, unknown>) => string }
      return { $t: (k: string, n?: Record<string, unknown>) => i18n.t(k, n), toast: useToast() }
    }

    const loading = shallowRef(false)
    const userEditedDomain = shallowRef(false)
    let codeInputEl: HTMLInputElement | null = null

    const challenge = shallowRef<string | null>(null)
    const verifiedToken = shallowRef<string | null>(null)
    const code = shallowRef('')
    const codeSending = shallowRef(false)
    const codeVerifying = shallowRef(false)
    const codeError = shallowRef('')
    const resendCooldown = shallowRef(0)
    let cooldownTimer: ReturnType<typeof setInterval> | null = null

    const form = shallowReactive<OnboardingForm>({
      siteName: '',
      domain: '',
      domainType: 'SUBDOMAIN',
      language: 'en',
      theme: 'blue',
      focus: '',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      acceptTos: false,
      website: '',
      selectedPlan: null,
    })

    const domainStatus = shallowRef<DomainStatus>('idle')

    const fullDomainPreview = computed(() =>
      form.domainType === 'SUBDOMAIN' ? `${form.domain}.topiqu.com` : form.domain,
    )

    watch(
      () => form.siteName,
      (newName) => {
        if (form.domainType === 'SUBDOMAIN' && !userEditedDomain.value) {
          form.domain = newName ? slugify(newName, { lower: true, strict: true }) : ''
        }
      },
    )

    watch(
      () => form.domainType,
      (newType) => {
        if (newType === 'SUBDOMAIN') {
          userEditedDomain.value = false
          form.domain = form.siteName ? slugify(form.siteName, { lower: true, strict: true }) : ''
        } else {
          form.domain = ''
        }
      },
    )

    const runDomainCheck = useDebounceFn(async (domain: string, type: string) => {
      if (form.domain !== domain || form.domainType !== type) return
      if (!domain) {
        domainStatus.value = 'idle'
        return
      }
      try {
        const res = await $fetch<{ ok: boolean; reason?: DomainStatus }>('/api/check-domain', {
          query: { domain, type },
        })
        if (form.domain !== domain || form.domainType !== type) return
        domainStatus.value = res.ok ? 'available' : ((res.reason as DomainStatus) ?? 'invalid')
      } catch {
        domainStatus.value = 'idle'
      }
    }, 350)

    watch(
      () => [form.domain, form.domainType] as const,
      ([d, type]) => {
        if (!d) {
          domainStatus.value = 'idle'
          return
        }
        domainStatus.value = 'checking'
        runDomainCheck(d, type)
      },
    )

    const DOMAIN_STATUS_ICON: Record<DomainStatus, string> = {
      idle: 'mdi:alert-circle',
      checking: 'mdi:loading',
      available: 'mdi:check-circle',
      taken: 'mdi:alert-circle',
      invalid: 'mdi:alert-circle',
      tooShort: 'mdi:alert-circle',
      reserved: 'mdi:alert-circle',
      empty: 'mdi:alert-circle',
    }

    const DOMAIN_STATUS_COLOR = {
      available: 'text-[#16A34A] dark:text-[#86EFAC]',
      checking: 'text-[#888] dark:text-[#71717A]',
      error: 'text-[#DC2626] dark:text-[#FCA5A5]',
    }

    const domainStatusIcon = computed(() => DOMAIN_STATUS_ICON[domainStatus.value])
    const domainStatusColor = computed(() => {
      if (domainStatus.value === 'available') return DOMAIN_STATUS_COLOR.available
      if (domainStatus.value === 'checking') return DOMAIN_STATUS_COLOR.checking
      return DOMAIN_STATUS_COLOR.error
    })

    const summaryRows = computed(() => [
      { label: $t('landing.onboarding.summarySite'), value: form.siteName, icon: 'mdi:web' },
      { label: $t('landing.onboarding.summaryDomain'), value: fullDomainPreview.value, icon: 'mdi:link' },
      {
        label: $t('landing.onboarding.summaryLanguage'),
        value:
          form.language === 'cs' ? `🇨🇿 ${$t('landing.onboarding.langCz')}` : `🇬🇧 ${$t('landing.onboarding.langEn')}`,
        icon: 'mdi:translate',
      },
      { label: $t('landing.onboarding.summaryColor'), value: form.theme, icon: 'mdi:palette', swatch: form.theme },
      {
        label: $t('landing.onboarding.summaryFocus'),
        value: form.focus || $t('landing.onboarding.focusNotSet'),
        icon: 'mdi:target',
      },
      { label: $t('landing.onboarding.summaryAdmin'), value: form.username, icon: 'mdi:account' },
      { label: $t('landing.onboarding.summaryEmail'), value: form.email, icon: 'mdi:email' },
      {
        label: $t('landing.onboarding.summaryPlan'),
        value: form.selectedPlan
          ? $t(`landing.pricing.plans.${form.selectedPlan.toLowerCase()}.name`)
          : $t('landing.onboarding.planFreeAfterTrial'),
        icon: 'mdi:crown-outline',
      },
    ])

    const canAdvanceStep1 = computed(() => !!form.siteName && !!form.domain && domainStatus.value === 'available')
    const canAdvanceStep3 = computed(
      () => !!form.username && !!form.email && !!form.password && form.password === form.passwordConfirm,
    )
    const canAdvanceStep4 = computed(() => !!challenge.value && code.value.length === 6)

    watch(
      () => form.email,
      () => {
        challenge.value = null
        verifiedToken.value = null
        code.value = ''
        codeError.value = ''
      },
    )

    const startResendCooldown = (seconds = 60) => {
      resendCooldown.value = seconds
      if (cooldownTimer) clearInterval(cooldownTimer)
      cooldownTimer = setInterval(() => {
        resendCooldown.value -= 1
        if (resendCooldown.value <= 0 && cooldownTimer) {
          clearInterval(cooldownTimer)
          cooldownTimer = null
        }
      }, 1000)
    }

    onScopeDispose(() => {
      if (cooldownTimer) clearInterval(cooldownTimer)
    })

    const onCodeInput = (ev: Event) => {
      const target = ev.target as HTMLInputElement
      const digitsOnly = target.value.replace(/\D/g, '').slice(0, 6)
      if (digitsOnly !== target.value) target.value = digitsOnly
      code.value = digitsOnly
      if (codeError.value) codeError.value = ''
    }

    const registerCodeInput = (el: HTMLInputElement | null) => {
      codeInputEl = el
    }

    // `turnstileToken` is supplied by the caller (verify.vue owns the
    // <NuxtTurnstile> widget) — it must be a fresh, single-use token.
    const sendCode = async (turnstileToken = '') => {
      if (codeSending.value || resendCooldown.value > 0) return
      if (!form.email) return
      const { $t, toast } = captureI18nToast()
      codeSending.value = true
      codeError.value = ''
      try {
        const res = await $fetch<{ challenge: string }>('/api/send-code', {
          method: 'POST',
          body: {
            email: form.email,
            language: form.language,
            website: form.website,
            turnstileToken,
          },
        })
        challenge.value = res.challenge
        code.value = ''
        verifiedToken.value = null
        startResendCooldown(60)
        toast.success({ message: $t('common.auth.verificationCodeSent') })
        nextTick(() => codeInputEl?.focus())
      } catch (error: any) {
        toast.error({ message: error.data?.message || $t('common.auth.sendCodeFailed') })
      } finally {
        codeSending.value = false
      }
    }

    const verifyCode = async (): Promise<boolean> => {
      if (codeVerifying.value) return false
      if (!challenge.value || code.value.length !== 6) return false
      const { $t } = captureI18nToast()
      codeVerifying.value = true
      codeError.value = ''
      try {
        const res = await $fetch<{ verifiedToken: string }>('/api/verify-code', {
          method: 'POST',
          body: { email: form.email, code: code.value, challenge: challenge.value },
        })
        verifiedToken.value = res.verifiedToken
        return true
      } catch (error: any) {
        const reason = error.data?.data?.reason
        if (reason === 'expired') {
          codeError.value = $t('common.auth.codeExpired')
          challenge.value = null
        } else if (reason === 'mismatch') {
          codeError.value = $t('common.auth.codeMismatch')
        } else {
          codeError.value = error.data?.message || $t('common.auth.verifyFailed')
        }
        return false
      } finally {
        codeVerifying.value = false
      }
    }

    const submit = async () => {
      const { $t, toast } = captureI18nToast()
      if (!form.acceptTos) {
        toast.error({ message: $t('landing.onboarding.tosRequired') })
        return
      }
      if (!form.username || !form.email || !form.password || form.password !== form.passwordConfirm) {
        toast.error({ message: $t('common.auth.passwordsMismatch') })
        return
      }
      if (zxcvbn(form.password).score < 3) {
        toast.error({ message: $t('common.passwordSuggestions.weak') })
        return
      }
      if (!verifiedToken.value) {
        toast.error({ message: $t('common.auth.verifyFailed') })
        return
      }
      loading.value = true
      try {
        const res = await $fetch<{ url?: string }>('/api/checkout', {
          method: 'POST',
          body: {
            siteName: form.siteName,
            domain: form.domain,
            domainType: form.domainType,
            language: form.language,
            theme: form.theme,
            focus: form.focus,
            username: form.username,
            email: form.email,
            password: form.password,
            verifiedToken: verifiedToken.value,
            selectedPlan: form.selectedPlan,
          },
        })
        if (res.url) window.location.href = res.url
      } catch (error: any) {
        toast.error({ message: error.data?.message || $t('common.errors.general') })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      userEditedDomain,
      domainStatus,
      domainStatusIcon,
      domainStatusColor,
      fullDomainPreview,
      challenge,
      verifiedToken,
      code,
      codeSending,
      codeVerifying,
      codeError,
      resendCooldown,
      canAdvanceStep1,
      canAdvanceStep3,
      canAdvanceStep4,
      summaryRows,
      sendCode,
      verifyCode,
      submit,
      onCodeInput,
      registerCodeInput,
    }
  },
  { persist: { pick: ['form'] } },
)
