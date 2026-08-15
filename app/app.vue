<template>
  <NuxtLoadingIndicator class="z-[9999]" color="#4f46e5" />

  <StatusBar />

  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>

  <CookieBanner />
</template>

<script setup lang="ts">
const { cdnUrl } = useRuntimeConfig().public
const { locale } = useI18n()
const ogImageUrl = `${cdnUrl}/app-logo.png`
const localeHead = useLocaleHead()

useHead(() => ({
  htmlAttrs: localeHead.value.htmlAttrs,
  link: [...(localeHead.value.link || [])],
  meta: [...(localeHead.value.meta || [])],
}))

useSeoMeta({
  description: () =>
    locale.value === 'cs'
      ? 'Topiqu propojuje rešerši, psaní, redakční kontrolu, překlady a publikaci obsahu.'
      : 'Topiqu connects research, writing, editorial review, translations, and content publishing.',
  author: () => 'Topiqu',
  ogTitle: () => 'Topiqu',
  ogDescription: () =>
    locale.value === 'cs'
      ? 'Od podkladů k publikovanému článku na vlastním webu.'
      : 'From research to a published article on your own website.',
  ogImage: ogImageUrl,
  ogImageWidth: 1024,
  ogImageHeight: 1024,
  twitterImage: ogImageUrl,
  twitterImageWidth: 1024,
  twitterImageHeight: 1024,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>
