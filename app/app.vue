<template>
  <NuxtLoadingIndicator class="z-[9999]" color="#4f46e5" />

  <StatusBar />

  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { cdnUrl } = useRuntimeConfig().public
const ogImageUrl = `${cdnUrl}/app-logo.png`

useSeoMeta({
  title: () => 'Topiqu',
  description: () => 'Moderní blogovací platforma',
  keywords: () => 'blog, ai, platforma',
  author: () => 'Topiqu',
  ogTitle: () => 'Topiqu',
  ogDescription: () => 'Moderní blogovací platforma',
  ogLocale: () => 'cs',
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
