<template>
  <form @submit.prevent="handleSubmit">
    <OnboardingStepDesign />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding' })

const localePath = useLocalePath()

const handleSubmit = () => {
  navigateTo(localePath({ name: 'onboarding-account' }))
}
</script>
