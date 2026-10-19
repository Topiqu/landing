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
    <DeveloperBreadcrumb :label="cs ? 'Dokumentace' : 'Documentation'" class="docs-breadcrumb" />
    <div class="docs-overview">
      <div>
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
      </div>
      <div class="docs-example">
        <div class="docs-example-head">
          <span><Icon name="i-lucide-terminal" />{{ cs ? 'Váš první požadavek' : 'Your first request' }}</span
          ><UBadge color="neutral" variant="soft">API v1</UBadge>
        </div>
        <pre
          tabindex="0"
          :aria-label="cs ? 'Ukázka API požadavku' : 'API request example'"
        ><code>curl 'https://app.topiqu.com/api/v1/articles?limit=10' \
  -H 'x-api-key: YOUR_API_KEY'</code></pre>
        <p>
          {{
            cs
              ? 'Načtěte publikované články a zobrazte je ve svém webu nebo aplikaci.'
              : 'Fetch your published articles and display them on your website or in your app.'
          }}
        </p>
        <NuxtLink :to="localePath('/docs/authentication')"
          >{{ cs ? 'Jak získat API klíč' : 'How to get your API key' }} →</NuxtLink
        >
      </div>
    </div>
    <h2 class="docs-guides-title">{{ cs ? 'Průvodci pro vaši integraci' : 'Build your integration' }}</h2>
    <nav class="docs-topics" :aria-label="cs ? 'Průvodci API' : 'API guides'">
      <NuxtLink :to="localePath('/docs/pagination')"
        ><Icon name="i-lucide-list-filter" /><strong>{{
          cs ? 'Stránkování a filtrování' : 'Pagination and filtering'
        }}</strong>
        <p>
          {{
            cs
              ? 'Vyberte články pomocí tagů a procházejte výsledky.'
              : 'Filter articles by tags and navigate the results.'
          }}
        </p>
        <span>→</span></NuxtLink
      >
      <NuxtLink :to="localePath('/docs/errors')"
        ><Icon name="i-lucide-shield-check" /><strong>{{
          cs ? 'Chyby a kompatibilita' : 'Errors and compatibility'
        }}</strong>
        <p>{{ cs ? 'Zpracujte chybové odpovědi a změny API.' : 'Handle error responses and evolving API fields.' }}</p>
        <span>→</span></NuxtLink
      >
      <NuxtLink :to="localePath('/changelog')"
        ><Icon name="i-lucide-history" /><strong>{{ cs ? 'Co je nového' : 'What’s new' }}</strong>
        <p>{{ cs ? 'Sledujte vydání a změny veřejného API.' : 'Follow releases and public API changes.' }}</p>
        <span>→</span></NuxtLink
      >
    </nav>
  </main>
</template>
<style scoped>
.docs-home {
  max-width: 1248px;
  margin: auto;
  padding: 32px 24px 64px;
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
.docs-breadcrumb {
  margin-bottom: 40px;
}
.docs-overview {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: 48px;
  align-items: center;
}
.docs-example {
  min-width: 0;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-bg);
  overflow: hidden;
}
.docs-example-head,
.docs-example-head > span {
  display: flex;
  align-items: center;
  gap: 10px;
}
.docs-example-head {
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--landing-line);
  font-size: 13px;
  font-weight: 700;
}
.docs-example pre {
  padding: 24px 20px;
  overflow-x: auto;
  font-size: 12px;
  line-height: 1.8;
  color: var(--landing-accent);
}
.docs-example > p {
  margin: 0;
  padding: 0 20px;
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
.docs-example > a {
  display: inline-flex;
  padding: 16px 20px 20px;
  color: var(--landing-accent);
  font-size: 13px;
  font-weight: 650;
}
.docs-guides-title {
  margin: 48px 0 20px;
  font-size: 20px;
  font-weight: 700;
}
.docs-topics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.docs-topics a {
  position: relative;
  padding: 24px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s;
}
.docs-topics a:hover {
  border-color: var(--landing-accent);
  background: var(--landing-tint);
}
.docs-topics .iconify {
  display: block;
  color: var(--landing-accent);
  font-size: 22px;
  margin-bottom: 20px;
}
.docs-topics strong {
  font-size: 15px;
}
.docs-topics p {
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.7;
  margin-top: 8px;
  padding-right: 16px;
}
.docs-topics a > span:last-child {
  position: absolute;
  right: 20px;
  top: 24px;
  color: var(--landing-accent);
}
@media (max-width: 900px) {
  .docs-overview {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}
@media (max-width: 640px) {
  .docs-topics {
    grid-template-columns: 1fr;
  }
  .docs-breadcrumb {
    margin-bottom: 28px;
  }
}
</style>
