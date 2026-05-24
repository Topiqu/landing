<template>
  <form @submit.prevent="store.submit()">
    <OnboardingStepSummary />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const store = useOnboardingStore()
</script>
