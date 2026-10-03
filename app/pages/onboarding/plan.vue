<script setup lang="ts">
import PricingIntervalToggle from '../../components/PricingIntervalToggle.vue'
import {
  annualPlanPriceUsd,
  formatUsd,
  PLAN_ARTICLES,
  PLAN_PRICES_USD,
  TRIAL_ARTICLES,
  TRIAL_DAYS,
} from '../../../shared/utils/plans'

definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { locale, tm, rt } = useI18n()
const { form, trialEndsOn, complete } = useOnboarding()
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }

const plans = computed(() =>
  (
    [
      { id: null, key: 'free', icon: 'mdi:feather', articles: 0 },
      { id: 'PRO', key: 'pro', icon: 'mdi:rocket-launch-outline', articles: PLAN_ARTICLES.pro },
      { id: 'PREMIUM', key: 'premium', icon: 'mdi:crown-outline', articles: PLAN_ARTICLES.premium },
    ] as const
  ).map((plan) => ({
    ...plan,
    name: $t(`landing.pricing.plans.${plan.key}.name`),
    price: formatUsd(
      form.billingInterval === 'year' ? annualPlanPriceUsd(PLAN_PRICES_USD[plan.key]) / 12 : PLAN_PRICES_USD[plan.key],
      locale.value,
    ),
    yearlyTotal: plan.id ? formatUsd(annualPlanPriceUsd(PLAN_PRICES_USD[plan.key]), locale.value) : null,
    tagline: $t(`landing.onboarding.plan.${plan.key}.tagline`),
    features: (tm(`landing.onboarding.plan.${plan.key}.features`) as string[]).map((feature) =>
      rt(feature, { articles: plan.articles }),
    ),
  })),
)

const note = computed(() =>
  form.selectedPlan
    ? $t('landing.onboarding.plan.paidNote', {
        date: new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(trialEndsOn.value),
      })
    : $t('landing.onboarding.plan.freeNote', { days: TRIAL_DAYS }),
)
</script>
<template>
  <form class="onb-form" @submit.prevent="complete('plan')">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.plan.title') }}</h1>
      <p>{{ $t('landing.onboarding.plan.description', trial) }}</p>
    </div>

    <div class="plan-interval">
      <PricingIntervalToggle v-model="form.billingInterval" />
    </div>

    <fieldset class="onb-fieldset">
      <legend class="tw:sr-only">{{ $t('landing.onboarding.plan.title') }}</legend>
      <div class="plan-grid">
        <label v-for="plan in plans" :key="plan.key" class="plan-card" :data-plan="plan.key">
          <input v-model="form.selectedPlan" type="radio" name="plan" :value="plan.id" />
          <span class="plan-card-top">
            <span class="plan-card-icon"><Icon :name="plan.icon" aria-hidden="true" /></span>
            <Icon name="mdi:check-circle" class="onb-choice-check" aria-hidden="true" />
          </span>
          <strong class="plan-card-name">{{ plan.name }}</strong>
          <span class="plan-card-tagline">{{ plan.tagline }}</span>
          <span class="plan-card-price"
            ><strong>{{ plan.price }}</strong> {{ $t('landing.pricing.month') }}</span
          >
          <span v-if="form.billingInterval === 'year' && plan.yearlyTotal" class="plan-card-yearly">
            {{ $t('landing.pricing.billedYearly', { price: plan.yearlyTotal }) }}
          </span>
          <ul>
            <li v-for="feature in plan.features" :key="feature">
              <Icon name="mdi:check" aria-hidden="true" />{{ feature }}
            </li>
          </ul>
        </label>
      </div>
    </fieldset>

    <div class="onb-note" role="status">
      <Icon :name="form.selectedPlan ? 'mdi:credit-card-outline' : 'mdi:gift-outline'" aria-hidden="true" />
      <span>{{ note }}</span>
    </div>

    <OnboardingActions back="design" skip="plan" />
  </form>
</template>
<style scoped>
.plan-interval {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.plan-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.plan-card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 18px 20px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  cursor: pointer;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}
.plan-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px -24px #0f172a66;
}
.plan-card:has(input:checked) {
  border-color: var(--landing-accent);
  background: var(--landing-tint);
  box-shadow: inset 0 3px 0 var(--landing-accent);
}
.plan-card:has(input:focus-visible) {
  outline: 3px solid var(--landing-accent);
  outline-offset: 2px;
}
.plan-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.plan-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
.plan-card:has(input:checked) .onb-choice-check {
  visibility: visible;
}
.plan-card-icon {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: var(--ui-radius);
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 20px;
}
.plan-card:has(input:checked) .plan-card-icon {
  background: var(--landing-surface);
}
.plan-card-name {
  font-size: 17px;
}
.plan-card-tagline {
  color: var(--landing-muted);
  font-size: 12px;
  line-height: 1.5;
  min-height: 36px;
}
.plan-card-price {
  margin: 10px 0 12px;
  color: var(--landing-muted);
  font-size: 12px;
}
.plan-card-price strong {
  color: var(--landing-ink);
  font-size: 24px;
  letter-spacing: -0.03em;
}
.plan-card-yearly {
  margin: -10px 0 10px;
  color: var(--landing-muted);
  font-size: 11px;
  line-height: 1.4;
}
.plan-card ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 12px 0 0;
  list-style: none;
  border-top: 1px solid var(--landing-line);
}
.plan-card li {
  display: flex;
  gap: 6px;
  font-size: 12px;
  line-height: 1.5;
}
.plan-card li .iconify {
  flex-shrink: 0;
  margin-top: 2px;
  color: var(--landing-accent);
}
@media (max-width: 640px) {
  .plan-grid {
    grid-template-columns: 1fr;
  }
  .plan-card-tagline {
    min-height: 0;
  }
}
</style>
