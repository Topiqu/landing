<template>
  <div class="agency-calc">
    <form class="agency-calc-controls" :aria-label="$t('agencies.calculator.label')" @submit.prevent>
      <div v-for="control in controls" :key="control.name" class="agency-calc-control">
        <label :for="`agency-calc-${control.name}`">
          {{ control.label }}
          <small>{{ control.hint }}</small>
        </label>
        <p class="agency-calc-value" aria-hidden="true">
          {{ control.value }}<span>{{ control.unit }}</span>
        </p>
        <input
          :id="`agency-calc-${control.name}`"
          v-model.number="order[control.name]"
          type="range"
          :min="control.min"
          :max="control.max"
          :aria-valuetext="`${control.value} ${control.unit}`"
          :style="{ '--fill': `${((order[control.name] - control.min) / (control.max - control.min)) * 100}%` }"
        />
      </div>
      <p class="agency-calc-more">
        {{
          $t('agencies.calculator.more', {
            blogs: SLIDER_MAX,
            credits: (SLIDER_MAX * AGENCY_PACK_CREDITS).toLocaleString(locale),
          })
        }}
      </p>
    </form>

    <div class="agency-invoice">
      <p class="agency-invoice-head">
        {{ $t('agencies.invoice.title') }}
        <small>{{ $t('agencies.invoice.period') }}</small>
      </p>
      <ul>
        <li v-for="line in lines" :key="line.key">
          <span>{{ line.label }}</span
          ><b>{{ usd(line.amount) }}</b>
        </li>
      </ul>
      <p class="agency-invoice-total" aria-live="polite">
        <span>
          {{ $t('agencies.invoice.total') }}
          <small>{{ $t('agencies.invoice.vat') }}</small>
        </span>
        <strong>{{ usd(total) }}</strong>
      </p>
      <i18n-t keypath="agencies.invoice.perClient" tag="p" scope="global" class="agency-invoice-per">
        <template #price>
          <b>{{ usd(Math.round((total / order.blogs) * 100) / 100) }}</b>
        </template>
        <template #credits>
          <b>{{ withUnit(creditsPerBlog, 'credit') }}</b>
        </template>
      </i18n-t>
      <UButton :to="signUp(order)" external size="xl" block class="agency-invoice-cta">
        {{ $t('agencies.invoice.cta') }}
      </UButton>
      <p class="agency-invoice-note">
        {{ $t('agencies.invoice.note', { blogs: AGENCY_LIMITS.minBlogs, packs: AGENCY_LIMITS.minPacks }) }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AgencyOrder } from '~~/shared/utils/plans'

import { AGENCY_LIMITS, AGENCY_PACK_CREDITS, AGENCY_PRICES_USD, agencyPriceUsd, formatUsd } from '~~/shared/utils/plans'

// Sliders stop at 100 to stay precise; larger orders are set in the app after sign-up.
const SLIDER_MAX = 100

const { t, locale } = useI18n()
const signUp = useAgencySignUp()
const order = reactive<AgencyOrder>({ blogs: 5, premium: 1, packs: 6 })
const total = computed(() => agencyPriceUsd(order))
const creditsPerBlog = computed(() => Math.floor((order.packs * AGENCY_PACK_CREDITS) / order.blogs))
const usd = (amount: number) => formatUsd(amount, locale.value)
const withUnit = (count: number, unit: 'blog' | 'credit') => `${count} ${t(`agencies.units.${unit}`, count)}`

// A Premium add-on rides on a blog slot, so there are never more add-ons than blogs.
watch(
  () => order.blogs,
  (blogs) => {
    if (order.premium > blogs) order.premium = blogs
  },
)

const controls = computed(() => [
  {
    name: 'blogs' as const,
    label: t('agencies.calculator.blogs'),
    hint: t('agencies.calculator.blogsHint', { price: usd(AGENCY_PRICES_USD.blog) }),
    min: AGENCY_LIMITS.minBlogs,
    max: SLIDER_MAX,
    value: order.blogs,
    unit: t('agencies.units.blog', order.blogs),
  },
  {
    name: 'premium' as const,
    label: t('agencies.calculator.premium'),
    hint: t('agencies.calculator.premiumHint', { price: usd(AGENCY_PRICES_USD.premium) }),
    min: 0,
    max: order.blogs,
    value: order.premium,
    unit: t('agencies.units.blog', order.premium),
  },
  {
    name: 'packs' as const,
    label: t('agencies.calculator.credits'),
    hint: t('agencies.calculator.creditsHint', { credits: AGENCY_PACK_CREDITS, price: usd(AGENCY_PRICES_USD.pack) }),
    min: AGENCY_LIMITS.minPacks,
    max: SLIDER_MAX,
    value: order.packs * AGENCY_PACK_CREDITS,
    unit: t('agencies.units.credit', order.packs * AGENCY_PACK_CREDITS),
  },
])

