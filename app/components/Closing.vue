<script setup lang="ts">
const localePath = useLocalePath()
const trialDays = TRIAL_DAYS
</script>

<template>
  <section class="landing-section closing-section">
    <div class="landing-container closing-inner">
      <div>
        <p class="eyebrow">{{ $t('landing.design.closing.eyebrow') }}</p>
        <h2>{{ $t('landing.design.closing.title') }}</h2>
        <p>{{ $t('landing.design.closing.text', { days: trialDays }) }}</p>
      </div>
      <UButton :to="localePath({ name: 'onboarding-site' })" size="xl" trailingIcon="mdi:arrow-right">{{
        $t('landing.design.hero.cta')
      }}</UButton>
    </div>
  </section>
</template>
