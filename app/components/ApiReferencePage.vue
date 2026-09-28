<script setup lang="ts">
import type { ApiReferenceConfigurationWithSource } from '@scalar/types/api-reference'

import { scalarCzechTranslations } from '~/utils/scalar-localization'

const { locale } = useI18n()
const theme = useThemeStore()
const isCzech = computed(() => locale.value === 'cs')

const configuration = computed<Partial<ApiReferenceConfigurationWithSource>>(() => ({
  url: '/openapi/v1.json',
  darkMode: theme.isDark,
  forceDarkModeState: theme.isDark ? 'dark' : 'light',
  hideDarkModeToggle: true,
  showSidebar: true,
  hideClientButton: true,
  showDeveloperTools: 'never',
  agent: { disabled: true },
  mcp: { disabled: true },
  telemetry: false,
  localization: {
    locale: locale.value,
    direction: 'ltr',
    translations: isCzech.value ? scalarCzechTranslations : undefined,
  },
  customCss: '.darklight-reference { display: none !important; }',
  metaData: {
    title: isCzech.value ? 'Topiqu External API – reference' : 'Topiqu External API Reference',
    description: isCzech.value
      ? 'Interaktivní reference Topiqu External API v1.'
      : 'Interactive reference for the Topiqu External API v1.',
  },
}))

const syncScalarColorMode = () => {
  if (!import.meta.client) return

  document.body.classList.toggle('dark-mode', theme.isDark)
  document.body.classList.toggle('light-mode', !theme.isDark)
  localStorage.setItem('colorMode', theme.isDark ? 'dark' : 'light')
}

watch(() => theme.isDark, syncScalarColorMode, { immediate: true })
onUnmounted(() => {
  document.body.classList.remove('dark-mode', 'light-mode')
})

const pageTitle = computed(() => (isCzech.value ? 'Topiqu External API – reference' : 'Topiqu External API Reference'))
const pageDescription = computed(() =>
  isCzech.value
    ? 'Interaktivní reference Topiqu External API v1 s kompletním OpenAPI schématem.'
    : 'Interactive reference for the Topiqu External API v1 with the complete OpenAPI schema.',
)

useSeoMeta({
  title: () => pageTitle.value,
  description: () => pageDescription.value,
})
useSchemaOrg([
  defineWebPage({
    name: pageTitle.value,
    description: pageDescription.value,
  }),
])
</script>

<template>
  <ClientOnly>
    <ScalarApiReference :key="locale" :configuration="configuration" />
    <template #fallback>
      <main class="api-reference-fallback">
        <p>Topiqu Developers / API v1</p>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDescription }}</p>
        <a href="/openapi/v1.json">{{ isCzech ? 'Stáhnout OpenAPI 3.1 schéma' : 'Download the OpenAPI 3.1 schema' }}</a>
      </main>
    </template>
  </ClientOnly>
</template>

<style scoped>
.api-reference-fallback {
  max-width: 48rem;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}
.api-reference-fallback > p:first-child {
  color: var(--landing-accent);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.api-reference-fallback h1 {
  margin-top: 1rem;
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.1;
}
.api-reference-fallback h1 + p {
  margin: 1.5rem 0;
  color: var(--landing-muted);
  font-size: 1.125rem;
  line-height: 1.7;
}
</style>
