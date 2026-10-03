<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const store = useOnboardingStore()
const {
  form,
  code,
  codeError,
  codeSending,
  codeVerifying,
  resendCooldown,
  challenge,
  canVerify,
  sendCode,
  verifyCode,
  goTo,
} = useOnboarding()

const route = useRoute()
const router = useRouter()

const digits = computed({
  get: () => code.value.split('').map(Number),
  set: (value: number[]) => {
    code.value = value
      .filter((digit) => Number.isInteger(digit))
      .join('')
      .slice(0, 6)
    if (codeError.value) codeError.value = ''
  },
})

// verify.vue owns the Turnstile widget. Tokens are single-use and expire, so we
// pass a fresh one into sendCode and reset the widget afterwards. sendCode is
// only ever triggered from an explicit requestCode() (mount + resend) — there is
// deliberately NO standing watcher on the token, so a background token refresh
// can never fire a stray sendCode (which would wipe verifiedToken mid-verify).
const turnstileToken = ref<string>()
const turnstile = useTemplateRef<{ reset: () => void }>('turnstile')

// Resolve with the current token, or wait (scoped) for the next one if the
// widget hasn't produced it yet (mount race).
const nextToken = (): Promise<string> => {
  if (turnstileToken.value) return Promise.resolve(turnstileToken.value)
  return new Promise((resolve, reject) => {
    const stop = watch(turnstileToken, (t) => {
      if (t) {
        stop()
        resolve(t)
      }
    })
    setTimeout(() => {
      stop()
      reject(new Error('turnstile-timeout'))
    }, 20_000)
  })
}

const requestCode = async () => {
  if (codeSending.value || resendCooldown.value > 0) return
  let token: string
  try {
    token = await nextToken()
  } catch {
    return // no token yet; the user can retry with the resend button
  }
  await sendCode(token)
  // Invalidate the used token so the next request waits for a fresh one.
  turnstile.value?.reset()
  turnstileToken.value = undefined
}

onMounted(() => {
  // Magic link from the email: /onboarding/verify?code=…&token=<challenge>.
  // Seed the store and let the auto-submit watcher verify it, then strip the
  // sensitive params from the address bar.
  const qCode = String(route.query.code ?? '')
  const qToken = String(route.query.token ?? '')
  if (/^\d{6}$/.test(qCode) && qToken) {
    challenge.value = qToken
    code.value = qCode
    router.replace({ query: {} })
    return
  }
  if (!store.challenge && !store.verifiedToken) requestCode()
})

const handleSubmit = async () => {
  if (store.verifiedToken) return goTo('summary')
  if (!canVerify.value || codeVerifying.value) return
  if (await verifyCode()) goTo('summary')
}

// Auto-submit as soon as a full 6-digit code is present — covers paste, OS
// one-time-code autofill, and the emailed magic link. handleSubmit self-guards.
watch(code, () => {
  if (canVerify.value && !codeVerifying.value) handleSubmit()
})
</script>
<template>
  <form class="onb-form" @submit.prevent="handleSubmit">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.verify.title') }}</h1>
      <i18n-t keypath="landing.onboarding.verify.description" tag="p">
        <template #email>
          <strong>{{ form.email }}</strong>
        </template>
      </i18n-t>
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
        :disabled="codeVerifying || !challenge"
        :ui="{ root: 'tw:gap-2', base: 'tw:text-xl tw:font-bold' }"
        :aria-label="$t('landing.onboarding.verify.code')"
      />
    </UFormField>

    <NuxtTurnstile ref="turnstile" v-model="turnstileToken" :options="{ appearance: 'interaction-only' }" />

    <div class="verify-resend">
      <span>{{ $t('landing.onboarding.verify.notReceived') }}</span>
      <UButton
        type="button"
        color="neutral"
        variant="link"
        :loading="codeSending"
        :disabled="codeSending || resendCooldown > 0"
        icon="mdi:email-sync-outline"
        @click="requestCode()"
      >
        {{
          resendCooldown > 0
            ? $t('landing.onboarding.verify.resendIn', { seconds: resendCooldown })
            : $t('landing.onboarding.verify.resend')
        }}
      </UButton>
    </div>

    <OnboardingActions
      back="account"
      icon="mdi:check"
      :label="$t('landing.onboarding.verify.submit')"
      :disabled="!canVerify && !store.verifiedToken"
      :loading="codeVerifying"
    />
  </form>
</template>
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
