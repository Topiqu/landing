<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <HeroScene />
    <div class="landing-container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">{{ $t('landing.design.hero.kicker') }}</p>
        <h1 id="hero-title">
          {{ $t('landing.design.hero.title') }} <span>{{ $t('landing.design.hero.accent') }}</span>
        </h1>
        <p class="hero-description">{{ $t('landing.design.hero.description') }}</p>
        <form class="hero-signup" @submit.prevent="startOnboarding">
          <label for="hero-email" class="hero-email-label">{{ $t('landing.onboarding.account.email') }}</label>
          <input
            id="hero-email"
            v-model.trim="email"
            name="email"
            type="email"
            autocomplete="email"
            autocapitalize="off"
            :spellcheck="false"
            required
            maxlength="254"
            :placeholder="$t('landing.design.hero.emailPlaceholder')"
            aria-describedby="hero-note"
          />
          <UButton type="submit" size="xl" trailingIcon="mdi:arrow-right">{{ $t('landing.design.hero.cta') }}</UButton>
        </form>
        <p id="hero-note" class="hero-note">
          {{ $t('landing.design.hero.note', trial) }}
        </p>
        <UButton
          to="#specs"
          color="neutral"
          variant="link"
          size="lg"
          trailingIcon="mdi:arrow-down"
          class="hero-secondary"
          >{{ $t('landing.design.hero.secondary') }}</UButton
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }
const email = shallowRef('')

const startOnboarding = () => {
  const store = useOnboardingStore()
  store.form.email = email.value.trim()
  return navigateTo(localePath({ name: 'onboarding-site' }))
}
</script>
