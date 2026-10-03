<template>
  <div class="decide">
    <div class="decide-draft mock-rise">
      <div class="decide-draft-copy">
        <span class="mock-pill" data-tone="warn"
          ><Icon name="mdi:clock-outline" />{{ $t('landing.design.showcase.mock.decide.pending') }}</span
        >
        <p class="decide-draft-title mock-serif">{{ $t('landing.design.showcase.mock.article') }}</p>
        <p class="decide-draft-meta">{{ $t('landing.design.showcase.mock.decide.meta') }}</p>
      </div>
      <div class="decide-actions">
        <span class="mock-btn">{{ $t('landing.design.showcase.mock.decide.edit') }}</span>
        <span class="mock-btn decide-approve" data-ink
          ><Icon name="mdi:check" />{{ $t('landing.design.showcase.mock.decide.approve') }}</span
        >
      </div>
    </div>
    <p class="decide-heading mock-rise" :style="{ '--i': 1 }">
      {{ $t('landing.design.showcase.mock.decide.schedule') }}
    </p>
    <div class="decide-card mock-rise" :style="{ '--i': 2 }">
      <div class="decide-row">
        <Icon name="mdi:file-document-edit-outline" />
        <div>
          <strong>{{ $t('landing.design.showcase.mock.decide.auto') }}</strong>
          <span>{{ $t('landing.design.showcase.mock.decide.autoText') }}</span>
        </div>
        <span class="mock-toggle decide-toggle" />
      </div>
      <div class="decide-settings">
        <p class="decide-label">{{ $t('landing.design.showcase.mock.decide.frequency') }}</p>
        <div class="decide-segments">
          <span v-for="(option, index) in options" :key="option" :data-active="index === 1 || undefined">{{
            option
          }}</span>
        </div>
        <div class="decide-next">
          <p class="decide-label">{{ $t('landing.design.showcase.mock.decide.next') }}</p>
          <ol>
            <li v-for="date in dates" :key="date.day">
              <strong>{{ date.day }}</strong>
              <span>{{ date.time }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const options = useMessageStrings('landing.design.showcase.mock.decide.options')
const dates = useMessageList<'day' | 'time'>('landing.design.showcase.mock.decide.dates')
</script>

<style scoped>
.decide {
  padding: 22px 26px;
}
.decide-draft {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
}
.decide-draft-copy {
  flex: 1;
  min-width: 0;
}
.decide-draft-title {
  overflow: hidden;
  margin-top: 8px !important;
  font-size: 16px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.decide-draft-meta {
  color: var(--landing-muted);
  font-size: 11px;
}
.decide-actions {
  display: flex;
  flex: none;
  gap: 8px;
}
.decide-approve {
  animation: decide-press 0.4s 1.9s ease-in-out;
}
.decide-heading {
  margin: 20px 0 8px !important;
  font-size: 13px;
  font-weight: 700;
}
.decide-card {
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
}
.decide-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 13px 16px;
  border-bottom: 1px solid var(--landing-line);
}
.decide-row > .iconify {
  flex: none;
  color: var(--landing-muted);
  font-size: 18px;
}
.decide-row > div {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  font-size: 12px;
}
.decide-row span {
  color: var(--landing-muted);
  font-size: 11px;
}
.decide-toggle {
  animation: decide-toggle 0.01s 1.1s forwards;
}
.decide-toggle::after {
  animation: decide-knob 0.3s 1.1s ease-out forwards;
}
.decide-settings {
  padding: 13px 16px 16px;
}
.decide-label {
  margin-bottom: 6px !important;
  font-size: 11px;
  font-weight: 600;
}
.decide-segments {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  padding: 3px;
  border-radius: 9px;
  background: var(--landing-bg);
  font-size: 11px;
  text-align: center;
}
.decide-segments span {
  padding: 5px 4px;
  border-radius: 7px;
  color: var(--landing-muted);
}
.decide-segments [data-active] {
  background: var(--landing-surface);
  box-shadow: 0 1px 2px #0f172a1f;
  color: var(--landing-ink);
  font-weight: 650;
}
.decide-next {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 9px;
  background: var(--landing-bg);
}
.decide-next ol {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
}
.decide-next li {
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  border-left: 1px solid var(--landing-line);
  font-size: 11px;
  white-space: nowrap;
}
.decide-next li:first-child {
  padding-left: 0;
  border-left: 0;
}
.decide-next li span {
  color: var(--landing-muted);
}
@keyframes decide-toggle {
  to {
    background: var(--landing-ink);
  }
}
@keyframes decide-knob {
  to {
    transform: translateX(14px);
  }
}
@keyframes decide-press {
  50% {
    transform: scale(0.94);
  }
}
@container (max-width: 680px) {
  .decide-actions .mock-btn:first-child {
    display: none;
  }
}
@container (max-width: 460px) {
  .decide {
    padding: 18px;
  }
  .decide-draft {
    flex-direction: column;
    align-items: stretch;
  }
  .decide-next ol {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 0;
  }
  .decide-next li:nth-child(3) {
    padding-left: 0;
    border-left: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .decide-approve,
  .decide-toggle,
  .decide-toggle::after {
    animation: none;
  }
  .decide-toggle {
    background: var(--landing-ink);
  }
  .decide-toggle::after {
    transform: translateX(14px);
  }
}
</style>
