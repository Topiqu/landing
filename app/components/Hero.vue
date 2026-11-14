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
        <LeadForm id="hero" source="hero" />
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
