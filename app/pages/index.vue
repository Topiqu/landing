<template>
  <div
    class="custom-ui min-h-screen overflow-x-hidden bg-brand-page text-brand-ink selection:bg-brand-accent selection:text-white dark:bg-[#080a0d] dark:text-slate-50"
  >
    <Hero @scroll="scrollToSection" />
    <LazyFeatures />

    <section id="about" class="border-b border-brand-line px-6 py-24 dark:border-white/10" aria-labelledby="about-topiqu">
      <div class="mx-auto grid max-w-6xl gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-20">
        <div>
          <p class="eyebrow">Topiqu</p>
          <h2 id="about-topiqu" class="section-title max-w-md">{{ $t('landing.purpose.title') }}</h2>
        </div>
        <div>
          <p class="mb-8 text-xl leading-9 text-[#36352f] dark:text-slate-200">
            {{ $t('landing.purpose.description') }}
          </p>
          <div class="border-l-2 border-brand-accent pl-5">
            <h3 class="mb-2 text-base font-semibold text-brand-ink dark:text-white">
              {{ $t('landing.purpose.gscTitle') }}
            </h3>
            <p class="text-sm leading-6 text-brand-muted dark:text-slate-400">
              {{ $t('landing.purpose.gscDescription') }}
            </p>
            <NuxtLinkLocale
              to="privacy"
              class="mt-3 inline-flex text-sm font-semibold text-brand-accent underline underline-offset-4 dark:text-indigo-300"
              >{{ $t('landing.purpose.privacyLink') }}</NuxtLinkLocale
            >
          </div>
        </div>
      </div>
    </section>

    <LazyWorkflow />
    <LazyComparison />
    <LazyPricing />
    <LazyFaq />
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const isCs = computed(() => locale.value === 'cs')
const pageTitle = computed(() =>
  isCs.value
    ? 'AI redakční systém pro tvorbu a publikaci obsahu'
    : 'AI content platform for research, review, and publishing',
)
const pageUrl = computed(() => `https://topiqu.com/${locale.value}`)

useSeoMeta({
  title: () => pageTitle.value,
  description: () => t('landing.hero.subtitle'),
  ogTitle: () => `${pageTitle.value} | Topiqu`,
  ogDescription: () => t('landing.hero.subtitle'),
  ogType: 'website',
  twitterTitle: () => `${pageTitle.value} | Topiqu`,
  twitterDescription: () => t('landing.hero.subtitle'),
})

useSchemaOrg([
  defineWebSite({
    '@id': () => `${pageUrl.value}#website`,
    name: 'Topiqu',
    url: () => pageUrl.value,
    description: () => t('landing.hero.subtitle'),
    inLanguage: ['cs-CZ', 'en-US'],
  }),
  defineWebPage({ name: () => pageTitle.value, url: () => pageUrl.value, description: () => t('landing.hero.subtitle') }),
  defineSoftwareApp({
    '@type': 'WebApplication',
    name: 'Topiqu',
    url: () => pageUrl.value,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    description: () => t('landing.hero.subtitle'),
    featureList: () =>
      isCs.value
        ? ['Rešerše se zdroji', 'AI návrhy článků', 'Redakční schvalování', 'Překlady', 'Publikace na vlastní web']
        : ['Source-backed research', 'AI article drafts', 'Editorial approvals', 'Translations', 'Publishing to your own website'],
    offers: [
      defineOffer({ name: 'Free', price: 0, priceCurrency: 'USD', availability: 'OnlineOnly', url: () => `${pageUrl.value}#pricing` }),
      defineOffer({ name: 'Pro', price: 39, priceCurrency: 'USD', availability: 'OnlineOnly', url: () => `${pageUrl.value}#pricing` }),
      defineOffer({ name: 'Premium', price: 79, priceCurrency: 'USD', availability: 'OnlineOnly', url: () => `${pageUrl.value}#pricing` }),
    ],
  }),
])

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>
