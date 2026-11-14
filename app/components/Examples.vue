<template>
  <section class="landing-section examples-section" aria-labelledby="examples-title">
    <div class="landing-container examples-grid">
      <div class="section-heading examples-heading">
        <p class="eyebrow">{{ $t('landing.design.examples.eyebrow') }}</p>
        <h2 id="examples-title">{{ $t('landing.design.examples.title') }}</h2>
        <p class="section-description">{{ $t('landing.design.examples.text') }}</p>
        <a :href="HUB_URL" target="_blank" rel="noopener" class="examples-all"
          >{{ $t('landing.design.examples.all') }}<Icon name="mdi:arrow-right" aria-hidden="true"
        /></a>
      </div>
      <ul class="examples-list">
        <li v-for="(item, index) in items" :key="item.title">
          <article class="example-card">
            <NuxtImg
              :src="articles[index]!.cover"
              width="1200"
              height="675"
              sizes="100vw md:720px"
              loading="lazy"
              :alt="item.imageAlt"
              class="example-cover"
            />
            <div class="example-body">
              <p class="example-kind">{{ item.kind }}</p>
              <h3>{{ item.title }}</h3>
              <p>{{ item.text }}</p>
              <ul class="example-highlights">
                <li v-for="highlight in item.highlights" :key="highlight">
                  <Icon name="mdi:check" aria-hidden="true" />{{ highlight }}
                </li>
              </ul>
              <UButton
                :to="articles[index]!.url"
                target="_blank"
                external
                size="lg"
                trailingIcon="mdi:open-in-new"
                :aria-label="`${$t('landing.design.examples.open')}: ${item.title}`"
                >{{ $t('landing.design.examples.open') }}</UButton
              >
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
const HUB_URL = 'https://ukazky.topiqu.com'
// Same order as `landing.design.examples.items`; both locales link the same published articles.
const articles = [
  {
    url: `${HUB_URL}/cs/clanky/atmos-dc-25-s-v-roce-2026-vyplati-se`,
    cover:
      'https://cdn.topiqu.com/article-images/d351c74f-7238-4046-ad3e-e8a7a17eec79/article-1794144465783-d7b93b52-c8af-4834-a380-d25a83097029.webp',
  },
]

type Message = Parameters<ReturnType<typeof useI18n>['rt']>[0]
type Example = { kind: string; title: string; text: string; imageAlt: string; highlights: string[] }

const { tm, rt } = useI18n()
const items = computed(() =>
  (tm('landing.design.examples.items') as Record<string, Message | Message[]>[]).map(
    ({ highlights, ...fields }) =>
      ({
        ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, rt(value as Message)])),
        highlights: (highlights as Message[]).map((highlight) => rt(highlight)),
      }) as Example,
  ),
)
</script>

<style scoped>
.examples-section {
  background: var(--landing-bg);
}
.examples-grid {
  display: grid;
  grid-template-columns: minmax(0, 4.6fr) minmax(0, 7.4fr);
  align-items: center;
  gap: 64px;
}
.examples-heading {
  margin-bottom: 0;
}
.examples-all {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 24px;
  color: var(--landing-accent);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
}
.examples-all:hover .iconify {
  transform: translateX(3px);
}
.examples-all .iconify {
  transition: transform 0.15s;
}
.examples-all:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 4px;
  border-radius: var(--topiqu-control-radius);
}
.examples-list {
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.example-card {
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  box-shadow: 0 18px 40px -32px color-mix(in srgb, var(--landing-ink) 45%, transparent);
}
.example-cover {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--landing-tint);
}
.example-body {
  padding: 28px 30px 30px;
}
.example-kind {
  margin-bottom: 10px;
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
.example-body h3 {
  font-family: var(--topiqu-font-reading);
  font-size: clamp(1.4rem, 2.4vw, 1.75rem);
  font-weight: 700;
  line-height: 1.25;
}
.example-body > p:not(.example-kind) {
  margin-top: 12px;
  color: var(--landing-muted);
  font-size: 15px;
  line-height: 1.7;
}
.example-highlights {
  display: grid;
  gap: 8px;
  margin: 20px 0 26px;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-weight: 600;
}
.example-highlights li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.example-highlights .iconify {
  flex: none;
  margin-top: 2px;
  color: var(--landing-accent);
}
@media (max-width: 1000px) {
  .examples-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 38px;
  }
}
@media (max-width: 600px) {
  .example-body {
    padding: 22px 20px 24px;
  }
}
</style>
