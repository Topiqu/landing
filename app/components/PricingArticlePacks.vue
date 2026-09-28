<script setup lang="ts">
import { ARTICLE_PACKS_USD, formatUsd } from '../../shared/utils/plans'

const { locale } = useI18n()
const packs = computed(() =>
  ARTICLE_PACKS_USD.map((pack) => ({
    articles: pack.articles,
    price: formatUsd(pack.priceUsd, locale.value),
    unitPrice: formatUsd(pack.priceUsd / pack.articles, locale.value),
  })),
)
</script>

<template>
  <div class="article-packs">
    <div class="article-packs-intro">
      <h3>{{ $t('landing.pricing.articlePacks.title') }}</h3>
      <p>{{ $t('landing.pricing.articlePacks.description') }}</p>
    </div>
    <dl class="article-packs-list">
      <div v-for="pack in packs" :key="pack.articles" class="article-packs-row">
        <dt>{{ $t('landing.pricing.articlePacks.articles', { count: pack.articles }) }}</dt>
        <dd>
          <strong>{{ pack.price }}</strong>
          <span>{{ $t('landing.pricing.articlePacks.unitPrice', { price: pack.unitPrice }) }}</span>
        </dd>
      </div>
    </dl>
  </div>
</template>

<style scoped>
.article-packs {
  display: grid;
  grid-template-columns: minmax(200px, 0.9fr) minmax(0, 1.6fr);
  gap: clamp(24px, 5vw, 72px);
  align-items: start;
  margin-top: 48px;
  padding-top: 35px;
  border-top: 1px solid var(--landing-line);
}
.article-packs-intro h3 {
  margin: 0 0 9px;
  font-size: 19px;
  line-height: 1.35;
  font-weight: 700;
}
.article-packs-intro p {
  max-width: 34ch;
  color: var(--landing-muted);
  font-size: 13px;
  line-height: 1.7;
}
.article-packs-list {
  margin: 0;
}
.article-packs-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;
  padding: 11px 0;
  border-bottom: 1px solid var(--landing-line);
}
.article-packs-row:first-child {
  padding-top: 0;
}
.article-packs-row:last-child {
  border-bottom: 0;
}
.article-packs-row dt {
  font-size: 14px;
  font-weight: 700;
}
.article-packs-row dd {
  display: inline-flex;
  align-items: baseline;
  gap: 14px;
  margin: 0;
  text-align: right;
}
.article-packs-row strong {
  font-size: 15px;
  font-weight: 750;
  white-space: nowrap;
}
.article-packs-row span {
  color: var(--landing-muted);
  font-size: 12px;
  white-space: nowrap;
}
@media (max-width: 720px) {
  .article-packs {
    grid-template-columns: 1fr;
    gap: 22px;
  }
}
@media (max-width: 420px) {
  .article-packs-row dd {
    display: grid;
    gap: 1px;
  }
}
</style>
