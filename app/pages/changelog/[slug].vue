<template>
  <main class="mx-auto max-w-3xl px-6 py-14 sm:py-20">
    <article v-if="entry" class="docs-prose">
      <NuxtLinkLocale to="/changelog" class="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 no-underline dark:text-indigo-400">← {{ locale === 'cs' ? 'Všechny změny' : 'All updates' }}</NuxtLinkLocale>
      <div class="mb-5 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
        <span class="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{{ entry.type }}</span>
        <span class="text-slate-400">v{{ entry.version }}</span>
        <time class="text-slate-400" :datetime="entry.date">{{ formatDate(entry.date) }}</time>
        <span v-if="entry.breaking" class="rounded-full bg-red-50 px-3 py-1 text-red-700 dark:bg-red-500/10 dark:text-red-300">Breaking</span>
      </div>
      <ContentRenderer :value="entry" />
    </article>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const route = useRoute()
const { locale } = useI18n()
const path = computed(() => `/changelog/${locale.value}/${route.params.slug}`)
const { data: entry } = await useAsyncData(`changelog-entry-${path.value}`, () => queryCollection('changelog').path(path.value).first(), { watch: [path] })
const formatDate = (date: string) => new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(`${date}T12:00:00Z`))
useSeoMeta({ title: () => entry.value ? `${entry.value.title} · Topiqu Changelog` : 'Topiqu Changelog', description: () => entry.value?.description })
</script>
