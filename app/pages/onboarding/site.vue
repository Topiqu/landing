<template>
  <form @submit.prevent="handleSubmit">
    <OnboardingStepSite />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding' })

const { canAdvanceStep1 } = useOnboarding()
const localePath = useLocalePath()

const handleSubmit = () => {
  if (!canAdvanceStep1.value) return
  navigateTo(localePath({ name: 'onboarding-design' }))
}
</script>
