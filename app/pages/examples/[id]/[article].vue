<template>
  <div v-if="data" class="landing-page example-page">
    <article class="landing-container example-detail">
      <NuxtLink :to="`${localePath('/')}#examples`" class="example-back">
        <Icon name="mdi:arrow-left" aria-hidden="true" />{{ $t('landing.examples.back') }}
      </NuxtLink>

      <header class="example-header">
        <p class="eyebrow">
          {{ $t('landing.examples.demoCompany', { company: data.example.company }) }} ·
          {{ $t(`landing.examples.industries.${data.example.industry}`) }}
        </p>
        <h1>{{ data.snapshot.title }}</h1>
        <p class="example-lead">{{ data.snapshot.excerpt }}</p>
        <p class="example-meta">
          <i18n-t keypath="landing.examples.published" tag="span" scope="global">
            <template #date>
              <NuxtTime :datetime="data.snapshot.publishedAt" :locale dateStyle="long" />
            </template>
          </i18n-t>
          <span>{{ $t('landing.examples.readingTime', { minutes: data.snapshot.readingTime }) }}</span>
          <a :href="data.snapshot.url" target="_blank" rel="noopener"
            >{{ $t('landing.examples.original') }}<Icon name="mdi:open-in-new" aria-hidden="true"
          /></a>
        </p>
      </header>

      <section v-if="data.notes.length" class="example-guide" aria-labelledby="example-guide-title">
        <div class="example-guide-head">
          <h2 id="example-guide-title">{{ $t('landing.examples.guideTitle') }}</h2>
          <USwitch v-model="plain" :label="$t('landing.examples.readerView')" />
        </div>
        <p>{{ $t('landing.examples.guideText') }}</p>
        <ol>
          <li v-for="(note, index) in data.notes" :key="note.quote">
            <a :href="`#quote-${index + 1}`" @click.prevent="show(index + 1)">
              <span class="example-guide-number">{{ index + 1 }}</span>
              <span class="example-guide-kind">{{ $t(`landing.examples.kinds.${note.kind}`) }}</span>
              <span>{{ note.text }}</span>
            </a>
          </li>
        </ol>
      </section>

      <ExampleCover :cover="data.snapshot.cover" priority class="example-cover" />

      <ExampleArticle v-model:active="active" :data :plain />

      <section id="sources" class="example-sources" aria-labelledby="example-sources-title">
        <h2 id="example-sources-title">{{ $t('landing.examples.sourcesTitle') }}</h2>
        <div class="example-sources-grid">
          <div>
            <h3>{{ $t('landing.examples.filesTitle') }}</h3>
            <p>{{ $t('landing.examples.filesText') }}</p>
            <ul>
              <li v-for="file in data.example.files" :key="file.name">
                <Icon name="mdi:file-document-outline" aria-hidden="true" />
                <template v-if="locale === 'en'">
                  <a :href="`/examples/${data.example.id}/en/${file.name}`" target="_blank" rel="noopener">{{
                    file.en
                  }}</a>
                  <a
                    :href="`/examples/${data.example.id}/${file.name}`"
                    target="_blank"
                    rel="noopener"
                    hreflang="cs"
                    class="example-sources-original"
                    >{{ $t('landing.examples.czechOriginal') }}</a
                  >
                </template>
                <a v-else :href="`/examples/${data.example.id}/${file.name}`" target="_blank" rel="noopener">{{
                  file.cs
                }}</a>
              </li>
            </ul>
          </div>
          <div>
            <h3>{{ $t('landing.examples.publicTitle') }}</h3>
            <p v-if="!data.snapshot.sources.length">{{ $t('landing.examples.noPublic') }}</p>
            <ul v-else>
              <li v-for="source in data.snapshot.sources" :key="source">
                <Icon name="mdi:open-in-new" aria-hidden="true" />
                <a :href="source" target="_blank" rel="noopener">{{ sourceLabel(source) }}</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <nav
        v-if="others.length"
        class="example-more"
        :style="{ '--brand': data.example.brand }"
        aria-labelledby="example-more-title"
      >
        <h2 id="example-more-title">
          {{ $t('landing.examples.moreTitle', { company: data.example.company }) }}
        </h2>
        <ul>
          <li v-for="other in others" :key="other.slug">
            <NuxtLink :to="localePath({ name: 'examples-id-article', params: { id, article: other.slug } })">
              {{ other.title }}<Icon name="mdi:arrow-right" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <section class="example-cta" aria-labelledby="example-cta-title">
        <h2 id="example-cta-title">{{ $t('landing.examples.ctaTitle') }}</h2>
        <p>{{ $t('landing.examples.ctaText') }}</p>
        <UButton :to="localePath({ name: 'onboarding-site' })" size="xl" trailingIcon="mdi:arrow-right">{{
          $t('landing.examples.ctaButton')
        }}</UButton>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
import type { ExampleLocale } from '~~/shared/examples'

const route = useRoute()
const { locale, t } = useI18n()
const localePath = useLocalePath()
const id = String(route.params.id)
const article = String(route.params.article)
const lang = locale.value as ExampleLocale

const { data } = await useAsyncData(`example-${id}-${article}-${lang}`, () => loadExample(id, article, lang))
if (!data.value) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
const others = otherArticles(id, article, lang)

