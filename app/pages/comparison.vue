<template>
  <main class="custom-ui min-h-screen bg-brand-page px-6 pb-24 pt-32 text-brand-ink dark:bg-[#080a0d] dark:text-slate-50">
    <div class="mx-auto max-w-7xl">
      <NuxtLinkLocale
        to="/#comparison"
        class="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-brand-muted no-underline hover:text-brand-ink dark:hover:text-white"
      >
        <Icon name="mdi:arrow-left" size="18" />{{ copy.back }}
      </NuxtLinkLocale>

      <div class="grid gap-10 border-b border-brand-line pb-14 dark:border-white/10 lg:grid-cols-[1fr_360px] lg:items-end">
        <div class="max-w-3xl">
          <p class="eyebrow">{{ copy.eyebrow }}</p>
          <h1 class="text-5xl font-semibold leading-[1.02] tracking-[-0.045em] md:text-7xl">{{ copy.title }}</h1>
          <p class="section-lede mt-6 max-w-2xl">{{ copy.subtitle }}</p>
        </div>
        <aside class="rounded-xl border border-brand-line bg-[#ebe8df] p-6 dark:border-slate-700 dark:bg-[#111418]">
          <p class="mb-2 text-sm font-semibold">{{ copy.methodTitle }}</p>
          <p class="text-sm leading-6 text-brand-muted dark:text-slate-400">{{ copy.method }}</p>
          <p class="mt-4 font-mono text-xs text-brand-accent dark:text-indigo-300">{{ copy.scale }}</p>
        </aside>
      </div>

      <section class="py-14" aria-labelledby="comparison-table-title">
        <div class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="eyebrow">{{ copy.allCriteria }}</p>
            <h2 id="comparison-table-title" class="text-3xl font-semibold tracking-tight md:text-4xl">
              {{ copy.tableTitle }}
            </h2>
          </div>
          <p class="max-w-lg text-sm leading-6 text-brand-muted">{{ copy.tableNote }}</p>
        </div>

        <div class="overflow-hidden rounded-xl border border-brand-line bg-brand-surface dark:border-slate-700 dark:bg-[#111418]">
          <div
            class="comparison-scroll overflow-x-auto"
            role="region"
            :aria-label="copy.tableTitle"
            tabindex="0"
          >
            <table class="w-full min-w-[960px] border-collapse text-sm md:min-w-[1060px]">
              <thead>
                <tr class="border-b border-brand-line dark:border-slate-700">
                  <th class="sticky-capability sticky left-0 z-10 w-40 min-w-40 max-w-40 bg-brand-surface px-3 py-5 text-left font-semibold text-brand-muted dark:bg-[#111418] md:w-64 md:min-w-64 md:max-w-64 md:px-5">
                    {{ copy.capability }}
                  </th>
                  <th
                    v-for="product in products"
                    :key="product.name"
                    class="min-w-28 px-4 py-5 text-center font-semibold"
                    :class="product.topiqu ? 'bg-[#e0dcff] text-brand-accent dark:bg-indigo-500/15 dark:text-indigo-200' : 'text-[#4f4e48] dark:text-slate-300'"
                  >
                    <span class="flex flex-col items-center gap-2">
                      <ProductLogo :name="product.name" :src="product.logo" :mark="product.mark" />
                      <span>{{ product.name }}</span>
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in rows" :key="row.label" class="border-b border-brand-line last:border-0 dark:border-slate-700">
                  <th class="sticky-capability sticky left-0 z-10 w-40 min-w-40 max-w-40 bg-brand-surface px-3 py-4 text-left font-medium dark:bg-[#111418] md:w-64 md:min-w-64 md:max-w-64 md:px-5">
                    {{ row.label }}
                  </th>
                  <td
                    v-for="(value, index) in row.values"
                    :key="index"
                    class="px-4 py-4 text-center"
                    :class="products[index]?.topiqu ? 'bg-[#e0dcff] dark:bg-indigo-500/15' : ''"
                  >
                    <span class="font-mono text-sm font-semibold" :class="ratingClass(value)">{{ value }}/5</span>
                  </td>
                </tr>
                <tr>
                  <th class="sticky-capability sticky left-0 z-10 w-40 min-w-40 max-w-40 bg-brand-surface px-3 py-5 text-left font-semibold dark:bg-[#111418] md:w-64 md:min-w-64 md:max-w-64 md:px-5">{{ copy.bestFor }}</th>
                  <td
                    v-for="product in products"
                    :key="product.name"
                    class="px-4 py-5 text-center text-xs leading-5 text-brand-muted"
                    :class="product.topiqu ? 'bg-[#e0dcff] dark:bg-indigo-500/15' : ''"
                  >
                    {{ product.fit }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="grid gap-6 border-t border-brand-line pt-14 dark:border-white/10 md:grid-cols-3">
        <article v-for="item in copy.notes" :key="item.title" class="border-l-2 border-brand-accent pl-5">
          <h3 class="mb-2 font-semibold">{{ item.title }}</h3>
          <p class="text-sm leading-6 text-brand-muted dark:text-slate-400">{{ item.text }}</p>
        </article>
      </section>

      <p class="mt-12 text-sm leading-7 text-brand-muted dark:text-slate-400">
        {{ copy.sourcesLabel }}
        <template v-for="(product, index) in products" :key="product.name">
          <span v-if="index">, </span>
          <a :href="product.url" target="_blank" rel="noopener noreferrer" class="font-semibold underline underline-offset-4">
            {{ product.name }}
          </a>
        </template>
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
interface Product {
  name: string
  logo?: string
  mark?: string
  url: string
  topiqu?: boolean
  fit: string
}

const { locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')

const copy = computed(() =>
  isCs.value
    ? {
        back: 'Zpět na hlavní stránku',
        eyebrow: 'Podrobné srovnání',
        title: 'Šest nástrojů, deset důležitých kritérií',
        subtitle: 'Žádný nástroj není nejlepší pro každého. Tohle srovnání ukazuje, v čem se jednotlivé platformy liší a pro jaký způsob práce se hodí.',
        methodTitle: 'Jak jsme hodnotili',
        method: 'Skóre vychází z veřejně popsaných funkcí a dokumentace dostupné v srpnu 2026. Nehodnotí kvalitu podpory, cenu ani funkce dostupné pouze individuálně.',
        scale: '1 minimální · 3 dobré · 5 špičkové',
        allCriteria: 'Celá tabulka',
        tableTitle: 'Srovnání funkcí',
        tableNote: 'Na telefonu můžete tabulku posunout do strany. První sloupec zůstává na místě, abyste neztratili kontext.',
        capability: 'Schopnost',
        bestFor: 'Nejlepší volba pro',
        sourcesLabel: 'Oficiální zdroje k ověření funkcí:',
        notes: [
          { title: 'Skóre není verdikt', text: 'Pět bodů neznamená, že je nástroj automaticky lepší. Záleží na tom, které funkce váš tým skutečně využije.' },
          { title: 'Tarify se liší', text: 'Některé funkce mohou být jen ve vyšším tarifu, v beta verzi nebo dostupné po domluvě s obchodním týmem.' },
          { title: 'Srovnání průběžně upravujeme', text: 'Produkty se rychle mění. Pokud v tabulce najdete nepřesnost, dejte nám vědět a zdroj ověříme.' },
        ],
      }
    : {
        back: 'Back to the homepage',
        eyebrow: 'Detailed comparison',
        title: 'Six tools, ten criteria that matter',
        subtitle: 'No tool is the best fit for everyone. This comparison shows how the platforms differ and which workflow each one suits.',
        methodTitle: 'How we scored',
        method: 'Scores are based on public feature pages and documentation available in August 2026. They do not rate support quality, price, or features available only by individual agreement.',
        scale: '1 minimal · 3 good · 5 leading',
        allCriteria: 'Full table',
        tableTitle: 'Feature comparison',
        tableNote: 'On a phone, scroll the table sideways. The first column stays in place so you can keep the context.',
        capability: 'Capability',
        bestFor: 'Best choice for',
        sourcesLabel: 'Official product sources used to verify features:',
        notes: [
          { title: 'A score is not a verdict', text: 'Five points do not automatically make a tool better. What matters is which capabilities your team will actually use.' },
          { title: 'Plans differ', text: 'Some capabilities may only be available on higher plans, in beta, or through an enterprise agreement.' },
          { title: 'We keep this updated', text: 'Products change quickly. If you spot an inaccuracy, let us know and we will verify the source.' },
        ],
      },
)

const products = computed<Product[]>(() => [
  { name: 'Topiqu', logo: '/logo.png', url: 'https://topiqu.com', topiqu: true, fit: isCs.value ? 'Celý obsahový proces v jednom systému' : 'The complete content process in one system' },
  { name: 'Contentbase', logo: '/brands/contentbase.svg', url: 'https://contentbase.ai', fit: isCs.value ? 'Autonomní SEO obsah ve velkém' : 'Autonomous SEO content at scale' },
  { name: 'NextBlog', logo: '/brands/nextblog.ico', url: 'https://nextblog.ai', fit: isCs.value ? 'Jednoduchý blog na autopilota' : 'A simple blog on autopilot' },
  { name: 'BlendScribe', mark: 'B', url: 'https://blendscribe.com', fit: isCs.value ? 'Blog na vlastní doméně čitelný pro AI' : 'An AI-readable blog on your domain' },
  { name: 'Jasper', logo: '/brands/jasper.png', url: 'https://www.jasper.ai', fit: isCs.value ? 'Firemní procesy a práce se značkou' : 'Enterprise brand workflows' },
  { name: 'HubSpot', logo: '/brands/hubspot.png', url: 'https://www.hubspot.com', fit: isCs.value ? 'CRM, kampaně a obsah' : 'CRM, campaigns, and content' },
])

const labels = computed(() =>
  isCs.value
    ? [
        'AI rešerše a dlouhé články',
        'Práce se zdroji a citacemi',
        'SEO optimalizace',
        'Publikace připravená pro AEO a GEO',
        'Styl a znalost značky',
        'Vlastní CMS, web a doména',
        'Plánování a automatická publikace',
        'Překlady a redakční schválení',
        'API a WordPress integrace',
        'Komentáře a zapojení čtenářů',
      ]
    : [
        'AI research and long-form articles',
        'Sources and citations',
        'SEO optimization',
        'AEO and GEO-ready publishing',
        'Brand voice and knowledge',
        'Native CMS, website, and domain',
        'Scheduling and automatic publishing',
        'Translations and editorial approval',
        'API and WordPress integration',
        'Reader engagement and community',
      ],
)

const matrix = [
  [5, 5, 4, 4, 4, 4],
  [5, 5, 3, 4, 4, 3],
  [4, 5, 5, 4, 3, 4],
  [4, 4, 5, 5, 3, 4],
  [5, 5, 3, 5, 5, 5],
  [5, 5, 4, 5, 1, 5],
  [5, 5, 5, 3, 4, 5],
  [5, 5, 3, 3, 5, 5],
  [5, 5, 4, 3, 5, 5],
  [5, 1, 1, 1, 1, 3],
]

const rows = computed(() => labels.value.map((label, index) => ({ label, values: matrix[index]! })))
const ratingClass = (rating: number) =>
  rating >= 5
    ? 'text-emerald-700 dark:text-emerald-400'
    : rating >= 4
      ? 'text-brand-accent dark:text-indigo-300'
      : rating >= 3
        ? 'text-amber-700 dark:text-amber-400'
        : 'text-brand-muted'

useSeoMeta({
  title: () => (isCs.value ? 'Srovnání AI platforem pro tvorbu obsahu' : 'AI content platform comparison'),
  description: () => copy.value.subtitle,
  ogTitle: () => (isCs.value ? 'Srovnání AI platforem pro tvorbu obsahu | Topiqu' : 'AI content platform comparison | Topiqu'),
  ogDescription: () => copy.value.subtitle,
  ogType: 'article',
  twitterTitle: () => (isCs.value ? 'Srovnání AI platforem pro tvorbu obsahu | Topiqu' : 'AI content platform comparison | Topiqu'),
  twitterDescription: () => copy.value.subtitle,
})

useSchemaOrg([
  defineWebPage({
    name: () => (isCs.value ? 'Srovnání AI platforem pro tvorbu obsahu' : 'AI content platform comparison'),
    description: () => copy.value.subtitle,
    url: () => `https://topiqu.com/${locale.value}/comparison`,
  }),
  defineBreadcrumb({
    itemListElement: () => [
      { name: 'Topiqu', item: `https://topiqu.com/${locale.value}` },
      { name: isCs.value ? 'Srovnání' : 'Comparison' },
    ],
  }),
])
</script>

<style scoped>
.comparison-scroll {
  -webkit-overflow-scrolling: touch;
  scrollbar-gutter: stable;
}

.sticky-capability {
  box-shadow: 1px 0 0 rgba(23, 23, 20, 0.12);
}
</style>
