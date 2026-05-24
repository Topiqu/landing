<template>
  <form @submit.prevent="handleSubmit">
    <OnboardingStepAccount />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { canAdvanceStep3 } = useOnboarding()
const localePath = useLocalePath()

const handleSubmit = () => {
  if (!canAdvanceStep3.value) return
  navigateTo(localePath({ name: 'onboarding-plan' }))
}
</script>
