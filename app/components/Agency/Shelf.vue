<template>
  <div class="agency-shelf" role="img" :aria-label="$t('agencies.shelf.label')">
    <div class="agency-covers">
      <article
        v-for="blog in samples"
        :key="blog.domain"
        class="agency-cover"
        :data-plan="blog.plan"
        :style="{ '--c': blog.color }"
      >
        <div class="agency-cover-bar">
          <i /><i /><i /><span>{{ blog.domain }}</span>
        </div>
        <div class="agency-cover-mast">
          {{ blog.name }}<small>{{ $t('agencies.shelf.blog') }}</small>
        </div>
        <div class="agency-cover-art" :data-art="blog.art" />
        <div class="agency-cover-body">
          <small>{{ blog.section }}</small>
          <p>{{ blog.title }}</p>
          <div class="agency-cover-meta">
            <span>{{ $t(`agencies.plans.names.${blog.plan}`) }}</span>
            <span v-if="blog.articles">{{ $t('agencies.shelf.articles', blog.articles) }}</span>
            <span v-else>{{ $t('agencies.shelf.paused') }}</span>
          </div>
        </div>
      </article>
    </div>
    <div class="agency-plate">
      <span
        ><b>{{ $t('agencies.shelf.agency') }}</b> · {{ $t('agencies.shelf.agencyLabel') }}</span
      >
      <span>{{ $t('agencies.shelf.summary', { blogs: samples.length, credits }) }}</span>
      <span
        ><strong>{{ formatUsd(price, locale) }}</strong> {{ $t('agencies.shelf.invoice') }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { AGENCY_PACK_CREDITS, agencyPriceUsd, formatUsd } from '~~/shared/utils/plans'

const { locale } = useI18n()
const samples = useAgencySamples()
const credits = AGENCY_SAMPLE_PACKS * AGENCY_PACK_CREDITS
// Free blogs take no slot, so the sample invoice counts only the paid ones.
const price = agencyPriceUsd({
  blogs: AGENCY_SAMPLE_BLOGS.filter((blog) => blog.plan !== 'free').length,
  premium: AGENCY_SAMPLE_BLOGS.filter((blog) => blog.plan === 'premium').length,
  packs: AGENCY_SAMPLE_PACKS,
})
</script>

<style scoped>
.agency-shelf {
  position: relative;
  height: 460px;
  margin-top: 72px;
}
.agency-covers {
  display: flex;
  justify-content: center;
}
.agency-cover {
  flex: none;
  width: 268px;
  margin-inline: 6px;
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
  box-shadow:
    0 1px 2px #0f172a0d,
    0 30px 60px -34px #0f172a59;
  text-align: left;
}
.agency-cover:nth-child(1) {
  transform: rotate(-5deg) translateY(44px);
}
.agency-cover:nth-child(2) {
  z-index: 1;
  transform: rotate(-1.8deg) translateY(8px);
}
.agency-cover:nth-child(3) {
  z-index: 1;
  transform: rotate(1.8deg) translateY(8px);
}
.agency-cover:nth-child(4) {
  transform: rotate(5deg) translateY(44px);
}
.agency-cover-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding-inline: 12px;
  border-bottom: 1px solid var(--landing-line);
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 11px;
}
.agency-cover-bar i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--landing-line);
}
.agency-cover-bar span {
  margin-left: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.agency-cover-mast {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
  padding: 12px 14px;
  font: 600 17px/1.2 var(--topiqu-font-reading);
}
.agency-cover-mast small {
  color: var(--landing-muted);
  font: 700 10px/1 var(--ui-font-sans);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.agency-cover-art {
  height: 132px;
  background-color: var(--c);
}
.agency-cover-art[data-art='stripes'] {
  background-image: repeating-linear-gradient(
    115deg,
    var(--c) 0 18px,
    color-mix(in srgb, var(--c) 70%, #fff) 18px 30px,
    color-mix(in srgb, var(--c) 45%, #fff) 30px 38px
  );
}
.agency-cover-art[data-art='arcs'] {
  background-image: radial-gradient(
    circle at 18% 125%,
    transparent 0 40px,
    color-mix(in srgb, var(--c) 55%, #fff) 40px 52px,
    transparent 52px 70px,
    color-mix(in srgb, var(--c) 30%, #fff) 70px 80px,
    transparent 80px
  );
}
.agency-cover-art[data-art='dots'] {
  background-image:
    radial-gradient(circle at 72% 42%, color-mix(in srgb, var(--c) 35%, #fff) 0 44px, transparent 45px),
    radial-gradient(circle, color-mix(in srgb, var(--c) 55%, #fff) 2px, transparent 2.5px);
  background-size:
    auto,
    14px 14px;
}
.agency-cover-art[data-art='grid'] {
  background-image:
    linear-gradient(90deg, color-mix(in srgb, var(--c) 60%, #000) 0 50%, transparent 50%),
    linear-gradient(color-mix(in srgb, var(--c) 30%, #fff) 0 50%, transparent 50%);
  background-size: 36px 36px;
}
.agency-cover-body {
  padding: 14px 14px 16px;
}
.agency-cover-body small {
  color: var(--c);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.agency-cover-body p {
  margin-top: 6px;
  font: 600 19px/1.2 var(--topiqu-font-reading);
  letter-spacing: -0.02em;
}
.agency-cover-meta {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px solid var(--landing-line);
  color: var(--landing-muted);
  font-size: 11px;
}
/* A Free blog stays online but stops writing, so it reads as paused. */
.agency-cover[data-plan='free'] .agency-cover-art {
  filter: grayscale(1);
  opacity: 0.5;
}
.agency-cover[data-plan='free'] .agency-cover-mast,
.agency-cover[data-plan='free'] .agency-cover-body p {
  color: var(--landing-muted);
}
.agency-cover[data-plan='free'] .agency-cover-body small {
  color: var(--landing-muted);
}
.agency-plate {
  position: absolute;
  bottom: 0;
  left: 50%;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  width: min(100%, 960px);
  padding: 16px 28px;
  transform: translateX(-50%);
  border: 1px solid var(--landing-line);
  border-bottom: 0;
  border-radius: 14px 14px 0 0;
  background: var(--landing-surface);
  box-shadow: 0 -18px 40px -30px #0f172a40;
  color: var(--landing-muted);
  font-size: 14px;
}
.agency-plate b {
  color: var(--landing-ink);
}
.agency-plate strong {
  color: var(--landing-accent);
  font: 600 22px/1 var(--topiqu-font-reading);
  letter-spacing: -0.02em;
}
@media (max-width: 1100px) {
  .agency-shelf {
    height: 420px;
  }
  .agency-cover {
    width: 228px;
  }
  .agency-cover-art {
    height: 110px;
  }
}
/* Phones fan three blogs behind one another instead of squeezing four side by side. */
@media (max-width: 760px) {
  .agency-shelf {
    height: auto;
    margin-top: 48px;
  }
  .agency-cover {
    width: 220px;
    margin-inline: -70px;
  }
  .agency-cover:nth-child(1) {
    transform: rotate(-8deg) translateY(40px) scale(0.92);
  }
  .agency-cover:nth-child(2) {
    z-index: 2;
    transform: none;
  }
  .agency-cover:nth-child(3) {
    transform: rotate(8deg) translateY(40px) scale(0.92);
  }
  .agency-cover:nth-child(4) {
    display: none;
  }
  /* In flow under the front blog, so it neither hides it nor gets clipped by the hero. */
  .agency-plate {
    position: relative;
    bottom: auto;
    left: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    width: 100%;
    margin-top: -16px;
    padding: 14px 18px;
    transform: none;
    font-size: 13px;
  }
}
</style>
