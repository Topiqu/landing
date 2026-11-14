<script setup lang="ts">
const { t } = useI18n()
const pageTitle = () => t('landing.design.meta.title')
const pageDescription = () => t('landing.design.meta.description')
useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'website',
})
useSchemaOrg([
  defineOrganization({ name: 'Topiqu', url: 'https://topiqu.com' }),
  defineWebSite({ name: 'Topiqu' }),
  defineWebPage({ name: pageTitle }),
])
</script>
<template>
  <div class="landing-page">
    <Hero />
    <LazyShowcase hydrateOnVisible />
    <Connector />
    <LazyExamples hydrateOnVisible />
    <LazyAfterPublishing hydrateOnVisible />
    <LazyFeatures hydrateOnVisible />
    <LazyPricing hydrateOnVisible />
    <LazyComparison hydrateOnVisible />
    <LazyFaq hydrateOnVisible />
    <LazyClosing hydrateOnVisible />
  </div>
</template>
