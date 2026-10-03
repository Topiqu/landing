<template>
  <div class="onb-actions">
    <UButton
      v-if="back"
      type="button"
      color="neutral"
      variant="soft"
      size="lg"
      icon="mdi:arrow-left"
      @click="goTo(back)"
    >
      {{ $t('landing.onboarding.back') }}
    </UButton>
    <div class="onb-actions-forward">
      <UButton v-if="skip" type="button" color="neutral" variant="ghost" size="lg" @click="skipStep(skip)">
        {{ $t('landing.onboarding.skip') }}
      </UButton>
      <UButton type="submit" size="lg" :trailingIcon="icon" :disabled="disabled || loading" :loading="loading">
        {{ label ?? $t('landing.onboarding.continue') }}
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  back,
  skip,
  label,
  disabled = false,
  loading = false,
  icon = 'mdi:arrow-right',
} = defineProps<{
  back?: OnboardingStep
  // The optional step this form belongs to; shows a skip button next to Continue.
  skip?: OnboardingStep
  label?: string
  disabled?: boolean
  loading?: boolean
  icon?: string
}>()
const { goTo, skip: skipStep } = useOnboarding()
</script>
