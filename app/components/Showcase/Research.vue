<template>
  <div class="research">
    <div class="research-draft" aria-hidden="true">
      <p class="research-category">{{ $t('landing.design.showcase.mock.verify.category') }}</p>
      <p class="research-title mock-serif">{{ $t('landing.design.showcase.mock.article') }}</p>
      <span v-for="(width, index) in lines" :key="index" class="research-line" :style="{ width: `${width}%` }" />
    </div>
    <div class="research-run">
      <div class="research-run-head">
        <span class="research-run-icon"><Icon name="mdi:progress-clock" /></span>
        <div>
          <strong>{{ $t('landing.design.showcase.mock.research.run') }}</strong>
          <small>
            {{ $t('landing.design.showcase.mock.research.steps.research') }} ·
            {{ $t('landing.design.showcase.mock.research.elapsed') }}
          </small>
        </div>
      </div>
      <ol class="research-steps">
        <li data-state="done">
          <Icon name="mdi:check-circle" />
          <div>
            <strong>{{ $t('landing.design.showcase.mock.research.steps.knowledge') }}</strong>
            <small>{{ $t('landing.design.showcase.mock.research.knowledgeDetail') }}</small>
          </div>
        </li>
        <li data-state="running">
          <Icon name="mdi:loading" class="research-spin" />
          <div>
            <strong>{{ $t('landing.design.showcase.mock.research.steps.research') }}</strong>
            <small>{{ $t('landing.design.showcase.mock.research.researchDetail') }}</small>
            <ul class="research-sources">
              <li
                v-for="(source, index) in sources"
                :key="source.domain"
                class="mock-rise"
                :style="{ '--i': index, '--delay': '350ms' }"
              >
                <span class="research-favicon">{{ source.domain.charAt(0) }}</span>
                <span class="research-source">
                  <b>{{ source.title }}</b>
                  <span>{{ source.domain }}</span>
                </span>
              </li>
            </ul>
            <small class="research-found mock-rise" :style="{ '--delay': '700ms' }">{{
              $t('landing.design.showcase.mock.research.found')
            }}</small>
          </div>
        </li>
        <li v-for="step in pending" :key="step" data-state="pending">
          <Icon name="mdi:circle-outline" />
          <div>
            <strong>{{ $t(`landing.design.showcase.mock.research.steps.${step}`) }}</strong>
          </div>
          <span class="research-state">{{ $t('landing.design.showcase.mock.research.state.pending') }}</span>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup lang="ts">
const sources = useMessageList<'domain' | 'title'>('landing.design.showcase.mock.research.sources')
const pending = ['writing', 'review', 'media'] as const
const lines = [100, 94, 97, 62, 100, 88, 71]
</script>

<style scoped>
.research {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 286px;
  height: 100%;
}
.research-draft {
  padding: 30px 28px;
}
.research-category {
  margin-bottom: 10px !important;
  color: var(--landing-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.research-title {
  margin-bottom: 22px !important;
  font-size: 24px;
  font-weight: 550;
  line-height: 1.2;
  text-wrap: balance;
}
.research-line {
  display: block;
  height: 9px;
  margin-bottom: 12px;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--landing-line) 0 40%, var(--landing-bg) 50%, var(--landing-line) 60% 100%) 0
    0 / 300% 100%;
  animation: research-shimmer 2.4s linear infinite;
}
.research-line:nth-of-type(4n) {
  margin-bottom: 26px;
}
.research-run {
  padding: 18px;
  border-left: 1px solid var(--landing-line);
  background: var(--landing-bg);
}
.research-run-head {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;
}
.research-run-head div {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.research-run-head strong {
  font-size: 13px;
}
.research-run-head small {
  color: var(--landing-muted);
  font-size: 11px;
}
.research-run-icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 18px;
}
.research-steps {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.research-steps > li {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  padding: 8px 10px;
  border-radius: 10px;
}
.research-steps > li > .iconify {
  flex: none;
  margin-top: 1px;
  font-size: 16px;
}
.research-steps > li > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}
.research-steps strong {
  font-size: 12px;
  font-weight: 650;
}
.research-steps small {
  color: var(--landing-muted);
  font-size: 11px;
  line-height: 1.45;
}
[data-state='done'] > .iconify {
  color: var(--landing-success);
}
[data-state='running'] {
  border: 1px solid var(--landing-line);
  background: var(--landing-surface);
}
[data-state='running'] > .iconify {
  color: var(--landing-accent);
}
[data-state='pending'] {
  color: var(--landing-muted);
}
[data-state='pending'] strong {
  font-weight: 600;
}
.research-state {
  font-size: 10px;
}
.research-spin {
  animation: research-spin 0.9s linear infinite;
}
.research-sources {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 10px 0 8px;
  padding: 0;
  list-style: none;
}
.research-sources li {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}
.research-favicon {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 5px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}
.research-source {
  display: flex;
  flex-direction: column;
  min-width: 0;
  font-size: 11px;
  line-height: 1.3;
}
.research-source b,
.research-source span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.research-source b {
  font-weight: 600;
}
.research-source span {
  color: var(--landing-muted);
  font-size: 10px;
}
.research-found {
  color: var(--landing-accent) !important;
  font-weight: 650;
}
@keyframes research-shimmer {
  to {
    background-position: -150% 0;
  }
}
@keyframes research-spin {
  to {
    transform: rotate(1turn);
  }
}
@container (max-width: 680px) {
  .research {
    grid-template-columns: minmax(0, 1fr);
  }
  .research-draft {
    display: none;
  }
  .research-run {
    border-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .research-line,
  .research-spin {
    animation: none;
  }
}
</style>
