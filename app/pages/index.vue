<script setup lang="ts">
const { t } = useI18n()
const pageTitle = () => `${t('landing.design.hero.title')} ${t('landing.design.hero.accent')} | Topiqu`
useSeoMeta({
  title: pageTitle,
  description: () => t('landing.design.hero.description'),
  ogTitle: pageTitle,
  ogDescription: () => t('landing.design.hero.description'),
  ogType: 'website',
})
useSchemaOrg([
  defineOrganization({ name: 'Topiqu', url: 'https://topiqu.com' }),
  defineWebSite({ name: 'Topiqu' }),
  defineWebPage({ name: 'Topiqu — AI Content Operations' }),
])
</script>
<template>
  <div class="landing-page">
    <Hero />
    <Showcase />
    <Connector />
    <AfterPublishing />
    <Features />
    <Pricing />
    <Comparison />
    <Faq />
    <Closing />
  </div>
</template>