const plain = shallowRef(false)
const active = shallowRef(0)

const show = (note: number) => {
  plain.value = false
  active.value = note
  nextTick(() => document.getElementById(`quote-${note}`)?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
}

const sourceLabel = (url: string) => {
  const { hostname, pathname } = new URL(url)
  const path = decodeURIComponent(pathname).replace(/\/$/, '')
  return `${hostname.replace(/^www\./, '')}${path.length > 48 ? `${path.slice(0, 45)}…` : path}`
}

const title = () => t('landing.examples.metaTitle', { title: data.value!.snapshot.title })
useSeoMeta({
  title,
  ogTitle: title,
  description: () => data.value!.snapshot.excerpt,
  ogDescription: () => data.value!.snapshot.excerpt,
  ogImage: () => data.value!.snapshot.cover.url,
})
// The article lives on the company's blog; this copy only annotates it.
// Every page gets a canonical to itself; the higher priority replaces it with the original.
useHead({ link: [{ rel: 'canonical', href: data.value.snapshot.url, tagPriority: 'high' }] })
</script>

<style scoped>
.example-page {
  padding-block: clamp(32px, 5vw, 64px) 96px;
  background: var(--landing-bg);
}
.example-detail {
  max-width: 1080px;
}
.example-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--landing-muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
.example-back:hover {
  color: var(--landing-ink);
}
.example-header {
  max-width: 760px;
  margin-top: 28px;
}
.example-header .eyebrow {
  margin-bottom: 16px;
  text-transform: uppercase;
}
.example-header h1 {
  font-family: var(--topiqu-font-reading);
  font-size: clamp(2rem, 4.4vw, 3.1rem);
  line-height: 1.12;
  letter-spacing: -0.03em;
  font-weight: 700;
  text-wrap: balance;
}
.example-lead {
  margin-top: 18px !important;
  color: var(--landing-muted);
  font-size: 18px;
  line-height: 1.65;
}
.example-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 20px !important;
  color: var(--landing-muted);
  font-size: 14px;
}
.example-meta a {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--landing-accent);
  font-weight: 650;
  text-decoration: none;
}
.example-guide {
  margin-top: 36px;
  padding: 22px 24px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
}
.example-guide-head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px 24px;
}
.example-guide h2 {
  font-size: 18px;
  letter-spacing: -0.01em;
}
.example-guide > p {
  margin-top: 6px !important;
  color: var(--landing-muted);
  font-size: 14.5px;
  line-height: 1.6;
}
.example-guide ol {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 8px 20px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
}
.example-guide a {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2px 10px;
  padding: 8px 10px;
  border-radius: var(--topiqu-control-radius);
  color: var(--landing-ink);
  font-size: 13.5px;
  line-height: 1.5;
  text-decoration: none;
}
.example-guide a:hover,
.example-guide a:focus-visible {
  background: var(--landing-tint);
}
.example-guide-number {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 750;
}
.example-guide-kind {
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.example-cover {
  margin: 40px 0 36px;
  max-width: 680px;
}
.example-sources {
  margin-top: 64px;
  padding-top: 40px;
  border-top: 1px solid var(--landing-line);
}
.example-sources h2 {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
}
.example-sources-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px 48px;
  margin-top: 24px;
}
.example-sources h3 {
  font-size: 16px;
}
.example-sources p {
  margin-top: 6px !important;
  color: var(--landing-muted);
  font-size: 14.5px;
  line-height: 1.6;
}
.example-sources ul {
  display: grid;
  gap: 10px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;
  font-size: 14.5px;
}
.example-sources li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}
.example-sources li .iconify {
  color: var(--landing-muted);
}
.example-sources a {
  color: var(--landing-accent);
  font-weight: 600;
  text-decoration: none;
  overflow-wrap: anywhere;
}
.example-sources a:hover {
  text-decoration: underline;
}
.example-sources-original {
  color: var(--landing-muted) !important;
  font-weight: 500 !important;
  font-size: 13px;
}
.example-more {
  margin-top: 64px;
  padding-top: 40px;
  border-top: 1px solid var(--landing-line);
}
.example-more h2 {
  font-size: clamp(1.5rem, 2.4vw, 2rem);
}
.example-more ul {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}
.example-more a {
  display: flex;
  height: 100%;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding: 20px 22px;
  border: 1px solid var(--landing-line);
  border-top: 3px solid var(--brand);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  color: var(--landing-ink);
  font-family: var(--topiqu-font-reading);
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
  text-decoration: none;
  transition:
    border-color 0.15s,
    box-shadow 0.15s;
}
.example-more a .iconify {
  flex: none;
  color: var(--landing-muted);
}
.example-more a:hover {
  box-shadow: 0 18px 40px -30px color-mix(in srgb, var(--landing-ink) 60%, transparent);
}
.example-more a:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
.example-cta {
  margin-top: 64px;
  padding: clamp(28px, 4vw, 44px);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-tint);
  text-align: center;
}
.example-cta h2 {
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
}
.example-cta p {
  max-width: 560px;
  margin: 12px auto 24px !important;
  color: var(--landing-muted);
  font-size: 16px;
  line-height: 1.7;
}
@media (max-width: 760px) {
  .example-sources-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .landing-container.example-detail {
    width: min(100% - 2rem, 1080px);
  }
}
</style>
