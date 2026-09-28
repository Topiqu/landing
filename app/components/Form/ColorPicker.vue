<script setup lang="ts">
const { label } = defineProps<{ label: string }>()
const modelValue = defineModel<ThemeKey>({ required: true })
const colors = Object.entries(THEME_COLORS) as [ThemeKey, string][]
</script>
<template>
  <fieldset class="onb-fieldset">
    <legend class="onb-legend">{{ label }}</legend>
    <div class="color-grid">
      <label
        v-for="[name, hex] in colors"
        :key="name"
        class="color-swatch"
        :title="$t('landing.onboarding.colors.' + name)"
        :style="{ '--swatch': hex }"
      >
        <input
          v-model="modelValue"
          type="radio"
          name="brand-color"
          :value="name"
          :aria-label="$t('landing.onboarding.colors.' + name)"
        />
        <Icon name="mdi:check-bold" aria-hidden="true" />
      </label>
    </div>
  </fieldset>
</template>
<style scoped>
.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(44px, 1fr));
  gap: 10px;
}
.color-swatch {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  min-height: 44px;
  border-radius: var(--ui-radius);
  background: var(--swatch);
  color: #fff;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgb(15 23 42 / 12%);
  transition: transform 0.15s;
}
.color-swatch:hover {
  transform: scale(1.05);
}
.color-swatch input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.color-swatch .iconify {
  font-size: 20px;
  visibility: hidden;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 35%));
}
.color-swatch:has(input:checked) {
  outline: 3px solid var(--landing-accent);
  outline-offset: 2px;
}
.color-swatch:has(input:checked) .iconify {
  visibility: visible;
}
.color-swatch:has(input:focus-visible) {
  outline: 3px solid var(--landing-ink);
  outline-offset: 2px;
}
</style>
