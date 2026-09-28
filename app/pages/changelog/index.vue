<template>
  <main class="release-page">
    <header class="release-heading">
      <p class="release-eyebrow">Topiqu / Changelog</p>
      <h1>{{ copy.title }}</h1>
      <p>{{ copy.description }}</p>
      <div class="release-feeds">
        <UButton to="/api/changelog/rss.xml" external icon="mdi:rss" variant="link" size="sm">RSS</UButton
        ><UButton to="/api/changelog/feed.json" external variant="link" size="sm">JSON Feed</UButton>
      </div>
    </header>
    <div v-if="filters.length > 1" class="release-filters" role="group" :aria-label="copy.filter">
      <UButton
        v-for="filter in filters"
        :key="filter"
        color="neutral"
        :variant="activeFilter === filter ? 'soft' : 'ghost'"
        :aria-pressed="activeFilter === filter"
        @click="activeFilter = filter"
        >{{ filter === 'all' ? copy.all : areaLabel(filter) }}</UButton
      >
    </div>
    <div class="release-list">
      <NuxtLinkLocale
        v-for="entry in filteredEntries"
        :key="entry.path"
        :to="'/changelog/' + entry.stem.split('/').at(-1)"
        class="release-entry"
      >
        <div class="release-meta">
          <time :datetime="entry.date">{{ formatDate(entry.date) }}</time
          ><span>v{{ entry.version }} · {{ typeLabel(entry.type) }}</span
          ><span v-if="entry.breaking">Breaking</span>
        </div>
        <div>
          <h2>{{ entry.title }} <span aria-hidden="true">↗</span></h2>
          <p>{{ entry.description }}</p>
          <div class="release-areas">
            <span v-for="area in entry.areas" :key="area">{{ areaLabel(area) }}</span>
          </div>
        </div>
      </NuxtLinkLocale>
    </div>
  </main>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'docs' })
const { locale } = useI18n()
const activeFilter = ref('all')
const areaLabel = (area: string) => changelogAreaLabel(locale.value, area)
const typeLabel = (type: string) => changelogTypeLabel(locale.value, type)
const { data: entries } = await useAsyncData(
  () => `changelog-${locale.value}`,
  () => queryCollection('changelog').where('path', 'LIKE', `/changelog/${locale.value}/%`).order('date', 'DESC').all(),
)
const filters = computed(() => ['all', ...new Set((entries.value || []).flatMap((entry) => entry.areas))])
const filteredEntries = computed(() =>
  activeFilter.value === 'all'
    ? entries.value
    : entries.value?.filter((entry) => entry.areas.includes(activeFilter.value)),
)
const copy = computed(() =>
  locale.value === 'cs'
    ? {
        title: 'Co je nového',
        description: 'Nové funkce, vylepšení, opravy a všechny změny veřejného API na jednom místě.',
        filter: 'Filtrovat změny',
        all: 'vše',
      }
    : {
        title: 'What’s new',
        description: 'New features, improvements, fixes, and every public API change in one place.',
        filter: 'Filter changes',
        all: 'all',
      },
)
const formatDate = (date: string) =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'long' }).format(new Date(`${date}T12:00:00Z`))
useSeoMeta({ title: () => `${copy.value.title} · Topiqu`, description: () => copy.value.description })
</script>

<style scoped>
.release-page {
  max-width: 1000px;
  margin: auto;
  padding: 64px 24px 100px;
}
.release-heading {
  max-width: 680px;
  margin-bottom: 42px;
}
.release-eyebrow {
  color: var(--landing-accent);
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 20px;
}
h1 {
  font-weight: 750;
  font-size: clamp(36px, 5vw, 54px);
  letter-spacing: -0.04em;
  line-height: 1.15;
}
.release-heading > p:not(.release-eyebrow) {
  font-size: 18px;
  line-height: 1.8;
  margin-top: 22px;
  color: var(--landing-muted);
}
.release-feeds,
.release-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 20px;
}
.release-filters {
  margin-bottom: 24px;
}
.release-entry {
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 36px;
  padding: 32px 0;
  border-top: 1px solid var(--landing-line);
  text-decoration: none;
}
.release-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
  color: var(--landing-muted);
}
h2 {
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 24px;
  margin-bottom: 12px;
}
.release-entry:hover h2 {
  color: var(--landing-accent);
}
.release-entry p {
  line-height: 1.8;
  color: var(--landing-muted);
}
.release-areas {
  display: flex;
  gap: 14px;
  margin-top: 18px;
  font-size: 12px;
  color: var(--landing-muted);
}
@media (max-width: 640px) {
  .release-entry {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
