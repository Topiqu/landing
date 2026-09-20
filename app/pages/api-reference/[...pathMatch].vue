<script setup lang="ts">
import type { ApiReferenceConfigurationWithSource } from '@scalar/types/api-reference'

import { scalarCzechTranslations } from '~/utils/scalar-localization'

definePageMeta({ layout: 'docs' })

const { locale } = useI18n()
const theme = useThemeStore()
const isCzech = computed(() => locale.value === 'cs')

const configuration = computed<Partial<ApiReferenceConfigurationWithSource>>(() => ({
  url: '/openapi/v1.json',
  pathRouting: { basePath: `/${locale.value}/api-reference` },
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
</script>

<template>
  <ScalarApiReference :key="locale" :configuration="configuration" />
</template>
