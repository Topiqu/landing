<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { locale } = useI18n()
const localePath = useLocalePath()
const cs = computed(() => locale.value === 'cs')
const apiReferencePath = computed(() => `/${locale.value}/api-reference`)
useSeoMeta({
  title: () => (cs.value ? 'Dokumentace · Topiqu' : 'Documentation · Topiqu'),
  description: () =>
    cs.value
      ? 'Průvodci, API reference a changelog pro Topiqu External API.'
      : 'Guides, API reference, and changelog for the Topiqu External API.',
})
</script>
<template>
  <main class="docs-home">
    <p class="eyebrow">Topiqu Developers</p>
    <h1>{{ cs ? 'Propojte Topiqu se svými nástroji.' : 'Connect Topiqu to your tools.' }}</h1>
    <p class="docs-intro">
      {{
        cs
          ? 'Zvolte API dokumentaci. Projděte si dostupné endpointy nebo začněte průvodcem autentizací.'
          : 'Choose your API documentation. Explore the available endpoints or start with the authentication guide.'
      }}
    </p>
    <div class="docs-actions">
      <UButton :to="apiReferencePath" size="lg" trailingIcon="mdi:arrow-right">{{
        cs ? 'Otevřít API dokumentaci' : 'Open API reference'
      }}</UButton>
      <UButton :to="localePath('/docs/authentication')" color="neutral" variant="outline" size="lg">{{
        cs ? 'Začínáme s autentizací' : 'Authentication guide'
      }}</UButton>
    </div>
    <nav class="docs-topics" :aria-label="cs ? 'Průvodci API' : 'API guides'">
      <NuxtLink :to="localePath('/docs/pagination')"
        >{{ cs ? 'Stránkování a filtrování' : 'Pagination and filtering' }} <span>→</span></NuxtLink
      >
      <NuxtLink :to="localePath('/docs/errors')"
        >{{ cs ? 'Chyby a kompatibilita' : 'Errors and compatibility' }} <span>→</span></NuxtLink
      >
      <NuxtLink :to="localePath('/changelog')">{{ cs ? 'Co je nového' : 'What’s new' }} <span>→</span></NuxtLink>
    </nav>
  </main>
</template>
<style scoped>
.docs-home {
  max-width: 900px;
  margin: auto;
  padding: 80px 24px;
}
.eyebrow {
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}
h1 {
  font-weight: 750;
  font-size: clamp(32px, 5vw, 52px);
  line-height: 1.15;
  letter-spacing: -0.04em;
  max-width: 700px;
}
.docs-intro {
  color: var(--landing-muted);
  font-size: 18px;
  line-height: 1.8;
  max-width: 650px;
  margin-block: 24px;
}
.docs-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.docs-topics {
  margin-top: 64px;
}
.docs-topics a {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  border-top: 1px solid var(--landing-line);
  padding: 22px 0;
  text-decoration: none;
}
.docs-topics a:hover {
  color: var(--landing-accent);
}
</style>
