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
useSeoMeta({
  title: () => 'Topiqu',
  description: () => 'Moderní blogovací platforma',
  keywords: () => 'blog, ai, platforma',
  author: () => 'Topiqu',
  ogTitle: () => 'Topiqu',
  ogDescription: () => 'Moderní blogovací platforma',
  ogLocale: () => 'cs',
  ogImageWidth: 1200,
  ogImageHeight: 600,
  twitterImageWidth: 1200,
  twitterImageHeight: 600,
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
