<template>
  <form class="onb-form" @submit.prevent="complete('design')">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.design.title') }}</h1>
      <p>{{ $t('landing.onboarding.design.description') }}</p>
    </div>

    <div class="design-preview" :style="previewStyle" role="img" :aria-label="$t('landing.onboarding.design.preview')">
      <div class="design-preview-hero">
        <span class="design-preview-logo" aria-hidden="true">{{ initial }}</span>
        <span class="design-preview-identity">
          <strong>{{ form.siteName }}</strong>
          <small>{{ form.tagline.trim() || fullDomainPreview }}</small>
        </span>
        <span class="design-preview-cta">{{ $t('landing.onboarding.design.sampleCta') }}</span>
      </div>
      <div class="design-preview-article">
        <span class="design-preview-category">{{ $t('landing.onboarding.design.sampleCategory') }}</span>
        <strong class="design-preview-title">{{ $t('landing.onboarding.design.sampleTitle') }}</strong>
        <p>{{ $t('landing.onboarding.design.sampleExcerpt') }}</p>
        <span class="design-preview-more">
          {{ $t('landing.onboarding.design.sampleMore') }} <Icon name="mdi:arrow-right" aria-hidden="true" />
        </span>
      </div>
    </div>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">
        {{ $t('landing.onboarding.design.color')
        }}<span class="onb-optional">{{ $t('landing.onboarding.optional') }}</span>
      </legend>
      <FormColorPicker
        v-model:theme="form.theme"
        v-model:accent="form.accentColor"
        :label="$t('landing.onboarding.design.color')"
      />
    </fieldset>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">
        {{ $t('landing.onboarding.design.gradient')
        }}<span class="onb-optional">{{ $t('landing.onboarding.optional') }}</span>
      </legend>
      <div class="design-gradients">
        <label v-for="option in gradientOptions" :key="option.value ?? 'none'" class="design-gradient">
          <input v-model="form.gradient" type="radio" name="gradient" :value="option.value" />
          <span class="design-gradient-sample" :style="{ background: option.background }" aria-hidden="true" />
          <span>{{ option.label }}</span>
        </label>
      </div>
      <p class="onb-help">{{ $t('landing.onboarding.design.gradientHelp') }}</p>
    </fieldset>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">
        {{ $t('landing.onboarding.design.typography')
        }}<span class="onb-optional">{{ $t('landing.onboarding.optional') }}</span>
      </legend>
      <div class="design-typefaces">
        <label v-for="option in typographyOptions" :key="option.value" class="onb-choice design-typeface">
          <input v-model="form.typography" type="radio" name="typography" :value="option.value" />
          <span class="onb-choice-text">
            <small>{{ option.label }}</small>
            <strong :style="{ fontFamily: option.fonts.heading }">{{
              $t('landing.onboarding.design.sampleTitle')
            }}</strong>
            <span :style="{ fontFamily: option.fonts.body }">{{ $t('landing.onboarding.design.typeSample') }}</span>
          </span>
          <Icon name="mdi:check-circle" class="onb-choice-check" aria-hidden="true" />
        </label>
      </div>
      <p class="onb-help">{{ $t('landing.onboarding.design.fontsHelp') }}</p>
    </fieldset>

    <UFormField
      :label="$t('landing.onboarding.design.tagline')"
      :hint="`${$t('landing.onboarding.optional')} · ${form.tagline.length}/80`"
    >
      <UInput
        v-model="form.tagline"
        size="lg"
        class="tw:w-full"
        maxlength="80"
        :placeholder="$t('landing.onboarding.design.taglinePlaceholder')"
      />
    </UFormField>

    <OnboardingActions back="site" skip="design" />
  </form>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { form, fullDomainPreview, brandAccent, brandGradientValue, complete } = useOnboarding()

