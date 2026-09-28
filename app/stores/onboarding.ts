import slugify from 'slugify'
import { defineStore } from 'pinia'
import { zxcvbn } from '@zxcvbn-ts/core'

import type { DomainStatus, OnboardingForm } from '~/composables/useOnboarding'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const normalizeDomain = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*$/, '')
    .replace(/\.$/, '')

export const useOnboardingStore = defineStore(
  'onboarding',
  () => {
    // i18n and toast are resolved lazily instead of at store-setup time: a
    // top-level useI18n()/useToast() throws "Must be called at the top of a
    // setup function" when this store is first instantiated from route
    // middleware (onboarding-guard) during SSR. Async actions capture them
    // before their first await so the Nuxt context is not lost.
    const captureI18nToast = () => {
      const i18n = useNuxtApp().$i18n as {
        t: (k: string, n?: Record<string, unknown>) => string
        locale: { value: string }
      }
      return {
        $t: (k: string, n?: Record<string, unknown>) => i18n.t(k, n),
        locale: i18n.locale.value,
        toast: useLegacyToast(),
      }
    }

    const loading = shallowRef(false)
    const userEditedDomain = shallowRef(false)

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
      theme: 'indigo',
      username: '',
      email: '',
      password: '',
      passwordConfirm: '',
      acceptTos: false,
      website: '',
      selectedPlan: null,
      billingInterval: 'month',
    })

    const domainStatus = shallowRef<DomainStatus>('idle')

    const fullDomainPreview = computed(() =>
      form.domainType === 'SUBDOMAIN' ? `${form.domain}.topiqu.com` : normalizeDomain(form.domain),
    )

    watch(
      () => form.siteName,
      (newName) => {
        if (form.domainType === 'SUBDOMAIN' && !userEditedDomain.value) {
          form.domain = newName ? slugify(newName, { lower: true, strict: true }) : ''
        }
      },
    )

    // An action rather than a watcher: restoring persisted state also changes domainType and
    // must not wipe the restored domain.
    const setDomainType = (type: OnboardingForm['domainType']) => {
      if (type === form.domainType) return
      form.domainType = type
      userEditedDomain.value = false
      form.domain = type === 'SUBDOMAIN' && form.siteName ? slugify(form.siteName, { lower: true, strict: true }) : ''
    }

    const runDomainCheck = useDebounceFn(async (domain: string, type: string) => {
      if (form.domain !== domain || form.domainType !== type) return
      try {
        const res = await $fetch<{ ok: boolean; reason?: DomainStatus }>('/api/check-domain', {
          query: { domain: type === 'CUSTOM' ? normalizeDomain(domain) : domain, type },
        })
        if (form.domain !== domain || form.domainType !== type) return
        domainStatus.value = res.ok ? 'available' : (res.reason ?? 'invalid')
      } catch {
        domainStatus.value = 'idle'
      }
    }, 350)

    watch(
      () => [form.domain, form.domainType] as const,
      ([domain, type]) => {
        if (!domain) {
          domainStatus.value = 'idle'
          return
        }
        domainStatus.value = 'checking'
        runDomainCheck(domain, type)
      },
    )

    const passwordStrong = computed(() => !!form.password && zxcvbn(form.password).score >= 3)

    const canAdvanceSite = computed(() => !!form.siteName.trim() && domainStatus.value === 'available')
    const canAdvanceAccount = computed(
      () =>
        form.username.trim().length >= 3 &&
        EMAIL_RE.test(form.email) &&
        passwordStrong.value &&
        form.password === form.passwordConfirm,
    )
    const canVerify = computed(() => !!challenge.value && code.value.length === 6)

    const trialEndsOn = computed(() => new Date(Date.now() + TRIAL_DAYS * 86_400_000))

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

    // `turnstileToken` is supplied by the caller (verify.vue owns the
    // <NuxtTurnstile> widget) — it must be a fresh, single-use token.
    const sendCode = async (turnstileToken = '') => {
      if (codeSending.value || resendCooldown.value > 0) return
      if (!form.email) return
      const { $t, locale, toast } = captureI18nToast()
      codeSending.value = true
      codeError.value = ''
      try {
        const res = await $fetch<{ challenge: string }>('/api/send-code', {
          method: 'POST',
          body: { email: form.email, locale, website: form.website, turnstileToken },
        })
        challenge.value = res.challenge
        code.value = ''
        verifiedToken.value = null
        startResendCooldown(60)
        toast.success({ message: $t('common.auth.verificationCodeSent') })
      } catch (error: any) {
        toast.error({ message: error.data?.message || $t('common.auth.sendCodeFailed') })
      } finally {
        codeSending.value = false
      }
    }

    const verifyCode = async (): Promise<boolean> => {
      if (codeVerifying.value || !canVerify.value) return false
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
      if (loading.value) return
      const { $t, toast } = captureI18nToast()
      if (!form.acceptTos) {
        toast.error({ message: $t('landing.onboarding.summary.tosRequired') })
        return
      }
      if (!canAdvanceAccount.value) {
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
            siteName: form.siteName.trim(),
            domain: form.domainType === 'CUSTOM' ? normalizeDomain(form.domain) : form.domain,
            domainType: form.domainType,
            language: form.language,
            theme: form.theme,
            username: form.username.trim(),
            email: form.email,
            password: form.password,
            verifiedToken: verifiedToken.value,
            selectedPlan: form.selectedPlan,
            billingInterval: form.billingInterval,
          },
        })
        if (res.url) window.location.href = res.url
      } catch (error: any) {
        const annualUnavailable =
          form.selectedPlan &&
          form.billingInterval === 'year' &&
          (error.statusCode === 503 || error.data?.statusCode === 503)
        toast.error({
          message: annualUnavailable
            ? $t('landing.onboarding.plan.annualUnavailable')
            : error.data?.message || $t('common.errors.general'),
        })
      } finally {
        loading.value = false
      }
    }

    return {
      form,
      loading,
      userEditedDomain,
      domainStatus,
      fullDomainPreview,
      challenge,
      verifiedToken,
      code,
      codeSending,
      codeVerifying,
      codeError,
      resendCooldown,
      passwordStrong,
      canAdvanceSite,
      canAdvanceAccount,
      canVerify,
      trialEndsOn,
      setDomainType,
      sendCode,
      verifyCode,
      submit,
    }
  },
  {
    // Passwords never touch localStorage; a reload sends the visitor back to the account step.
    persist: {
      pick: [
        'form.siteName',
        'form.domain',
        'form.domainType',
        'form.language',
        'form.theme',
        'form.username',
        'form.email',
        'form.selectedPlan',
        'form.billingInterval',
        'userEditedDomain',
      ],
    },
  },
)
