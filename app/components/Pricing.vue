<script setup lang="ts">
import type { BillingInterval } from '~~/shared/utils/plans'

import {
  annualPlanPriceUsd,
  ARTICLE_ROLLOVER_MONTHS,
  CUSTOM_SEAT_PRICE_USD,
  CUSTOM_SEATS,
  EXTRA_TRANSLATION_LANGUAGE_PRICE_USD,
  formatUsd,
  KNOWLEDGE_LIMITS,
  PLAN_ARTICLES,
  PLAN_PRICES_USD,
  PREMIUM_VISIBILITY_RESPONSES,
  TRANSLATION_LANGUAGES,
} from '~~/shared/utils/plans'

import PricingArticlePacks from './PricingArticlePacks.vue'
import PricingIntervalToggle from './PricingIntervalToggle.vue'

const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const billingInterval = shallowRef<BillingInterval>(route.query.billing === 'year' ? 'year' : 'month')
const plans = ['free', 'pro', 'premium', 'custom'] as const
type Plan = (typeof plans)[number]
const excluded = new Set(['no_ai'])
type Params = Record<string, Record<string, number | string>>
const allowance = (plan: Exclude<Plan, 'free'>): Params => {
  const limits = KNOWLEDGE_LIMITS[plan]
  return {
    articles: { count: PLAN_ARTICLES[plan], cap: PLAN_ARTICLES[plan] * (1 + ARTICLE_ROLLOVER_MONTHS) },
    knowledge: {
      count: limits.sources,
      products: new Intl.NumberFormat(locale.value).format(limits.products),
      characters: new Intl.NumberFormat(locale.value, { notation: 'compact' }).format(limits.characters),
    },
  }
}
const params = computed<Record<Plan, Params>>(() => ({
  free: {},
  pro: {
    ...allowance('pro'),
    translations: {
      count: TRANSLATION_LANGUAGES.pro,
      price: formatUsd(EXTRA_TRANSLATION_LANGUAGE_PRICE_USD, locale.value),
    },
  },
  premium: {
    ...allowance('premium'),
    translations: { count: TRANSLATION_LANGUAGES.premium },
    visibility: { count: PREMIUM_VISIBILITY_RESPONSES },
  },
  custom: {
    ...allowance('custom'),
    seats: { seats: CUSTOM_SEATS, seatPrice: formatUsd(CUSTOM_SEAT_PRICE_USD, locale.value) },
  },
}))
const features = (plan: Plan) =>
  Object.keys(tm(`landing.pricing.plans.${plan}.features`) as Record<string, unknown>).map((key) => ({
    key,
    label: t(`landing.pricing.plans.${plan}.features.${key}`, params.value[plan][key] ?? {}),
    excluded: excluded.has(key),
  }))
const price = (plan: Plan) => {
  const amount = PLAN_PRICES_USD[plan]
  return formatUsd(billingInterval.value === 'year' ? annualPlanPriceUsd(amount) / 12 : amount, locale.value)
}
const yearlyTotal = (plan: 'pro' | 'premium' | 'custom') =>
  formatUsd(annualPlanPriceUsd(PLAN_PRICES_USD[plan]), locale.value)
const signUp = (plan: Plan) =>
  localePath({
    name: 'onboarding-site',
    query: plan !== 'free' ? { plan, interval: billingInterval.value } : undefined,
  })
</script>
<template>
  <section id="pricing" class="landing-section pricing-section">
    <div class="landing-container">
      <div class="pricing-header">
        <div class="section-heading">
          <p class="eyebrow">{{ $t('landing.design.pricingEyebrow') }}</p>
          <h2>{{ $t('landing.pricing.title') }}</h2>
          <p class="section-description">{{ $t('landing.pricing.subtitle') }}</p>
        </div>
        <PricingIntervalToggle v-model="billingInterval" />
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
            <strong>{{ price(plan) }}</strong
            ><span>{{ $t('landing.pricing.month') }}</span>
          </div>
          <p class="plan-billing-note">
            <template v-if="billingInterval === 'year' && plan !== 'free'">
              {{ $t('landing.pricing.billedYearly', { price: yearlyTotal(plan) }) }}
            </template>
          </p>
          <UButton
            :to="signUp(plan)"
            :variant="plan === 'premium' ? 'solid' : 'outline'"
            :color="plan === 'premium' ? 'primary' : 'neutral'"
            size="lg"
            block
            >{{ $t('landing.pricing.plans.' + plan + '.cta') }}</UButton
          >
          <ul :aria-label="$t('landing.design.allFeatures')">
            <li v-for="feature in features(plan)" :key="feature.key" :class="{ 'feature-excluded': feature.excluded }">
              <Icon :name="feature.excluded ? 'mdi:minus' : 'mdi:check'" /><span>{{ feature.label }}</span>
            </li>
          </ul>
        </article>
      </div>
      <p class="pricing-usage-policy">{{ $t('landing.pricing.usagePolicy') }}</p>
      <PricingArticlePacks />
    </div>
  </section>
</template>

<style scoped>
.pricing-header {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 30px;
}
.pricing-header .section-heading {
  margin-bottom: 0;
}
.plan-billing-note {
  min-height: 18px;
  margin: -16px 0 16px;
  color: var(--landing-muted);
  font-size: 11px;
  line-height: 1.5;
}
.pricing-usage-policy {
  margin-top: 24px;
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.6;
}
@media (max-width: 720px) {
  .pricing-header {
    align-items: start;
    flex-direction: column;
  }
}
</style>
