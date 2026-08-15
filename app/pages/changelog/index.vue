<template>
  <main class="mx-auto max-w-5xl px-6 py-14 sm:py-20">
    <div class="mb-12 max-w-3xl">
      <p class="mb-3 text-sm font-bold uppercase tracking-[0.16em] text-indigo-600 dark:text-indigo-400">Topiqu releases</p>
      <h1 class="m-0 text-4xl font-black tracking-[-0.04em] sm:text-6xl">{{ copy.title }}</h1>
      <p class="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-400">{{ copy.description }}</p>
      <div class="mt-6 flex gap-3 text-sm font-semibold">
        <a href="/api/changelog/rss.xml" class="text-indigo-600 dark:text-indigo-400">RSS</a>
        <a href="/api/changelog/feed.json" class="text-indigo-600 dark:text-indigo-400">JSON Feed</a>
      </div>
    </div>

    <div class="mb-8 flex flex-wrap gap-2" role="group" :aria-label="copy.filter">
      <button
        v-for="filter in filters"
        :key="filter"
        type="button"
        class="rounded-full border px-4 py-2 text-sm font-semibold transition"
        :class="activeFilter === filter ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-indigo-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-300'"
        @click="activeFilter = filter"
      >
        {{ filter === 'all' ? copy.all : filter }}
      </button>
    </div>

    <div class="grid gap-5">
      <NuxtLinkLocale
        v-for="entry in filteredEntries"
        :key="entry.path"
        :to="`/changelog/${entry.stem.split('/').at(-1)}`"
        class="group rounded-2xl border border-slate-200 bg-white p-6 no-underline transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-indigo-500/40 sm:p-8"
      >
        <div class="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
          <span class="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300">{{ entry.type }}</span>
          <span class="text-slate-400">v{{ entry.version }}</span>
          <time class="text-slate-400" :datetime="entry.date">{{ formatDate(entry.date) }}</time>
          <span v-if="entry.breaking" class="rounded-full bg-red-50 px-3 py-1 text-red-700 dark:bg-red-500/10 dark:text-red-300">Breaking</span>
        </div>
        <h2 class="mb-2 mt-5 text-2xl font-bold tracking-tight text-slate-950 group-hover:text-indigo-700 dark:text-white dark:group-hover:text-indigo-300">{{ entry.title }}</h2>
        <p class="m-0 leading-7 text-slate-600 dark:text-slate-400">{{ entry.description }}</p>
        <div class="mt-5 flex flex-wrap gap-2">
          <span v-for="area in entry.areas" :key="area" class="text-xs font-semibold text-slate-500">#{{ area }}</span>
        </div>
      </NuxtLinkLocale>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { locale } = useI18n()
const activeFilter = ref('all')
const { data: entries } = await useAsyncData(`changelog-${locale.value}`, () => queryCollection('changelog').where('path', 'LIKE', `/changelog/${locale.value}/%`).order('date', 'DESC').all(), { watch: [locale] })
const filters = computed(() => ['all', ...new Set((entries.value || []).flatMap((entry) => entry.areas))])
const filteredEntries = computed(() => activeFilter.value === 'all' ? entries.value : entries.value?.filter((entry) => entry.areas.includes(activeFilter.value)))
const copy = computed(() => locale.value === 'cs' ? { title: 'Co je nového', description: 'Nové funkce, vylepšení, opravy a všechny změny veřejného API na jednom místě.', filter: 'Filtrovat změny', all: 'vše' } : { title: 'What’s new', description: 'New features, improvements, fixes, and every public API change in one place.', filter: 'Filter changes', all: 'all' })
const formatDate = (date: string) => new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(`${date}T12:00:00Z`))
useSeoMeta({
  title: () => copy.value.title,
  description: () => copy.value.description,
  ogTitle: () => `${copy.value.title} | Topiqu`,
  ogDescription: () => copy.value.description,
})
useSchemaOrg([
  defineWebPage({ name: () => copy.value.title, description: () => copy.value.description, url: () => `https://topiqu.com/${locale.value}/changelog` }),
  defineBreadcrumb({
    itemListElement: () => [
      { name: 'Topiqu', item: `https://topiqu.com/${locale.value}` },
      { name: copy.value.title },
    ],
  }),
])
</script>
