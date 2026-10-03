<script setup lang="ts">
import { annualPlanPriceUsd, formatUsd, PLAN_PRICES_USD } from '../../../shared/utils/plans'

definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { locale } = useI18n()
const store = useOnboardingStore()
const { submit, form, loading, fullDomainPreview, brandAccent, trialEndsOn, goTo } = useOnboarding()
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }
const planValue = computed(() => {
  const plan = form.selectedPlan?.toLowerCase() as 'pro' | 'premium' | undefined
  const name = $t(`landing.pricing.plans.${plan ?? 'free'}.name`)
  if (!plan) return name
  const monthlyPrice = PLAN_PRICES_USD[plan]
  const annual = form.billingInterval === 'year'
  const amount = annual ? annualPlanPriceUsd(monthlyPrice) : monthlyPrice
  return `${name} · ${formatUsd(amount, locale.value)} ${$t(`landing.pricing.${annual ? 'year' : 'month'}`)}`
})

// Optional steps the visitor jumped over; their rows show the defaults the blog starts with.
const unfilled = computed(() => OPTIONAL_STEPS.filter((step) => !store.isStepComplete(step)))
const unfilledLabels = computed(() => unfilled.value.map((step) => $t('landing.onboarding.steps.' + step)).join(', '))

const rows = computed(() => [
  { key: 'site', icon: 'mdi:web', value: form.siteName, step: 'site' as const },
  { key: 'domain', icon: 'mdi:link-variant', value: fullDomainPreview.value, step: 'site' as const },
  { key: 'language', icon: 'mdi:translate', value: $t('languages.' + form.language), step: 'site' as const },
  {
    key: 'color',
    icon: 'mdi:palette-outline',
    value: form.accentColor
      ? `${$t('landing.onboarding.design.customColor')} · ${brandAccent.value}`
      : $t('landing.onboarding.colors.' + form.theme),
    swatch: brandAccent.value,
    step: 'design' as const,
  },
  {
    key: 'typography',
    icon: 'mdi:format-font',
    value: [
      $t(`landing.onboarding.design.typefaces.${form.typography.toLowerCase()}`),
      form.gradient && $t(`landing.onboarding.design.gradients.${form.gradient}`),
    ]
      .filter(Boolean)
      .join(' · '),
    step: 'design' as const,
  },
  ...(form.tagline.trim()
    ? [{ key: 'tagline', icon: 'mdi:format-quote-open', value: form.tagline.trim(), step: 'design' as const }]
    : []),
  { key: 'admin', icon: 'mdi:account-outline', value: form.username, step: 'account' as const },
  { key: 'email', icon: 'mdi:email-outline', value: form.email, step: 'account' as const },
  {
    key: 'plan',
    icon: 'mdi:crown-outline',
    value: planValue.value,
    step: 'plan' as const,
  },
])

const paidNote = computed(() =>
  $t('landing.onboarding.plan.paidNote', {
    date: new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(trialEndsOn.value),
  }),
)
</script>
<template>
  <form class="onb-form" @submit.prevent="submit">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.summary.title') }}</h1>
      <p>{{ $t('landing.onboarding.summary.description') }}</p>
    </div>

    <dl class="summary-list">
      <div v-for="row in rows" :key="row.key">
        <Icon :name="row.icon" aria-hidden="true" />
        <dt>{{ $t('landing.onboarding.summary.' + row.key) }}</dt>
        <dd>
          <span v-if="row.swatch" class="summary-swatch" :style="{ backgroundColor: row.swatch }" aria-hidden="true" />
          <span class="summary-value">{{ row.value }}</span>
          <UBadge v-if="unfilled.includes(row.step)" color="warning" variant="soft" size="sm">{{
            $t('landing.onboarding.summary.default')
          }}</UBadge>
        </dd>
        <UButton
          v-if="row.key !== 'email'"
          type="button"
          color="neutral"
          variant="link"
          size="sm"
          class="summary-edit"
          :aria-label="`${$t('landing.onboarding.summary.edit')}: ${$t('landing.onboarding.summary.' + row.key)}`"
          @click="goTo(row.step)"
          >{{ $t('landing.onboarding.summary.edit') }}</UButton
        >
      </div>
    </dl>

    <div v-if="unfilled.length" class="onb-note summary-unfilled" role="status">
      <Icon name="mdi:progress-pencil" aria-hidden="true" />
      <span>
        <strong>{{ $t('landing.onboarding.summary.unfilledTitle', { steps: unfilledLabels }) }}</strong>
        {{ $t('landing.onboarding.summary.unfilledText') }}
      </span>
      <UButton type="button" color="neutral" variant="outline" size="sm" @click="goTo(unfilled[0]!)">
        {{ $t('landing.onboarding.summary.unfilledAction') }}
      </UButton>
    </div>

    <div class="onb-note">
      <Icon :name="form.selectedPlan ? 'mdi:credit-card-outline' : 'mdi:gift-outline'" aria-hidden="true" />
      <span>
        {{ $t('landing.onboarding.summary.trialHint', trial) }}
        {{ form.selectedPlan ? paidNote : $t('landing.onboarding.plan.freeNote', trial) }}
      </span>
    </div>

    <UCheckbox v-model="form.acceptTos" required>
      <template #label>
        <i18n-t keypath="landing.onboarding.summary.acceptTos" tag="span">
          <template #tos>
            <NuxtLinkLocale to="/tos" target="_blank" class="summary-link">{{
              $t('landing.onboarding.summary.tos')
            }}</NuxtLinkLocale>
          </template>
          <template #privacy>
            <NuxtLinkLocale to="/privacy" target="_blank" class="summary-link">{{
              $t('landing.onboarding.summary.privacy')
            }}</NuxtLinkLocale>
          </template>
        </i18n-t>
      </template>
    </UCheckbox>

    <OnboardingActions
      back="verify"
      :icon="form.selectedPlan ? 'mdi:credit-card-outline' : 'mdi:rocket-launch-outline'"
      :label="
        form.selectedPlan ? $t('landing.onboarding.summary.createPaid') : $t('landing.onboarding.summary.createFree')
      "
      :disabled="!form.acceptTos"
      :loading="loading"
    />
  </form>
</template>
<style scoped>
.summary-list {
  margin: 0;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  overflow: hidden;
}
.summary-list > div {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 12px 8px 16px;
  border-top: 1px solid var(--landing-line);
}
.summary-list > div:first-child {
  border-top: 0;
}
.summary-list .iconify {
  flex-shrink: 0;
  color: var(--landing-muted);
  font-size: 18px;
}
.summary-list dt {
  flex-shrink: 0;
  width: 130px;
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.summary-list dd {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  margin: 0;
  font-weight: 650;
}
.summary-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.summary-swatch {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgb(15 23 42 / 15%);
}
.summary-edit {
  margin-left: auto;
  flex-shrink: 0;
}
.summary-unfilled {
  align-items: center;
  background: var(--landing-warn-tint);
}
.summary-unfilled > .iconify {
  align-self: flex-start;
  color: var(--landing-warn);
}
.summary-unfilled > :last-child {
  flex-shrink: 0;
  margin-left: auto;
}
.summary-link {
  color: var(--landing-accent);
  font-weight: 650;
}
@media (max-width: 640px) {
  .summary-list dt {
    width: 92px;
  }
}
</style>
