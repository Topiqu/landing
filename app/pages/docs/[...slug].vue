<template>
  <div class="mx-auto grid max-w-[100rem] grid-cols-1 lg:grid-cols-[16rem_minmax(0,1fr)]">
    <aside
      class="border-b border-slate-200 p-5 dark:border-white/10 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:p-7"
    >
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
        <a
          :href="`/${locale}/api-reference`"
          class="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 no-underline hover:bg-white hover:text-slate-950 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white"
        >
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
const slug = computed(() => {
  const value = route.params.slug
  return Array.isArray(value) ? value.join('/') : value || 'index'
})
const contentPath = computed(
  () => `/docs/${locale.value}${slug.value && slug.value !== 'index' ? `/${slug.value}` : ''}`,
)
const { data: page } = await useAsyncData(
  () => `docs-${contentPath.value}`,
  () => queryCollection('docs').path(contentPath.value).first(),
)
const { data: navigation } = await useAsyncData(
  () => `docs-navigation-${locale.value}`,
  () =>
    queryCollection('docs')
      .where('path', 'LIKE', `/docs/${locale.value}/%`)
      .order('order', 'ASC')
      .select('title', 'path', 'stem')
      .all(),
)

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Documentation page not found' })
}

const docsUrl = (stem: string) => {
  const clean = stem.replace(`docs/${locale.value}/`, '').replace(/(^|\/)index$/, '')
  return `/docs${clean ? `/${clean}` : ''}`
}

useSeoMeta({
  title: () => (page.value ? `${page.value.title} · Topiqu Developers` : 'Topiqu Developers'),
  description: () => page.value?.description,
})
useSchemaOrg([
  defineWebPage({
    name: page.value.title,
    description: page.value.description,
  }),
])
</script>
