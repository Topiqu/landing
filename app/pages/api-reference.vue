<template>
  <main class="min-h-screen bg-white pt-20 dark:bg-[#080a0d]">
    <header class="mx-auto max-w-5xl px-6 py-12">
      <p class="mb-3 text-sm font-semibold text-indigo-600 dark:text-indigo-300">Topiqu Developers</p>
      <h1 class="text-4xl font-bold tracking-tight text-slate-950 dark:text-white">External API Reference</h1>
      <p class="mt-4 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
        {{ locale === 'cs' ? 'Interaktivní dokumentace veřejného Topiqu API v1.' : 'Interactive documentation for the public Topiqu API v1.' }}
      </p>
      <a href="/openapi/v1.json" class="mt-5 inline-flex font-semibold text-indigo-600 underline underline-offset-4 dark:text-indigo-300">
        {{ locale === 'cs' ? 'Stáhnout OpenAPI 3.1 specifikaci' : 'Download the OpenAPI 3.1 specification' }}
      </a>
    </header>
    <ClientOnly>
      <ScalarApiReference :configuration="configuration" />
      <template #fallback>
        <p class="mx-auto max-w-5xl px-6 pb-20 text-slate-500">Loading API reference…</p>
      </template>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const configuration = {
  url: '/openapi/v1.json',
  darkMode: true,
  showSidebar: true,
  hideClientButton: true,
  metaData: {
    title: 'Topiqu External API Reference',
    description: 'Interactive reference for the Topiqu External API v1.',
  },
}

useSeoMeta({
  title: 'External API Reference',
  description: 'Interactive reference for the Topiqu External API v1.',
  ogTitle: 'Topiqu External API Reference',
  ogDescription: 'Interactive reference for the Topiqu External API v1.',
})
useSchemaOrg([
  defineWebPage({
    name: 'Topiqu External API Reference',
    description: 'Interactive reference for the Topiqu External API v1.',
    url: () => `https://topiqu.com/${locale.value}/api-reference`,
  }),
  defineBreadcrumb({
    itemListElement: () => [
      { name: 'Topiqu', item: `https://topiqu.com/${locale.value}` },
      { name: 'Developers', item: `https://topiqu.com/${locale.value}/docs` },
      { name: 'API Reference' },
    ],
  }),
])
</script>
