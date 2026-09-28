<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { form, fullDomainPreview, goTo } = useOnboarding()
const brandColor = computed(() => THEME_COLORS[form.theme])
const languageOptions = computed(() =>
  CONTENT_LANGUAGES.map((value) => ({ value, label: $t('languages.' + value), code: value.toUpperCase() })),
)
</script>
<template>
  <form class="onb-form" @submit.prevent="goTo('account')">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.design.title') }}</h1>
      <p>{{ $t('landing.onboarding.design.description') }}</p>
    </div>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">{{ $t('landing.onboarding.design.language') }}</legend>
      <div class="onb-choice-grid">
        <label v-for="option in languageOptions" :key="option.value" class="onb-choice">
          <input v-model="form.language" type="radio" name="language" :value="option.value" />
          <span class="onb-language-code" aria-hidden="true">{{ option.code }}</span>
          <span class="onb-choice-text">
            <strong>{{ option.label }}</strong>
          </span>
          <Icon name="mdi:check-circle" class="onb-choice-check" aria-hidden="true" />
        </label>
      </div>
    </fieldset>

    <FormColorPicker v-model="form.theme" :label="$t('landing.onboarding.design.color')" />

    <div class="onb-brand-preview" :style="{ '--brand': brandColor }">
      <span class="onb-brand-swatch" aria-hidden="true">{{ (form.siteName || 'T').charAt(0).toUpperCase() }}</span>
      <span class="onb-choice-text">
        <strong>{{ form.siteName }}</strong>
        <small>{{ fullDomainPreview }} · {{ $t('languages.' + form.language) }}</small>
      </span>
      <span class="onb-brand-cta">{{ $t('landing.onboarding.design.preview') }}</span>
    </div>

    <OnboardingActions back="site" />
  </form>
</template>
<style scoped>
.onb-language-code {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 34px;
  height: 24px;
  border-radius: 6px;
  background: var(--landing-bg);
  border: 1px solid var(--landing-line);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.04em;
}
.onb-choice:has(input:checked) .onb-language-code {
  border-color: var(--landing-accent);
  color: var(--landing-accent);
}
.onb-brand-preview {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border: 1px solid var(--landing-line);
  border-top: 4px solid var(--brand);
  border-radius: var(--ui-radius);
  background: var(--landing-bg);
}
.onb-brand-swatch {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: var(--ui-radius);
  background: var(--brand);
  color: #fff;
  font-weight: 750;
}
.onb-brand-cta {
  margin-left: auto;
  flex-shrink: 0;
  padding: 6px 12px;
  border-radius: var(--ui-radius);
  background: var(--brand);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
</style>
