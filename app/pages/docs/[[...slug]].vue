<template>
  <div class="mx-auto grid max-w-[100rem] grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]">
    <aside class="border-b border-slate-200 p-5 dark:border-white/10 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-7">
      <p class="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">API v1</p>
      <nav class="flex gap-2 overflow-x-auto lg:flex-col">
        <NuxtLinkLocale
          v-for="item in navigation"
          :key="item.path"
          :to="docsUrl(item.stem)"
          class="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
          activeClass="!bg-indigo-50 !text-indigo-700 dark:!bg-indigo-500/10 dark:!text-indigo-300"
        >
          {{ item.title }}
        </NuxtLinkLocale>
        <a href="/api-reference" class="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white">
          {{ locale === 'cs' ? 'API reference' : 'API reference' }} ↗
        </a>
      </nav>
    </aside>

    <main class="min-w-0 px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
      <article v-if="page" class="docs-prose mx-auto max-w-3xl">
        <p class="mb-3 text-sm font-semibold text-indigo-600 dark:text-indigo-400">Topiqu External API</p>
        <ContentRenderer :value="page" />
      </article>
      <div v-else class="mx-auto max-w-3xl">
        <h1>{{ locale === 'cs' ? 'Stránka nenalezena' : 'Page not found' }}</h1>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'docs' })

const route = useRoute()
const { locale } = useI18n()
const localePath = useLocalePath()
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.join('/') : value || 'index'
})
const contentPath = computed(() => `/docs/${locale.value}/${slug.value}`)
const { data: page } = await useAsyncData(`docs-${contentPath.value}`, () => queryCollection('docs').path(contentPath.value).first(), { watch: [contentPath] })
const { data: navigation } = await useAsyncData(`docs-navigation-${locale.value}`, () => queryCollection('docs').where('path', 'LIKE', `/docs/${locale.value}/%`).order('order', 'ASC').select('title', 'path', 'stem').all(), { watch: [locale] })

const docsUrl = (stem: string) => {
  const clean = stem.replace(`docs/${locale.value}/`, '').replace(/\/index$/, '')
  return localePath(`/docs${clean ? `/${clean}` : ''}`)
}

useSeoMeta({ title: () => page.value ? `${page.value.title} · Topiqu Developers` : 'Topiqu Developers', description: () => page.value?.description })
</script>

<style>
.docs-prose h1 { font-size: clamp(2.2rem, 5vw, 3.5rem); line-height: 1.05; margin: 0 0 1rem; letter-spacing: -0.04em; }
.docs-prose h2 { font-size: 1.55rem; margin: 2.75rem 0 1rem; letter-spacing: -0.02em; }
.docs-prose h3 { font-size: 1.15rem; margin: 2rem 0 .75rem; }
.docs-prose p, .docs-prose li { color: rgb(71 85 105); line-height: 1.8; }
.dark .docs-prose p, .dark .docs-prose li { color: rgb(148 163 184); }
.docs-prose a { color: rgb(79 70 229); font-weight: 600; }
.dark .docs-prose a { color: rgb(129 140 248); }
.docs-prose pre { overflow-x: auto; border: 1px solid rgb(226 232 240); border-radius: 1rem; background: rgb(15 23 42); color: rgb(226 232 240); padding: 1.25rem; }
.docs-prose code:not(pre code) { border-radius: .35rem; background: rgb(226 232 240); padding: .15rem .35rem; font-size: .9em; }
.dark .docs-prose code:not(pre code) { background: rgb(255 255 255 / .1); }
.docs-prose blockquote { border-left: 3px solid rgb(99 102 241); margin: 1.5rem 0; padding-left: 1rem; }
.docs-prose table { border-collapse: collapse; width: 100%; }
.docs-prose th, .docs-prose td { border-bottom: 1px solid rgb(226 232 240); padding: .75rem; text-align: left; }
</style>
