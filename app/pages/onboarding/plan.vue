<template>
  <form @submit.prevent="handleSubmit">
    <OnboardingStepPlan />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const localePath = useLocalePath()

const handleSubmit = () => {
  navigateTo(localePath({ name: 'onboarding-verify' }))
}
</script>