const lines = computed(() => [
  {
    key: 'blogs',
    label: t('agencies.invoice.blogs', { count: order.blogs }),
    amount: order.blogs * AGENCY_PRICES_USD.blog,
  },
  {
    key: 'premium',
    label: t('agencies.invoice.premium', { count: order.premium }),
    amount: order.premium * AGENCY_PRICES_USD.premium,
  },
  {
    key: 'packs',
    label: t('agencies.invoice.packs', { count: order.packs, credits: AGENCY_PACK_CREDITS }),
    amount: order.packs * AGENCY_PRICES_USD.pack,
  },
])
</script>

<style scoped>
.agency-calc {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 440px);
  gap: 48px 80px;
  align-items: center;
}
.agency-calc-control + .agency-calc-control {
  margin-top: 36px;
}
.agency-calc-control label {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: baseline;
  gap: 4px 12px;
  font-size: 15px;
  font-weight: 700;
}
.agency-calc-control label small {
  color: var(--landing-muted);
  font-size: 14px;
  font-weight: 500;
}
.agency-calc-value {
  margin: 10px 0 8px;
  font: 600 52px/1 var(--topiqu-font-reading);
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
}
.agency-calc-value span {
  margin-left: 10px;
  color: var(--landing-muted);
  font: 600 16px/1 var(--ui-font-sans);
  letter-spacing: 0;
}
.agency-calc-control input {
  display: block;
  width: 100%;
  height: 28px;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  appearance: none;
}
.agency-calc-control input:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 4px;
  border-radius: 6px;
}
.agency-calc-control input::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--landing-accent) var(--fill), var(--landing-line) var(--fill));
}
.agency-calc-control input::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: var(--landing-line);
}
.agency-calc-control input::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: var(--landing-accent);
}
.agency-calc-control input::-webkit-slider-thumb {
  width: 22px;
  height: 22px;
  margin-top: -8px;
  border: 2px solid var(--landing-accent);
  border-radius: 50%;
  background: var(--landing-surface);
  box-shadow: 0 1px 3px #0f172a40;
  appearance: none;
}
.agency-calc-control input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 2px solid var(--landing-accent);
  border-radius: 50%;
  background: var(--landing-surface);
  box-shadow: 0 1px 3px #0f172a40;
}
.agency-calc-more {
  margin-top: 28px;
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.6;
}
.agency-invoice {
  padding: 36px 36px 28px;
  border-radius: 6px;
  background: var(--landing-surface);
  box-shadow:
    0 1px 2px #0f172a14,
    0 40px 80px -40px color-mix(in srgb, var(--landing-accent) 45%, #0f172a);
}
.agency-invoice-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  padding-bottom: 18px;
  border-bottom: 2px solid var(--landing-ink);
  font: 600 28px/1 var(--topiqu-font-reading);
  letter-spacing: -0.02em;
}
.agency-invoice-head small {
  color: var(--landing-muted);
  font: 600 12px/1 var(--ui-font-sans);
  letter-spacing: 0;
}
.agency-invoice ul {
  margin: 0;
  padding: 10px 0;
  list-style: none;
  font-size: 15px;
}
.agency-invoice li {
  display: flex;
  gap: 8px;
  padding-block: 10px;
}
.agency-invoice li::after {
  content: '';
  order: 1;
  flex: 1;
  min-width: 16px;
  margin-bottom: 6px;
  border-bottom: 1px dotted color-mix(in srgb, var(--landing-muted) 60%, transparent);
}
.agency-invoice li b {
  order: 2;
  font-variant-numeric: tabular-nums;
}
.agency-invoice-total {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  padding-top: 18px;
  border-top: 1px solid var(--landing-line);
  font-weight: 650;
}
.agency-invoice-total small {
  display: block;
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 500;
}
.agency-invoice-total strong {
  font: 600 48px/1 var(--topiqu-font-reading);
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.agency-invoice-per {
  margin-top: 18px;
  padding: 12px 14px;
  border-radius: 8px;
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.6;
}
.agency-invoice-per b {
  color: var(--landing-ink);
}
.agency-invoice-cta {
  margin-top: 22px;
}
.agency-invoice-note {
  margin-top: 12px;
  color: var(--landing-muted);
  font-size: 12px;
  line-height: 1.6;
  text-align: center;
}
@media (max-width: 960px) {
  .agency-calc {
    grid-template-columns: minmax(0, 1fr);
  }
  .agency-invoice {
    width: 100%;
    max-width: 560px;
  }
}
@media (max-width: 600px) {
  .agency-calc-value {
    font-size: 40px;
  }
  .agency-invoice {
    padding: 24px 20px 20px;
  }
  .agency-invoice-total strong {
    font-size: 40px;
  }
}
</style>
