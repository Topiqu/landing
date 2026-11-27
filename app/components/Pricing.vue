<script setup lang="ts">
import type { BillingInterval } from '~~/shared/utils/plans'

import {
  annualPlanPriceUsd,
  ARTICLE_ROLLOVER_MONTHS,
  EXTRA_SEAT_PRICE_USD,
  EXTRA_TRANSLATION_LANGUAGE_PRICE_USD,
  formatUsd,
  KNOWLEDGE_LIMITS,
  PLAN_ARTICLES,
  PLAN_PRICES_USD,
  PREMIUM_VISIBILITY_RESPONSES,
  TEAM_SEATS,
  TRANSLATION_LANGUAGES,
} from '~~/shared/utils/plans'

import PricingArticlePacks from './PricingArticlePacks.vue'
import PricingIntervalToggle from './PricingIntervalToggle.vue'

const { t, tm, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const billingInterval = shallowRef<BillingInterval>(route.query.billing === 'year' ? 'year' : 'month')
// Custom is arranged with us, so it has a strip under the cards instead of a card with a price.
const plans = ['free', 'starter', 'pro', 'premium'] as const
type Plan = (typeof plans)[number]
const excluded = new Set(['no_ai'])
// Starter is the first plan that publishes to the customer's own site, which many visitors don't expect.
const highlighted = new Set(['starter.publishing'])
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
const seats = (plan: Plan) => ({
  seats: { count: TEAM_SEATS[plan], price: formatUsd(EXTRA_SEAT_PRICE_USD, locale.value) },
})
const params = computed<Record<Plan, Params>>(() => ({
  free: seats('free'),
  starter: {
    ...allowance('starter'),
    ...seats('starter'),
    translations: { price: formatUsd(EXTRA_TRANSLATION_LANGUAGE_PRICE_USD, locale.value) },
  },
  pro: {
    ...allowance('pro'),
    ...seats('pro'),
    translations: {
      count: TRANSLATION_LANGUAGES.pro,
      price: formatUsd(EXTRA_TRANSLATION_LANGUAGE_PRICE_USD, locale.value),
    },
  },
  premium: {
    ...allowance('premium'),
    ...seats('premium'),
    translations: { count: TRANSLATION_LANGUAGES.premium },
    visibility: { count: PREMIUM_VISIBILITY_RESPONSES },
  },
}))
const features = (plan: Plan) =>
  Object.keys(tm(`landing.pricing.plans.${plan}.features`) as Record<string, unknown>).map((key) => ({
    key,
    label: t(`landing.pricing.plans.${plan}.features.${key}`, params.value[plan][key] ?? {}),
    excluded: excluded.has(key),
    highlighted: highlighted.has(`${plan}.${key}`),
  }))
// A card shows the start of its list. One switch opens every card, so the plans stay comparable side by side.
const VISIBLE_FEATURES = 6
const expanded = shallowRef(false)
const cards = computed(() =>
  plans.map((plan) => {
    const list = features(plan)
    // Hiding a single line saves nothing and costs a click.
    return { plan, list, collapsible: list.length > VISIBLE_FEATURES + 1 }
  }),
)
const price = (plan: Plan) => {
  const amount = PLAN_PRICES_USD[plan]
  return formatUsd(billingInterval.value === 'year' ? annualPlanPriceUsd(amount) / 12 : amount, locale.value)
}
const yearlyTotal = (plan: Exclude<Plan, 'free'>) => formatUsd(annualPlanPriceUsd(PLAN_PRICES_USD[plan]), locale.value)
const signUp = (plan: Plan) =>
  localePath({
    name: 'onboarding-site',
    // `free` is passed too: it clears a paid plan an earlier click left in the persisted draft.
    query: plan === 'free' ? { plan } : { plan, interval: billingInterval.value },
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
          v-for="{ plan, list, collapsible } in cards"
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
          <div class="plan-features">
            <ul :id="`plan-features-${plan}`" :aria-label="$t('landing.design.allFeatures')">
              <li
                v-for="(feature, index) in list"
                :key="feature.key"
                :class="{ 'feature-excluded': feature.excluded, 'feature-highlighted': feature.highlighted }"
                :hidden="collapsible && !expanded && index >= VISIBLE_FEATURES"
              >
                <Icon :name="feature.excluded ? 'mdi:minus' : 'mdi:check'" /><span>{{ feature.label }}</span>
              </li>
            </ul>
            <button
              v-if="collapsible"
              type="button"
              class="plan-features-toggle"
              :aria-expanded="expanded"
              :aria-controls="`plan-features-${plan}`"
              @click="expanded = !expanded"
            >
              {{
                expanded
                  ? $t('landing.pricing.showFewerFeatures')
                  : $t('landing.pricing.showAllFeatures', { count: list.length })
              }}
              <Icon :name="expanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
            </button>
          </div>
        </article>
      </div>
      <aside class="pricing-custom" aria-labelledby="pricing-custom-title">
        <div>
          <p class="plan-badge">{{ $t('landing.pricing.custom.badge') }}</p>
          <h3 id="pricing-custom-title">{{ $t('landing.pricing.custom.name') }}</h3>
          <p>{{ $t('landing.pricing.custom.text') }}</p>
        </div>
        <UButton
          to="mailto:support@topiqu.com?subject=Custom"
          color="neutral"
          variant="outline"
          size="lg"
          trailingIcon="mdi:arrow-right"
          >{{ $t('landing.pricing.custom.cta') }}</UButton
        >
      </aside>
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
.pricing-custom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 16px;
  padding: 22px 24px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
}
.pricing-custom .plan-badge {
  margin-bottom: 6px;
}
.pricing-custom h3 {
  margin-bottom: 4px;
  font-size: 18px;
  font-weight: 700;
}
.pricing-custom p:not(.plan-badge) {
  max-width: 72ch;
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.6;
}
.pricing-usage-policy {
  margin-top: 24px;
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.6;
}
@media (max-width: 720px) {
  .pricing-header,
  .pricing-custom {
    align-items: start;
    flex-direction: column;
  }
}
</style>
