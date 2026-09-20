<script setup lang="ts">
const { tm, rt } = useI18n()
const localePath = useLocalePath()
const plans = ['free', 'pro', 'premium', 'custom'] as const
</script>
<template>
  <section id="pricing" class="landing-section pricing-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.pricingEyebrow') }}</p>
        <h2>{{ $t('landing.pricing.title') }}</h2>
        <p class="section-description">{{ $t('landing.pricing.subtitle') }}</p>
      </div>
      <div class="pricing-grid">
        <article
          v-for="plan in plans"
          :key="plan"
          class="pricing-plan"
          :class="{ 'plan-featured': plan === 'premium' }"
        >
          <p class="plan-badge">{{ $t('landing.pricing.plans.' + plan + '.badge') }}</p>
          <h3>{{ $t('landing.pricing.plans.' + plan + '.name') }}</h3>
          <p class="plan-description">{{ $t('landing.pricing.plans.' + plan + '.desc') }}</p>
          <div class="plan-price">
            <strong>{{ $t('landing.pricing.plans.' + plan + '.price') }}</strong
            ><span v-if="plan !== 'custom'">{{ $t('landing.pricing.month') }}</span>
          </div>
          <UButton
            :to="plan === 'custom' ? 'mailto:support@topiqu.com' : localePath({ name: 'onboarding-site' })"
            :variant="plan === 'premium' ? 'solid' : 'outline'"
            :color="plan === 'premium' ? 'primary' : 'neutral'"
            size="lg"
            block
            >{{ $t('landing.pricing.plans.' + plan + '.cta') }}</UButton
          >
          <ul :aria-label="$t('landing.design.allFeatures')">
            <li v-for="(feature, key) in tm('landing.pricing.plans.' + plan + '.features')" :key="key">
              <Icon :name="key === 'no_ai' ? 'mdi:minus' : 'mdi:check'" /><span>{{ rt(feature) }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>
