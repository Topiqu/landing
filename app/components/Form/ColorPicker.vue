<template>
  <div class="color-picker">
    <div class="color-grid" role="radiogroup" :aria-label="label">
      <label
        v-for="[name, hex] in colors"
        :key="name"
        class="color-swatch"
        :title="$t('landing.onboarding.colors.' + name)"
        :style="{ '--swatch': hex }"
      >
        <input
          type="radio"
          name="brand-color"
          :value="name"
          :checked="!custom && theme === name"
          :aria-label="$t('landing.onboarding.colors.' + name)"
          @change="pickPreset(name)"
        />
        <Icon name="mdi:check-bold" aria-hidden="true" />
      </label>
      <label
        class="color-swatch color-swatch-custom"
        :data-active="custom || undefined"
        :title="$t('landing.onboarding.design.customColor')"
        :style="custom ? { '--swatch': custom } : undefined"
      >
        <input
          type="color"
          :value="custom ?? themeColors[theme]"
          :aria-label="$t('landing.onboarding.design.customColor')"
          @input="accent = ($event.target as HTMLInputElement).value.toUpperCase()"
        />
        <Icon :name="custom ? 'mdi:check-bold' : 'mdi:eyedropper-variant'" aria-hidden="true" />
      </label>
    </div>
    <div class="color-hex">
      <span class="color-hex-dot" :style="{ background: custom ?? themeColors[theme] }" aria-hidden="true" />
      <span class="color-hex-name">{{
        custom ? $t('landing.onboarding.design.customColor') : $t('landing.onboarding.colors.' + theme)
      }}</span>
      <UInput
        :modelValue="hexDraft"
        size="sm"
        class="color-hex-input"
        maxlength="7"
        spellcheck="false"
        autocapitalize="off"
        :aria-label="$t('landing.onboarding.design.hex')"
        @update:modelValue="onHex(String($event))"
        @blur="hexDraft = custom ?? themeColors[theme].toUpperCase()"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { label } = defineProps<{ label: string }>()
const theme = defineModel<ThemeKey>('theme', { required: true })
// A hand-picked #RRGGBB overrides the preset, as `accentColor` does in the platform.
const accent = defineModel<string>('accent', { required: true })
const themeColors = THEME_COLORS
const colors = Object.entries(THEME_COLORS) as [ThemeKey, string][]

const custom = computed(() => normalizeAccentColor(accent.value))
const hexDraft = shallowRef(custom.value ?? THEME_COLORS[theme.value].toUpperCase())
watch([custom, theme], () => {
  hexDraft.value = custom.value ?? THEME_COLORS[theme.value].toUpperCase()
})

const pickPreset = (name: ThemeKey) => {
  theme.value = name
  accent.value = ''
}
const onHex = (value: string) => {
  const draft = value.startsWith('#') ? value : `#${value}`
  hexDraft.value = draft.toUpperCase()
  const color = normalizeAccentColor(draft)
  if (!color) return
  const preset = colors.find(([, hex]) => hex.toUpperCase() === color)
  if (preset) pickPreset(preset[0])
  else accent.value = color
}
</script>

<style scoped>
.color-picker {
  display: grid;
  gap: 12px;
}
.color-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.color-swatch {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: var(--swatch);
  color: #fff;
  cursor: pointer;
  box-shadow: inset 0 0 0 1px rgb(15 23 42 / 12%);
  transition: transform 0.15s;
}
.color-swatch:hover {
  transform: scale(1.08);
}
.color-swatch input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}
.color-swatch .iconify {
  font-size: 17px;
  visibility: hidden;
  filter: drop-shadow(0 1px 1px rgb(0 0 0 / 35%));
  pointer-events: none;
}
.color-swatch:has(input:checked),
.color-swatch-custom[data-active] {
  outline: 2px solid var(--landing-ink);
  outline-offset: 2px;
}
.color-swatch:has(input:checked) .iconify,
.color-swatch-custom .iconify {
  visibility: visible;
}
.color-swatch:has(input:focus-visible) {
  outline: 3px solid var(--landing-accent);
  outline-offset: 2px;
}
.color-swatch-custom:not([data-active]) {
  background: conic-gradient(from 90deg, #ef4444, #f59e0b, #84cc16, #06b6d4, #6366f1, #d946ef, #ef4444);
}
.color-hex {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--landing-muted);
  font-size: 13px;
}
.color-hex-dot {
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  box-shadow: inset 0 0 0 1px rgb(15 23 42 / 15%);
}
.color-hex-name {
  font-weight: 600;
}
.color-hex-input {
  width: 104px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
</style>
