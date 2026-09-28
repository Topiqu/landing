<script setup lang="ts">
const {
  back,
  label,
  disabled = false,
  loading = false,
  icon = 'mdi:arrow-right',
} = defineProps<{
  back?: OnboardingStep
  label?: string
  disabled?: boolean
  loading?: boolean
  icon?: string
}>()
const { goTo } = useOnboarding()
</script>
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
    <UButton type="submit" size="lg" :trailingIcon="icon" :disabled="disabled || loading" :loading="loading">
      {{ label ?? $t('landing.onboarding.continue') }}
    </UButton>
  </div>
</template>
