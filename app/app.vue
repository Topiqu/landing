<template>
  <UApp :locale="locale === 'cs' ? cs : en">
    <NuxtLoadingIndicator class="z-[9999]" color="#4f46e5" />

    <StatusBar />

    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>

    <CookieBanner />
  </UApp>
</template>

<script setup lang="ts">
import { cs, en } from '@nuxt/ui/locale'
const { locale } = useI18n()
const ogImageUrl = 'https://topiqu.com/brand/topiqu-mark.png?v=20260910'

useSeoMeta({
  title: () => 'Topiqu',
  description: () =>
    'Topiqu is an AI content operations platform for researching, creating, reviewing, translating, publishing, and improving business content.',
  keywords: () => 'Topiqu, AI content operations, content platform, SEO, AEO, GEO',
  author: () => 'Topiqu',
  ogTitle: () => 'Topiqu',
  ogDescription: () =>
    'Topiqu is an AI content operations platform for researching, creating, reviewing, translating, publishing, and improving business content.',
  ogLocale: () => (locale.value === 'cs' ? 'cs_CZ' : 'en_US'),
  ogImage: ogImageUrl,
  ogImageWidth: 271,
  ogImageHeight: 270,
  twitterImage: ogImageUrl,
  twitterImageWidth: 271,
  twitterImageHeight: 270,
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico?v=20260909',
    },
  ],
})
</script>
