<script setup lang="ts">
import type { BillingInterval } from '~~/shared/utils/plans'

import { ANNUAL_DISCOUNT_RATE } from '~~/shared/utils/plans'

const interval = defineModel<BillingInterval>({ required: true })
const name = `billing-interval-${useId()}`
const options = ['month', 'year'] as const
const savingPercent = Math.round(ANNUAL_DISCOUNT_RATE * 100)
</script>

<template>
  <fieldset class="billing-switch">
    <legend class="billing-switch-legend">{{ $t('landing.pricing.intervalLabel') }}</legend>
    <label v-for="option in options" :key="option" class="billing-switch-option">
      <input v-model="interval" type="radio" :name="name" :value="option" />
      <span>{{ $t(`landing.pricing.interval.${option}`) }}</span>
      <span v-if="option === 'year'" class="billing-switch-saving">−{{ savingPercent }} %</span>
    </label>
  </fieldset>
</template>

<style scoped>
.billing-switch {
  display: inline-flex;
  align-items: stretch;
  gap: 3px;
  margin: 0;
  padding: 4px;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
}
.billing-switch-legend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.billing-switch-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 15px;
  border-radius: 8px;
  color: var(--landing-muted);
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease;
}
.billing-switch-option:has(input:checked) {
  background: var(--landing-tint);
  color: var(--landing-accent);
}
.billing-switch-option:has(input:focus-visible) {
  outline: 2px solid var(--landing-accent);
  outline-offset: 2px;
}
.billing-switch-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}
.billing-switch-saving {
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
@media (prefers-reduced-motion: reduce) {
  .billing-switch-option {
    transition: none;
  }
}
</style>
