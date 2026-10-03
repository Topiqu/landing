<template>
  <div class="knowledge">
    <div class="knowledge-head">
      <div>
        <p class="knowledge-title">{{ $t('landing.design.showcase.mock.knowledge.title') }}</p>
        <p class="knowledge-subtitle">{{ $t('landing.design.showcase.mock.knowledge.subtitle') }}</p>
      </div>
      <span class="mock-btn" data-ink
        ><Icon name="mdi:plus" />{{ $t('landing.design.showcase.mock.knowledge.add') }}</span
      >
    </div>
    <ul class="knowledge-list">
      <li
        v-for="(source, index) in sources"
        :key="source.name"
        class="mock-rise"
        :style="{ '--i': index }"
        :data-used="used.has(index) || undefined"
      >
        <span class="knowledge-icon"><Icon :name="icons[index]!" /></span>
        <span class="knowledge-name">
          <strong>{{ source.name }}</strong>
          <small>{{ source.meta }}</small>
        </span>
        <span v-if="used.has(index)" class="mock-pill knowledge-used" :style="{ '--i': index }">
          <Icon name="mdi:check" />{{ $t('landing.design.showcase.mock.knowledge.used') }}
        </span>
        <blockquote v-if="index === 0" class="knowledge-excerpt">
          <p class="mock-serif">
            <mark>{{ $t('landing.design.showcase.mock.knowledge.excerpt') }}</mark>
          </p>
          <cite>{{ $t('landing.design.showcase.mock.knowledge.excerptSource') }}</cite>
        </blockquote>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const sources = useMessageList<'name' | 'meta'>('landing.design.showcase.mock.knowledge.sources')
const icons = ['mdi:file-pdf-box', 'mdi:web', 'mdi:folder-outline', 'mdi:text-box-outline']
const used = new Set([0, 2, 3])
</script>

<style scoped>
.knowledge {
  padding: 26px 28px;
}
.knowledge-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}
.knowledge-title {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}
.knowledge-subtitle {
  color: var(--landing-muted);
  font-size: 12px;
}
.knowledge-list {
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  list-style: none;
}
.knowledge-list li {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-top: 1px solid var(--landing-line);
}
.knowledge-list li:first-child {
  border-top: 0;
}
.knowledge-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 17px;
}
li[data-used] .knowledge-icon {
  background: var(--landing-tint);
  color: var(--landing-accent);
}
.knowledge-name {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.knowledge-name strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.knowledge-name small {
  color: var(--landing-muted);
  font-size: 11px;
}
.knowledge-used {
  animation: knowledge-pop 0.35s cubic-bezier(0.3, 1.4, 0.5, 1) both;
  animation-delay: calc(500ms + var(--i) * 140ms);
}
.knowledge-excerpt {
  flex-basis: 100%;
  margin: 2px 0 0 44px;
  padding: 10px 12px;
  border-left: 2px solid var(--landing-accent);
  border-radius: 0 8px 8px 0;
  background: var(--landing-bg);
}
.knowledge-excerpt p {
  font-size: 13px;
  line-height: 1.6;
}
.knowledge-excerpt mark {
  background: linear-gradient(color-mix(in srgb, var(--landing-accent) 18%, transparent) 0 0) no-repeat 0 / 0% 100%;
  color: inherit;
  animation: knowledge-highlight 0.9s 0.9s ease-out forwards;
}
.knowledge-excerpt cite {
  display: block;
  margin-top: 4px;
  color: var(--landing-muted);
  font-size: 11px;
  font-style: normal;
}
@keyframes knowledge-pop {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes knowledge-highlight {
  to {
    background-size: 100% 100%;
  }
}
@container (max-width: 460px) {
  .knowledge {
    padding: 20px 18px;
  }
  .knowledge-head .mock-btn {
    display: none;
  }
  .knowledge-excerpt {
    margin-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .knowledge-used,
  .knowledge-excerpt mark {
    animation: none;
  }
  .knowledge-excerpt mark {
    background-size: 100% 100%;
  }
}
</style>
