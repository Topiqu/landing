<template>
  <form @submit.prevent="handleSubmit">
    <OnboardingStepVerify />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const store = useOnboardingStore()
const { canAdvanceStep4, codeVerifying, verifyCode } = useOnboarding()
const localePath = useLocalePath()

onMounted(() => {
  if (!store.challenge && !store.verifiedToken) store.sendCode()
})

const handleSubmit = async () => {
  if (!canAdvanceStep4.value || codeVerifying.value) return
  const ok = await verifyCode()
  if (ok) navigateTo(localePath({ name: 'onboarding-summary' }))
}
</script>
