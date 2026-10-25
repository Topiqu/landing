<template>
  <form class="onb-form" @submit.prevent="handleSubmit">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.verify.title') }}</h1>
      <i18n-t keypath="landing.onboarding.verify.description" tag="p" class="tw:break-words">
        <template #email>
          <strong>{{ form.email }}</strong>
        </template>
      </i18n-t>
    </div>

    <div role="status" aria-live="polite" aria-atomic="true">
      <UAlert
        v-if="status"
        :color="status.color"
        variant="soft"
        :icon="status.icon"
        :title="status.title"
        :description="status.description"
        :ui="{ title: 'tw:break-words', description: 'tw:break-words' }"
      />
    </div>

    <UFormField
      class="verify-field"
      :label="$t('landing.onboarding.verify.code')"
      :error="codeError || undefined"
      :ui="{ labelWrapper: 'tw:justify-center', container: 'tw:flex tw:flex-col tw:items-center' }"
    >
      <UPinInput
        v-model="digits"
        :length="6"
        type="number"
        otp
        size="xl"
        autofocus
        :disabled="busy || codeVerifying || !challenge"
        :ui="{ root: 'tw:gap-1 tw:sm:gap-2 tw:max-w-full', base: 'tw:min-w-0 tw:text-xl tw:font-bold' }"
        :aria-label="$t('landing.onboarding.verify.code')"
      />
    </UFormField>

    <NuxtTurnstile
      v-if="siteKey"
      ref="turnstile"
      v-model="turnstileToken"
      :siteKey="siteKey"
      :options="{
        appearance: 'interaction-only',
        'error-callback': security.fail,
        'expired-callback': security.invalidate,
      }"
    />

    <p class="tw:text-center tw:text-sm tw:text-muted">{{ $t('landing.onboarding.verify.spamHint') }}</p>

    <div class="verify-resend">
      <span>{{ $t('landing.onboarding.verify.notReceived') }}</span>
      <UButton
        type="button"
        color="neutral"
        variant="link"
        :loading="busy"
        :aria-busy="busy"
        :disabled="busy || codeVerifying || !!store.verifiedToken || resendCooldown > 0"
        icon="mdi:email-sync-outline"
        @click="requestCode()"
      >
        {{
          busy
            ? $t('landing.onboarding.verify.sending')
            : resendCooldown > 0
              ? $t('landing.onboarding.verify.resendIn', { seconds: resendCooldown })
              : $t('landing.onboarding.verify.resend')
        }}
      </UButton>
    </div>

    <OnboardingActions
      back="account"
      icon="mdi:check"
      :label="$t('landing.onboarding.verify.submit')"
      :disabled="busy || (!canVerify && !store.verifiedToken)"
      :loading="codeVerifying"
    />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { t } = useI18n()
const store = useOnboardingStore()
const {
  form,
  code,
  codeError,
  codeSending,
  codeDelivery,
  codeSendError,
  codeVerifying,
  resendCooldown,
  challenge,
  canVerify,
  sendCode,
  verifyCode,
  goTo,
} = useOnboarding()

// Marketing pages are prerendered: their embedded runtime config may precede
// the deployment's Turnstile setup. Read the running server's public key here.
const { data: verificationConfig, refresh: refreshConfig } = await useFetch('/api/verification-config', {
  key: 'verification-config',
  retry: 0,
  timeout: 10_000,
})
const siteKey = computed(() => verificationConfig.value?.siteKey ?? '')
const refreshingConfig = shallowRef(false)
const turnstileToken = ref<string>()
const turnstile = useTemplateRef<{ reset: () => void }>('turnstile')
const blocked = computed(
  () => codeSending.value || codeVerifying.value || !!store.verifiedToken || resendCooldown.value > 0,
)
const security = useVerificationCodeRequest({
  siteKey,
  token: turnstileToken,
  blocked,
  send: sendCode,
  reset: () => turnstile.value?.reset(),
})
const busy = computed(() => refreshingConfig.value || security.waiting.value || codeSending.value)
const status = computed(() => {
  if (busy.value) {
    return null
  }
  if (security.error.value || codeSendError.value) {
    return {
      color: 'error' as const,
      icon: 'mdi:alert-circle-outline',
      title: t('landing.onboarding.verify.sendError'),
      description: security.error.value
        ? t(`landing.onboarding.verify.${security.error.value === 'unavailable' ? 'unavailable' : 'securityFailed'}`)
        : codeSendError.value,
    }
  }
  if (codeDelivery.value === 'sent') {
    return {
      color: 'success' as const,
      icon: 'mdi:email-check-outline',
      title: t('landing.onboarding.verify.sent'),
    }
  }
  if (codeDelivery.value === 'development') {
    return {
      color: 'warning' as const,
      icon: 'mdi:information-outline',
      title: t('landing.onboarding.verify.development'),
    }
  }
  return null
})

const digits = computed({
  get: () => code.value.split('').map(Number),
  set: (value: number[]) => {
    code.value = value.filter(Number.isInteger).join('').slice(0, 6)
    codeError.value = ''
  },
})

const requestCode = async () => {
  if (busy.value || blocked.value) return
  if (!siteKey.value) {
    refreshingConfig.value = true
    try {
      await refreshConfig()
      await nextTick()
    } finally {
      refreshingConfig.value = false
    }
  }
  await security.request()
}

onMounted(() => {
  if (!store.challenge && !store.verifiedToken) requestCode()
})

const handleSubmit = async () => {
  if (store.verifiedToken) return goTo('summary')
  if (busy.value || !canVerify.value || codeVerifying.value) return
  if (await verifyCode()) goTo('summary')
}

// Tokens can refresh in the background; only mount or an explicit resend sends mail.
watch(code, () => {
  if (canVerify.value && !codeVerifying.value) handleSubmit()
})
</script>

<style scoped>
.verify-field {
  text-align: center;
}
.verify-resend {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--landing-muted);
  font-size: 13px;
}
</style>
