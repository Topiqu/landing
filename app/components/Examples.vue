<template>
  <section id="examples" class="landing-section examples-section" aria-labelledby="examples-title">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.examples.eyebrow') }}</p>
        <h2 id="examples-title">
          {{ $t('landing.design.examples.title') }} <span>{{ $t('landing.design.examples.accent') }}</span>
        </h2>
        <p class="section-description">{{ $t('landing.design.examples.text') }}</p>
      </div>

      <UTabs v-if="loaded" v-model="current" :items class="examples-tabs" variant="link" size="lg">
        <template #leading="{ item }">
          <span
            class="examples-tab-logo"
            :class="{ 'is-current': item.value === current }"
            :style="{ '--brand': item.brand }"
            aria-hidden="true"
            >{{ item.company[0] }}</span
          >
        </template>
        <template #default="{ item }">
          <span class="examples-tab-label">
            <span class="examples-tab-company">{{ item.company }}</span>
            <span class="examples-tab-industry">{{ item.label }}</span>
          </span>
        </template>
        <template #content="{ item }">
          <template v-if="byId[item.value]">
            <ExampleArticle v-model:active="active" :data="byId[item.value]!" compact framed>
              <template #head>
                <div class="examples-blog-bar">
                  <span class="examples-blog-logo" aria-hidden="true">{{ item.company[0] }}</span>
                  <span class="examples-blog-name">{{ item.company }}</span>
                  <span class="examples-blog-domain">
                    <Icon name="mdi:lock-outline" aria-hidden="true" />{{ byId[item.value]!.example.domain }}
                  </span>
                </div>
                <ExampleCover :cover="byId[item.value]!.snapshot.cover" class="examples-cover" />
                <p class="examples-meta">
                  <NuxtTime :datetime="byId[item.value]!.snapshot.publishedAt" :locale dateStyle="long" />
                  <span>{{
                    $t('landing.examples.readingTime', { minutes: byId[item.value]!.snapshot.readingTime })
                  }}</span>
                  <span class="examples-byline">
                    <img src="/brand/topiqu-mark.webp" alt="" width="16" height="16" />{{
                      $t('landing.design.examples.byline')
                    }}
                  </span>
                </p>
                <h3>{{ byId[item.value]!.snapshot.title }}</h3>
              </template>
              <template #foot>
                <NuxtLink :to="detail(item.value, byId[item.value]!.article)" class="examples-read-more">
                  {{ $t('landing.design.examples.readMore') }}<Icon name="mdi:arrow-right" aria-hidden="true" />
                </NuxtLink>
                <nav class="examples-more" :aria-labelledby="`examples-more-${item.value}`">
                  <h4 :id="`examples-more-${item.value}`">{{ $t('landing.design.examples.moreTitle') }}</h4>
                  <ul>
                    <li v-for="other in others(item.value)" :key="other.slug">
                      <NuxtLink :to="detail(item.value, other.slug)">
                        {{ other.title }}<Icon name="mdi:arrow-right" aria-hidden="true" />
                      </NuxtLink>
                    </li>
                  </ul>
                </nav>
              </template>
            </ExampleArticle>
            <div class="examples-foot">
              <dl class="examples-ledger">
                <div>
                  <dt>{{ $t('landing.design.examples.files', byId[item.value]!.example.files.length) }}</dt>
                  <dd>{{ byId[item.value]!.example.files.length }}</dd>
                </div>
                <div>
                  <dt>{{ $t('landing.design.examples.articles', byId[item.value]!.example.articles.length) }}</dt>
                  <dd>{{ byId[item.value]!.example.articles.length }}</dd>
                </div>
                <div class="is-zero">
                  <dt>{{ $t('landing.design.examples.edits') }}</dt>
                  <dd>0</dd>
                </div>
              </dl>
              <UButton :to="localePath({ name: 'onboarding-site' })" size="xl" trailingIcon="mdi:arrow-right">{{
                $t('landing.design.examples.start')
              }}</UButton>
            </div>
          </template>
        </template>
      </UTabs>
    </div>
  </section>
</template>

<script setup lang="ts">
import { EXAMPLES, type ExampleLocale } from '~~/shared/examples'

const { locale, t } = useI18n()
const localePath = useLocalePath()
const lang = computed(() => locale.value as ExampleLocale)
const detail = (id: string, article: string) => localePath({ name: 'examples-id-article', params: { id, article } })

// Only the featured paragraphs of each company's first article reach the payload.
const { data: loaded } = await useAsyncData(`examples-home-${locale.value}`, () =>
  Promise.all(EXAMPLES.map(({ id, articles }) => loadExample(id, articles[0]!, lang.value, true))),
)
const byId = computed(() =>
  Object.fromEntries((loaded.value ?? []).flatMap((item) => (item ? [[item.example.id, item]] : []))),
)
const others = (id: string) => otherArticles(id, byId.value[id]!.article, lang.value)
const current = shallowRef(EXAMPLES[0]!.id)
// The first note starts open so the margin shows what it is for before anyone hovers.
const active = shallowRef(1)
watch(current, () => (active.value = 1))
const items = computed(() =>
  (loaded.value ?? []).flatMap((item) =>
    item
      ? [
          {
            value: item.example.id,
            label: t(`landing.examples.industries.${item.example.industry}`),
            company: item.example.company,
            brand: item.example.brand,
          },
        ]
      : [],
  ),
)
</script>

