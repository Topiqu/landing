<template>
  <div
    ref="root"
    class="agency-pool"
    role="img"
    :aria-label="$t('agencies.pool.label', { used, total, blogs: samples.length })"
    :data-armed="armed || undefined"
  >
    <div class="agency-pool-top">
      <span>{{ $t('agencies.pool.period') }}</span>
      <span
        ><strong>{{ used }}</strong> {{ $t('agencies.pool.used', { total }) }}</span
      >
    </div>
    <div class="agency-pool-callouts">
      <span v-if="limited" :style="{ left: `${limited.offset}%` }">
        {{ $t('agencies.pool.limit', { blog: limited.name, limit: limited.limit }) }}
      </span>
      <span :style="{ left: `${(used / total) * 100}%` }">
        {{ $t('agencies.pool.rollover', total - used) }}
      </span>
    </div>
    <div class="agency-pool-bar">
      <i
        v-for="(blog, index) in spending"
        :key="blog.domain"
        :style="{ '--c': blog.color, '--i': index, width: `${blog.share}%` }"
      />
      <span class="agency-pool-rest" />
    </div>
    <div class="agency-pool-legend">
      <div v-for="blog in samples" :key="blog.domain" :style="{ '--c': blog.plan === 'free' ? undefined : blog.color }">
        <strong>{{ blog.name }}</strong>
        <span>
          {{
            blog.limit
              ? $t('agencies.pool.ofLimit', { used: blog.credits, limit: blog.limit })
              : blog.credits
                ? `${blog.credits} ${$t('agencies.units.credit', blog.credits)}`
                : $t('agencies.pool.paused')
          }}
          · {{ $t(`agencies.plans.names.${blog.plan}`) }}
        </span>
      </div>
      <span class="mock-btn"><Icon name="mdi:tray-arrow-down" />{{ $t('agencies.pool.csv') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AGENCY_PACK_CREDITS } from '~~/shared/utils/plans'

const samples = useAgencySamples()
const total = AGENCY_SAMPLE_PACKS * AGENCY_PACK_CREDITS
const used = AGENCY_SAMPLE_BLOGS.reduce((sum, blog) => sum + blog.credits, 0)

const spending = computed(() =>
  samples.value.filter((blog) => blog.credits).map((blog) => ({ ...blog, share: (blog.credits / total) * 100 })),
)
// The limit callout points at the start of the limited blog's segment.
const limited = computed(() => {
  const index = spending.value.findIndex((blog) => blog.limit)
  if (index < 0) return
  const offset = spending.value.slice(0, index).reduce((sum, blog) => sum + blog.share, 0)
  return { ...spending.value[index]!, offset }
})

// The bar renders full on the server; the client empties it only to fill it once it scrolls into view.
const root = useTemplateRef('root')
const visible = useElementVisibility(root)
const armed = ref(false)
onMounted(() => {
  if (!visible.value) armed.value = true
})
watch(visible, (value) => {
  if (value) armed.value = false
})
</script>

<style scoped>
.agency-pool {
  margin-top: 56px;
}
.agency-pool-top {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 12px;
  color: var(--landing-muted);
  font-size: 14px;
}
.agency-pool-top strong {
  color: var(--landing-ink);
  font: 600 40px/1 var(--topiqu-font-reading);
  letter-spacing: -0.03em;
}
.agency-pool-callouts {
  position: relative;
  height: 56px;
  font-size: 13px;
  line-height: 1.35;
}
.agency-pool-callouts span {
  position: absolute;
  bottom: 0;
  max-width: 240px;
  padding: 0 0 8px 10px;
  border-left: 1px solid var(--landing-ink);
}
.agency-pool-bar {
  display: flex;
  gap: 3px;
  height: 64px;
}
.agency-pool-bar i {
  flex: none;
  background: var(--c);
  transform-origin: left;
  transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  transition-delay: calc(var(--i) * 120ms);
}
.agency-pool-bar i:first-child {
  border-radius: 12px 0 0 12px;
}
[data-armed] .agency-pool-bar i {
  transform: scaleX(0);
  transition: none;
}
.agency-pool-rest {
  flex: 1;
  border: 1px dashed color-mix(in srgb, var(--landing-muted) 45%, transparent);
  border-radius: 0 12px 12px 0;
  background: repeating-linear-gradient(135deg, var(--landing-bg) 0 8px, var(--landing-line) 8px 10px);
}
.agency-pool-legend {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr)) auto;
  align-items: center;
  gap: 16px 24px;
  margin-top: 28px;
  font-size: 14px;
}
.agency-pool-legend div {
  display: grid;
  gap: 2px;
}
.agency-pool-legend strong {
  display: flex;
  align-items: center;
  gap: 8px;
}
.agency-pool-legend strong::before {
  content: '';
  flex: none;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  background: var(--c, var(--landing-line));
}
.agency-pool-legend div span {
  padding-left: 18px;
  color: var(--landing-muted);
}
@media (prefers-reduced-motion: reduce) {
  .agency-pool-bar i,
  [data-armed] .agency-pool-bar i {
    transform: none;
    transition: none;
  }
}
@media (max-width: 900px) {
  .agency-pool-legend {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .agency-pool-legend .mock-btn {
    grid-column: 1 / -1;
    justify-self: start;
  }
}
/* Pinned callouts would overlap on phones, so they drop below the legend as plain notes. */
@media (max-width: 640px) {
  .agency-pool {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
  }
  .agency-pool-callouts {
    order: 1;
    display: grid;
    gap: 10px;
    height: auto;
    margin-top: 24px;
  }
  .agency-pool-callouts span {
    position: static;
    max-width: none;
    padding-bottom: 0;
  }
  .agency-pool-bar {
    height: 44px;
  }
  .agency-pool-top strong {
    font-size: 32px;
  }
}
</style>
