<script setup lang="ts">
const localePath = useLocalePath()
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }
</script>
<template>
  <section class="hero-section">
    <div class="landing-container hero-grid">
      <div class="hero-copy">
        <p class="eyebrow">{{ $t('landing.design.hero.kicker') }}</p>
        <h1>
          {{ $t('landing.design.hero.title') }} <span>{{ $t('landing.design.hero.accent') }}</span>
        </h1>
        <p class="hero-description">{{ $t('landing.design.hero.description') }}</p>
        <div class="hero-actions">
          <UButton :to="localePath({ name: 'onboarding-site' })" size="xl" trailingIcon="mdi:arrow-right">{{
            $t('landing.design.hero.cta')
          }}</UButton>
          <UButton to="#specs" color="neutral" variant="link" size="lg" trailingIcon="mdi:arrow-down">{{
            $t('landing.design.hero.secondary')
          }}</UButton>
        </div>
        <p class="hero-note">
          {{ $t('landing.design.hero.note', trial) }}
        </p>
      </div>
      <ProductPreview />
    </div>
  </section>
</template>