<style scoped>
.examples-section {
  background: var(--landing-bg);
}
.examples-section h2 > span {
  display: block;
  color: var(--landing-accent);
}
.examples-tabs :deep([role='tablist']) {
  margin-bottom: 28px;
}
/* Only the open company shows its colour, so three brands never compete with Topiqu's accent. */
.examples-tab-logo,
.examples-blog-logo {
  display: inline-grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--brand);
  color: #fff;
  font-size: 14px;
  font-weight: 750;
  transition:
    background 0.15s,
    color 0.15s;
}
.examples-tab-logo:not(.is-current) {
  background: color-mix(in srgb, var(--landing-ink) 7%, transparent);
  color: var(--landing-muted);
}
/* Nuxt UI truncates tab labels; three company names must stay readable on a phone. */
.examples-tab-label {
  display: grid;
  text-align: left;
  line-height: 1.25;
  white-space: normal;
}
.examples-tab-company {
  font-weight: 700;
}
.examples-tab-industry {
  color: var(--landing-muted);
  font-size: 12.5px;
  font-weight: 500;
}
.examples-blog-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: calc(-1 * var(--page-pad)) calc(-1 * var(--page-pad)) 28px;
  padding: 14px var(--page-pad);
  border-bottom: 1px solid var(--landing-line);
  border-top: 3px solid var(--brand);
  border-radius: var(--topiqu-surface-radius) var(--topiqu-surface-radius) 0 0;
}
.examples-blog-name {
  font-weight: 700;
  white-space: nowrap;
}
.examples-blog-domain {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  margin-left: auto;
  overflow: hidden;
  color: var(--landing-muted);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.examples-cover {
  margin: 0 0 22px;
}
.examples-cover :deep(img) {
  aspect-ratio: 3 / 1;
}
.examples-meta {
  color: var(--landing-muted);
  font-size: 13.5px;
}
.examples-meta > * + *::before {
  content: ' · ';
}
.examples-byline {
  color: var(--landing-ink);
  font-weight: 600;
}
.examples-byline img {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 6px;
  vertical-align: -3px;
}
.examples-section h3 {
  max-width: 680px;
  margin: 8px 0 22px;
  font-family: var(--topiqu-font-reading);
  font-size: clamp(1.5rem, 2.6vw, 2.1rem);
  font-weight: 700;
  line-height: 1.2;
  text-wrap: balance;
}
.examples-read-more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--landing-ink);
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, currentColor 30%, transparent);
  text-underline-offset: 4px;
}
.examples-read-more:hover {
  text-decoration-color: currentColor;
}
.examples-read-more:focus-visible,
.examples-more a:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 3px;
  border-radius: 4px;
}
.examples-more {
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--landing-line);
}
.examples-more h4 {
  color: var(--landing-muted);
  font-size: 12px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.examples-more ul {
  display: grid;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;
}
.examples-more li + li {
  border-top: 1px solid color-mix(in srgb, var(--landing-line) 60%, transparent);
}
.examples-more a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 11px 0;
  color: var(--landing-ink);
  font-family: var(--topiqu-font-reading);
  font-size: 16.5px;
  font-weight: 650;
  line-height: 1.35;
  text-decoration: none;
}
.examples-more a .iconify {
  flex: none;
  color: var(--landing-muted);
  transition: transform 0.15s;
}
.examples-more a:hover .iconify {
  color: var(--landing-ink);
  transform: translateX(3px);
}
.examples-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-top: 32px;
}
.examples-ledger {
  display: flex;
  flex-wrap: wrap;
  gap: 12px clamp(24px, 4vw, 44px);
  margin: 0;
}
/* Reversed so the number reads first; `flex-end` keeps numbers level when a label wraps. */
.examples-ledger > div {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
}
.examples-ledger dd {
  margin: 0;
  color: var(--landing-ink);
  font-size: clamp(1.9rem, 3vw, 2.4rem);
  font-weight: 750;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.03em;
  line-height: 1;
}
.examples-ledger .is-zero dd {
  color: var(--landing-accent);
}
.examples-ledger dt {
  margin-top: 6px;
  color: var(--landing-muted);
  font-size: 13.5px;
  font-weight: 600;
}
@media (prefers-reduced-motion: reduce) {
  .examples-tab-logo,
  .examples-more a .iconify {
    transition: none;
  }
}
@media (max-width: 640px) {
  .examples-tab-logo {
    display: none;
  }
  .examples-tab-company {
    font-size: 14px;
  }
  .examples-foot > a {
    width: 100%;
    justify-content: center;
  }
  .examples-ledger {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    width: 100%;
    gap: 16px;
  }
  .examples-byline {
    display: block;
    margin-top: 4px;
  }
  .examples-meta > .examples-byline::before {
    content: none;
  }
}
</style>
