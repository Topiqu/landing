<template>
  <div class="onb-form">
    <div class="onb-heading">
      <h1 id="onboarding-title">
        {{ $t(verified ? 'landing.onboarding.verify.verified' : 'landing.onboarding.verify.title') }}
      </h1>
      <p v-if="verified" class="tw:break-words">{{ store.form.email }}</p>
    </div>
    <p v-if="!pending && !verified" role="alert" class="tw:text-error">
      {{ store.codeError || $t('common.auth.verifyFailed') }}
    </p>
    <div role="status" aria-live="polite" class="tw:space-y-4">
      <p v-if="shared">{{ $t('landing.onboarding.verify.continueInOriginalTab') }}</p>
      <p v-else-if="!pending && needsManualHandoff">
        {{ $t('landing.onboarding.verify.enterCodeInOriginalTab') }}
      </p>
      <UButton v-if="pending" type="button" loading disabled>
        {{ $t('landing.onboarding.verify.verifying') }}
      </UButton>
      <UButton
        v-else-if="!shared"
        :to="continuePath"
        :color="needsManualHandoff ? 'neutral' : 'primary'"
        :variant="needsManualHandoff ? 'outline' : 'solid'"
        trailingIcon="mdi:arrow-right"
      >
        {{ $t(continueLabel) }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { readVerificationLink } from '~/utils/verificationLink'

definePageMeta({ layout: 'onboarding', onboardingStep: 'verify' })

const store = useOnboardingStore()
const { share, shared } = useOnboardingVerification()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const pending = shallowRef(true)
const verified = shallowRef(false)
const needsManualHandoff = computed(() => verified.value && !shared.value && !!store.form.siteName)
const continueLabel = computed(() =>
  needsManualHandoff.value
    ? 'landing.onboarding.verify.continueHere'
    : verified.value
      ? 'landing.onboarding.continue'
      : 'landing.onboarding.verify.linkBack',
)
const continuePath = computed(() => {
  const step = !store.form.siteName ? 'site' : store.canAdvanceAccount && store.verifiedToken ? 'summary' : 'account'
  return localePath({ name: stepRouteName(step) })
})

onMounted(async () => {
  const link = readVerificationLink(route.query, route.hash)
  store.codeError = ''
  // This page has no wizard guard, so clearing the URL cannot redirect before verification.
  await router.replace({ query: {}, hash: '' })
  try {
    if (!link) return
    verified.value = await store.verifyCode(link)
    if (!verified.value) return
    if (store.form.siteName && store.canAdvanceAccount) {
      store.markStep('verify', 'done')
      await navigateTo(continuePath.value, { replace: true })
    } else {
      await share(link.challenge)
    }
  } finally {
    pending.value = false
  }
})
</script>