const initial = computed(() => (form.siteName || 'T').charAt(0).toUpperCase())
const gradientOptions = computed(() => [
  {
    value: null,
    label: $t('landing.onboarding.design.gradients.none'),
    background: brandAccent.value,
  },
  ...GRADIENT_STYLES.map((value) => ({
    value,
    label: $t(`landing.onboarding.design.gradients.${value}`),
    background: gradientCss(brandGradient(value, brandAccent.value)),
  })),
])
const typographyOptions = computed(() =>
  TYPOGRAPHY_PRESETS.map((value) => ({
    value,
    label: $t(`landing.onboarding.design.typefaces.${value.toLowerCase()}`),
    fonts: typographyFonts(value),
  })),
)
const previewStyle = computed(() => {
  const fonts = typographyFonts(form.typography)
  return {
    '--brand': brandAccent.value,
    '--brand-hero': brandGradientValue.value
      ? gradientCss(brandGradientValue.value)
      : `color-mix(in srgb, ${brandAccent.value} 10%, var(--landing-surface))`,
    '--brand-hero-ink': brandGradientValue.value ? '#fff' : 'var(--landing-ink)',
    '--heading-font': fonts.heading,
    '--body-font': fonts.body,
  }
})
</script>

<style scoped>
.design-preview {
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-bg);
}
.design-preview-hero {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 18px;
  background: var(--brand-hero);
  color: var(--brand-hero-ink);
  transition: background 0.25s;
}
.design-preview-logo {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border-radius: var(--ui-radius);
  background: var(--brand);
  color: #fff;
  font-weight: 750;
  box-shadow: 0 0 0 2px rgb(255 255 255 / 55%);
}
.design-preview-identity {
  display: grid;
  min-width: 0;
}
.design-preview-identity strong {
  overflow: hidden;
  font-family: var(--heading-font);
  font-size: 16px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.design-preview-identity small {
  overflow: hidden;
  opacity: 0.8;
  font-family: var(--body-font);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.design-preview-cta {
  flex-shrink: 0;
  margin-left: auto;
  padding: 6px 12px;
  border-radius: var(--ui-radius);
  background: var(--brand);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgb(255 255 255 / 35%);
}
.design-preview-article {
  display: grid;
  gap: 6px;
  margin: 14px;
  padding: 16px 18px;
  border: 1px solid var(--landing-line);
  border-radius: var(--ui-radius);
  background: var(--landing-surface);
}
.design-preview-category {
  color: var(--brand);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.design-preview-title {
  font-family: var(--heading-font);
  font-size: 20px;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.design-preview-article p {
  margin: 0;
  color: var(--landing-muted);
  font-family: var(--body-font);
  font-size: 14px;
  line-height: 1.6;
}
.design-preview-more {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--brand);
  font-size: 13px;
  font-weight: 700;
}
.design-gradients {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.design-gradient {
  position: relative;
  display: grid;
  gap: 6px;
  padding: 6px 6px 8px;
  border: 1px solid var(--landing-line);
  border-radius: var(--ui-radius);
  background: var(--landing-surface);
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.15s;
}
.design-gradient:hover {
  border-color: color-mix(in srgb, var(--landing-accent) 50%, var(--landing-line));
}
.design-gradient:has(input:checked) {
  border-color: var(--landing-accent);
  background: var(--landing-tint);
  color: var(--landing-ink);
}
.design-gradient:has(input:focus-visible) {
  outline: 3px solid var(--landing-accent);
  outline-offset: 2px;
}
.design-gradient input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.design-gradient-sample {
  height: 30px;
  border-radius: calc(var(--ui-radius) - 2px);
}
.design-typefaces {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.design-typeface .onb-choice-text small {
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}
.design-typeface .onb-choice-text strong {
  font-size: 16px;
  line-height: 1.3;
}
.design-typeface .onb-choice-text > span {
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.5;
}
@media (max-width: 640px) {
  .design-gradients,
  .design-typefaces {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .design-typefaces {
    grid-template-columns: 1fr;
  }
}
</style>
