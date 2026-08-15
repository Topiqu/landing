<template>
  <section id="comparison" class="scroll-mt-20 border-b border-brand-line px-6 py-24 dark:border-white/10 md:py-32">
    <div class="mx-auto max-w-7xl">
      <div class="mb-14 max-w-3xl">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 class="section-title">{{ copy.title }}</h2>
        <p class="section-lede mt-5">{{ copy.subtitle }}</p>
      </div>

      <div
        class="hidden overflow-hidden rounded-xl border border-brand-line bg-brand-surface dark:border-slate-700 dark:bg-[#111418] md:block"
      >
        <div class="overflow-x-auto">
          <table class="w-full min-w-[980px] border-collapse text-sm">
            <thead>
              <tr class="border-b border-brand-line dark:border-slate-700">
                <th class="min-w-60 px-5 py-5 text-left font-semibold text-brand-muted">{{ copy.capability }}</th>
                <th
                  v-for="product in products"
                  :key="product.name"
                  class="min-w-28 px-4 py-5 text-center font-semibold"
                  :class="
                    product.topiqu
                      ? 'bg-[#ebe8df] text-brand-ink dark:bg-indigo-500/10 dark:text-white'
                      : 'text-[#4f4e48] dark:text-slate-300'
                  "
                >
                  <span class="flex flex-col items-center gap-2">
                    <ProductLogo :name="product.name" :src="product.logo" :mark="product.mark" />
                    <span>{{ product.name }}</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in rows"
                :key="row.label"
                class="border-b border-brand-line last:border-0 dark:border-slate-700"
              >
                <th class="px-5 py-4 text-left font-medium text-brand-ink dark:text-slate-200">{{ row.label }}</th>
                <td
                  v-for="(value, index) in row.values"
                  :key="index"
                  class="px-4 py-4 text-center"
                  :class="products[index]?.topiqu ? 'bg-[#ebe8df] dark:bg-indigo-500/10' : ''"
                >
                  <span class="font-mono text-sm" :class="ratingClass(value)">{{ value }}/5</span>
                </td>
              </tr>
              <tr>
                <th class="px-5 py-5 text-left font-semibold">{{ copy.bestFor }}</th>
                <td
                  v-for="product in products"
                  :key="product.name"
                  class="px-4 py-5 text-center text-xs leading-5 text-brand-muted"
                  :class="product.topiqu ? 'bg-[#ebe8df] dark:bg-indigo-500/10' : ''"
                >
                  {{ product.fit }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="md:hidden">
        <label for="competitor" class="mb-2 block text-sm font-semibold">{{ copy.compareWith }}</label>
        <select
          id="competitor"
          v-model="selected"
          class="mb-5 w-full !rounded-lg !bg-brand-surface px-3 py-3 dark:!bg-[#111418]"
        >
          <option v-for="product in products.slice(1)" :key="product.name" :value="product.name">
            {{ product.name }}
          </option>
        </select>
        <div
          class="overflow-hidden rounded-xl border border-brand-line bg-brand-surface dark:border-slate-700 dark:bg-[#111418]"
        >
          <div
            class="grid grid-cols-[minmax(0,1fr)_82px_82px] border-b border-brand-line px-3 py-3 text-xs font-semibold dark:border-slate-700"
          >
            <span>{{ copy.capability }}</span>
            <span class="flex flex-col items-center gap-1 text-center text-brand-accent">
              <ProductLogo :name="products[0]!.name" :src="products[0]!.logo" :mark="products[0]!.mark" />
              Topiqu
            </span>
            <span class="flex flex-col items-center gap-1 text-center">
              <ProductLogo :name="selectedProduct.name" :src="selectedProduct.logo" :mark="selectedProduct.mark" />
              {{ selected }}
            </span>
          </div>
          <div
            v-for="row in mobileRows"
            :key="row.label"
            class="grid grid-cols-[minmax(0,1fr)_82px_82px] items-center border-b border-brand-line px-3 py-4 text-sm last:border-0 dark:border-slate-700"
          >
            <span>{{ row.label }}</span
            ><strong class="text-center text-brand-accent">{{ row.topiqu }}/5</strong
            ><span class="text-center text-brand-muted">{{ row.competitor }}/5</span>
          </div>
        </div>
      </div>

      <div class="mt-5 flex flex-col gap-2 text-xs leading-5 text-brand-muted md:flex-row md:justify-between">
        <p>{{ copy.scale }}</p>
        <p>{{ copy.methodology }}</p>
      </div>
      <NuxtLinkLocale
        to="/comparison"
        class="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-accent underline decoration-1 underline-offset-4 dark:text-indigo-300"
      >
        {{ copy.fullComparison }}
        <Icon name="mdi:arrow-right" size="18" />
      </NuxtLinkLocale>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Product {
  name: string
  logo?: string
  mark?: string
  topiqu?: boolean
  fit: string
}

const { locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')
const selected = ref('Contentbase')
const copy = computed(() =>
  isCs.value
    ? {
        eyebrow: 'Srovnání bez marketingové mlhy',
        title: 'Kde Topiqu dává smysl a kde ne',
        subtitle:
          'Specializované nástroje mohou být silnější v jedné disciplíně. Topiqu je pro týmy, které chtějí propojit celý proces od zdrojů po vlastní web.',
        capability: 'Schopnost',
        bestFor: 'Nejlepší volba pro',
        compareWith: 'Porovnat s',
        scale: '1 = minimální · 3 = dobré · 5 = špičkové',
        methodology:
          'Orientační srovnání podle veřejně dostupných funkcí v srpnu 2026. Dostupnost se může lišit podle tarifu.',
        fullComparison: 'Zobrazit celé srovnání a metodiku',
      }
    : {
        eyebrow: 'A comparison without the marketing fog',
        title: 'Where Topiqu fits — and where it does not',
        subtitle:
          'Specialized tools may be stronger in one discipline. Topiqu is for teams that want the whole process connected, from sources to their own website.',
        capability: 'Capability',
        bestFor: 'Best choice for',
        compareWith: 'Compare with',
        scale: '1 = minimal · 3 = good · 5 = leading',
        methodology:
          'Indicative comparison based on publicly available features in August 2026. Availability may vary by plan.',
        fullComparison: 'See the full comparison and methodology',
      },
)

const products = computed<Product[]>(() => [
  {
    name: 'Topiqu',
    logo: '/logo.png',
    topiqu: true,
    fit: isCs.value ? 'Celý obsahový proces v jednom systému' : 'The complete content process in one system',
  },
  { name: 'Contentbase', logo: '/brands/contentbase.svg', fit: isCs.value ? 'Autonomní SEO obsah ve velkém' : 'Autonomous SEO content at scale' },
  { name: 'NextBlog', logo: '/brands/nextblog.ico', fit: isCs.value ? 'Jednoduchý blog na autopilota' : 'A simple blog on autopilot' },
  {
    name: 'BlendScribe',
    mark: 'B',
    fit: isCs.value ? 'AI-readable blog na vlastní doméně' : 'An AI-readable blog on your domain',
  },
  { name: 'Jasper', logo: '/brands/jasper.png', fit: isCs.value ? 'Firemní procesy a práce se značkou' : 'Enterprise brand workflows' },
  { name: 'HubSpot', logo: '/brands/hubspot.png', fit: isCs.value ? 'CRM, kampaně a obsah' : 'CRM, campaigns, and content' },
])
const labels = computed(() =>
  isCs.value
    ? [
        'Rešerše a dlouhé články',
        'Zdroje a citace',
        'SEO optimalizace',
        'Znalost značky',
        'Vlastní CMS, web a doména',
        'Překlady a schvalování',
      ]
    : [
        'Research and long-form articles',
        'Sources and citations',
        'SEO optimization',
        'Brand knowledge',
        'Native CMS, website, and domain',
        'Translations and approvals',
      ],
)
const matrix = [
  [5, 5, 4, 4, 4, 4],
  [5, 5, 3, 4, 4, 3],
  [4, 5, 5, 4, 3, 4],
  [5, 5, 3, 5, 5, 5],
  [5, 5, 4, 5, 1, 5],
  [5, 5, 3, 3, 5, 5],
]
const rows = computed(() => labels.value.map((label, index) => ({ label, values: matrix[index]! })))
const selectedIndex = computed(() => products.value.findIndex((product) => product.name === selected.value))
const selectedProduct = computed(() => products.value[selectedIndex.value]!)
const mobileRows = computed(() =>
  rows.value.map((row) => ({ label: row.label, topiqu: row.values[0], competitor: row.values[selectedIndex.value] })),
)
const ratingClass = (rating: number) =>
  rating >= 5
    ? 'text-emerald-700 dark:text-emerald-400'
    : rating >= 4
      ? 'text-brand-accent dark:text-indigo-300'
      : rating >= 3
        ? 'text-amber-700 dark:text-amber-400'
        : 'text-brand-muted'
</script>
