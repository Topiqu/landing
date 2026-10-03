<template>
  <div class="article-packs">
    <div class="article-packs-intro">
      <h3>{{ $t('landing.pricing.articlePacks.title') }}</h3>
      <ul>
        <li><Icon name="mdi:infinity" aria-hidden="true" />{{ $t('landing.pricing.articlePacks.noExpiry') }}</li>
        <li><Icon name="mdi:cart-plus" aria-hidden="true" />{{ $t('landing.pricing.articlePacks.inApp') }}</li>
      </ul>
    </div>
    <ul class="article-packs-list">
      <li v-for="pack in packs" :key="pack.articles" :data-best="pack.best || undefined">
        <span v-if="pack.best" class="article-packs-badge">{{ $t('landing.pricing.articlePacks.best') }}</span>
        <span class="article-packs-stack" :style="{ '--sheets': pack.sheets }" aria-hidden="true">
          <span v-for="sheet in pack.sheets" :key="sheet" :style="{ '--sheet': sheet }" />
        </span>
        <p class="article-packs-count">
          <strong>{{ pack.articles }}</strong> {{ $t('landing.pricing.articlePacks.unit') }}
        </p>
        <p class="article-packs-price">{{ pack.price }}</p>
        <p class="article-packs-unit">
          {{ $t('landing.pricing.articlePacks.unitPrice', { price: pack.unitPrice }) }}
          <span v-if="pack.savings > 0">{{ $t('landing.pricing.articlePacks.save', { percent: pack.savings }) }}</span>
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ARTICLE_PACKS_USD, formatUsd } from '~~/shared/utils/plans'

const { locale } = useI18n()
const baseUnit = ARTICLE_PACKS_USD[0].priceUsd / ARTICLE_PACKS_USD[0].articles
const packs = computed(() =>
  ARTICLE_PACKS_USD.map((pack, index) => {
    const unit = pack.priceUsd / pack.articles
    return {
      articles: pack.articles,
      price: formatUsd(pack.priceUsd, locale.value),
      unitPrice: formatUsd(unit, locale.value),
      savings: Math.round((1 - unit / baseUnit) * 100),
      sheets: index + 1,
      best: index === ARTICLE_PACKS_USD.length - 1,
    }
  }),
)
</script>

<style scoped>
.article-packs {
  display: grid;
  grid-template-columns: minmax(220px, 0.8fr) minmax(0, 2fr);
  align-items: center;
  gap: clamp(24px, 5vw, 64px);
  margin-top: 48px;
  padding: 28px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-bg);
}
.article-packs-intro h3 {
  margin: 0 0 16px;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.3;
}
.article-packs-intro ul {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--landing-muted);
  font-size: 14px;
}
.article-packs-intro li {
  display: flex;
  align-items: center;
  gap: 10px;
}
.article-packs-intro .iconify {
  flex: none;
  color: var(--landing-accent);
  font-size: 18px;
}
.article-packs-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.article-packs-list li {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
}
.article-packs-list li[data-best] {
  border-color: var(--landing-accent);
  box-shadow: 0 0 0 1px var(--landing-accent);
}
.article-packs-badge {
  position: absolute;
  top: -11px;
  right: 16px;
  padding: 2px 10px;
  border-radius: 999px;
  background: var(--landing-accent);
  color: var(--landing-surface);
  font-size: 11px;
  font-weight: 750;
}
/* Stacked sheets: one per pack tier, so volume reads at a glance. */
.article-packs-stack {
  position: relative;
  width: 34px;
  height: 40px;
  margin-bottom: 18px;
}
.article-packs-stack span {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 26px;
  height: 32px;
  border: 1.5px solid var(--landing-accent);
  border-radius: 4px;
  background:
    linear-gradient(var(--landing-accent) 0 0) 6px 9px / 12px 1.5px no-repeat,
    linear-gradient(var(--landing-accent) 0 0) 6px 14px / 9px 1.5px no-repeat,
    var(--landing-surface);
  transform: translate(calc((var(--sheets) - var(--sheet)) * 4px), calc((var(--sheet) - var(--sheets)) * 4px));
}
.article-packs-stack span:not(:last-child) {
  background: var(--landing-tint);
}
.article-packs-count {
  color: var(--landing-muted);
  font-size: 14px;
  font-weight: 600;
}
.article-packs-count strong {
  color: var(--landing-ink);
  font-size: 30px;
  font-weight: 750;
  letter-spacing: -0.03em;
}
.article-packs-price {
  margin-top: 10px !important;
  font-size: 18px;
  font-weight: 750;
}
.article-packs-unit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-top: 2px !important;
  color: var(--landing-muted);
  font-size: 12px;
}
.article-packs-unit span {
  padding: 1px 7px;
  border-radius: 999px;
  background: var(--landing-success-tint);
  color: var(--landing-success);
  font-weight: 700;
}
@media (max-width: 900px) {
  .article-packs {
    grid-template-columns: minmax(0, 1fr);
  }
}
@media (max-width: 600px) {
  .article-packs {
    padding: 20px;
  }
  .article-packs-list {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
  .article-packs-list li {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;
    column-gap: 14px;
  }
  .article-packs-stack {
    grid-row: span 2;
    margin-bottom: 0;
  }
  .article-packs-price {
    grid-column: 3;
    grid-row: 1;
    margin-top: 0 !important;
  }
  .article-packs-unit {
    grid-column: 2 / -1;
  }
}
</style>
