<script setup lang="ts">
import type { BillingInterval } from '../../shared/utils/plans'

import PricingArticlePacks from './PricingArticlePacks.vue'
import PricingIntervalToggle from './PricingIntervalToggle.vue'
import {
  annualPlanPriceUsd,
  formatUsd,
  KNOWLEDGE_SOURCES,
  PLAN_ARTICLES,
  PLAN_PRICES_USD,
  TRIAL_ARTICLES,
  TRIAL_DAYS,
} from '../../shared/utils/plans'

const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const billingInterval = shallowRef<BillingInterval>(route.query.billing === 'year' ? 'year' : 'month')
const plans = ['free', 'pro', 'premium', 'custom'] as const
type Plan = (typeof plans)[number]
const excluded = new Set(['no_ai', 'ads'])
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }
const counts: Record<Plan, Record<string, number>> = {
  free: {},
  pro: { articles: PLAN_ARTICLES.pro, knowledge: KNOWLEDGE_SOURCES.pro },
  premium: { articles: PLAN_ARTICLES.premium, knowledge: KNOWLEDGE_SOURCES.premium },
  custom: { knowledge: KNOWLEDGE_SOURCES.custom },
}
const features = (plan: Plan) =>
  Object.keys(tm(`landing.pricing.plans.${plan}.features`) as Record<string, unknown>).map((key) => ({
    key,
    label: t(`landing.pricing.plans.${plan}.features.${key}`, { count: counts[plan][key] ?? 0 }),
    excluded: excluded.has(key),
  }))
const price = (plan: Plan) => {
  if (plan === 'custom') return t('landing.pricing.plans.custom.price')
  const amount = PLAN_PRICES_USD[plan]
  return formatUsd(billingInterval.value === 'year' ? annualPlanPriceUsd(amount) / 12 : amount, locale.value)
}
const yearlyTotal = (plan: 'pro' | 'premium') => formatUsd(annualPlanPriceUsd(PLAN_PRICES_USD[plan]), locale.value)
const signUp = (plan: Plan) =>
  localePath({
    name: 'onboarding-site',
    query: plan === 'pro' || plan === 'premium' ? { plan, interval: billingInterval.value } : undefined,
  })
</script>
<template>
  <section id="pricing" class="landing-section pricing-section">
    <div class="landing-container">
      <div class="pricing-header">
        <div class="section-heading">
          <p class="eyebrow">{{ $t('landing.design.pricingEyebrow') }}</p>
          <h2>{{ $t('landing.pricing.title') }}</h2>
          <p class="section-description">{{ $t('landing.pricing.subtitle', trial) }}</p>
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
            ><span v-if="plan !== 'custom'">{{ $t('landing.pricing.month') }}</span>
          </div>
          <p class="plan-billing-note">
            <template v-if="billingInterval === 'year' && (plan === 'pro' || plan === 'premium')">
              {{ $t('landing.pricing.billedYearly', { price: yearlyTotal(plan) }) }}
            </template>
          </p>
          <UButton
            :to="plan === 'custom' ? 'mailto:support@topiqu.com' : signUp(plan)"
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
@media (max-width: 720px) {
  .pricing-header {
    align-items: start;
    flex-direction: column;
  }
}
</style>
