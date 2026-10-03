<template>
  <div class="verify">
    <div class="verify-editor">
      <div class="verify-toolbar">
        <span>H₂</span><b>B</b><i>I</i><Icon name="mdi:link-variant" />
        <span class="verify-separator" />
        <span v-for="(language, index) in languages" :key="language" :data-active="index === 0 || undefined">{{
          language
        }}</span>
        <span class="verify-draft">{{ $t('landing.design.showcase.mock.verify.draft') }}</span>
      </div>
      <div class="verify-paper">
        <p class="verify-category">{{ $t('landing.design.showcase.mock.verify.category') }}</p>
        <p class="verify-title mock-serif">{{ $t('landing.design.showcase.mock.article') }}</p>
        <p class="verify-text mock-serif">
          {{ $t('landing.design.showcase.mock.verify.lead')
          }}<del>{{ $t('landing.design.showcase.mock.verify.removed') }}</del
          >{{ ' ' }}<ins>{{ $t('landing.design.showcase.mock.verify.inserted') }}</ins>
        </p>
        <p class="verify-section mock-serif">{{ $t('landing.design.showcase.mock.verify.section') }}</p>
        <p class="verify-text mock-serif">
          <span class="verify-claim">{{ $t('landing.design.showcase.mock.verify.claim') }}</span
          >{{ $t('landing.design.showcase.mock.verify.tail') }}
        </p>
        <span class="mock-pill verify-source" data-tone="ok">
          <Icon name="mdi:check-decagram-outline" />{{ $t('landing.design.showcase.mock.verify.verified') }}
        </span>
      </div>
    </div>
    <div class="verify-review">
      <div class="verify-review-head">
        <Icon name="mdi:shield-check-outline" />
        <strong>{{ $t('landing.design.showcase.mock.verify.review') }}</strong>
      </div>
      <p class="verify-result">{{ $t('landing.design.showcase.mock.verify.result') }}</p>
      <ul>
        <li
          v-for="(issue, index) in issues"
          :key="issue.label"
          class="mock-rise"
          :style="{ '--i': index, '--delay': '900ms' }"
        >
          <span>{{ issue.label }}</span>
          <span class="mock-pill" :data-tone="issue.tone">
            <Icon :name="issue.tone === 'ok' ? 'mdi:check' : 'mdi:eye-outline'" />{{ issue.status }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const issues = useMessageList<'label' | 'status' | 'tone'>('landing.design.showcase.mock.verify.issues')
const languages = ['CS', 'EN', 'DE', 'FR']
</script>

<style scoped>
.verify {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 236px;
  height: 100%;
}
.verify-editor {
  min-width: 0;
}
.verify-toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  height: 42px;
  padding-inline: 24px;
  border-bottom: 1px solid var(--landing-line);
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 12px;
  white-space: nowrap;
}
.verify-toolbar [data-active] {
  color: var(--landing-accent);
  font-weight: 750;
}
.verify-separator {
  width: 1px;
  height: 15px;
  background: var(--landing-line);
}
.verify-draft {
  margin-left: auto;
  font-size: 11px;
}
.verify-paper {
  padding: 26px 30px;
}
.verify-category {
  margin-bottom: 10px !important;
  color: var(--landing-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.verify-title {
  margin-bottom: 14px !important;
  font-size: 23px;
  font-weight: 550;
  line-height: 1.2;
  text-wrap: balance;
}
.verify-text {
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
.verify-text del {
  color: var(--landing-warn);
  text-decoration: none;
  background: linear-gradient(currentColor 0 0) no-repeat 0 55% / 0% 1.5px;
  animation: verify-strike 0.5s 0.5s ease-out forwards;
}
.verify-text ins {
  border-radius: 3px;
  background: var(--landing-success-tint);
  color: var(--landing-ink);
  text-decoration: none;
  animation: verify-insert 0.5s 1.05s ease-out both;
}
.verify-section {
  margin: 18px 0 6px !important;
  font-size: 16px;
  font-weight: 600;
}
.verify-claim {
  color: var(--landing-ink);
  text-decoration: underline 1.5px var(--landing-success);
  text-underline-offset: 4px;
}
.verify-source {
  margin-top: 12px;
}
.verify-review {
  padding: 18px 16px;
  border-left: 1px solid var(--landing-line);
  background: var(--landing-bg);
}
.verify-review-head {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.verify-review-head .iconify {
  color: var(--landing-accent);
  font-size: 18px;
}
.verify-result {
  margin: 6px 0 14px !important;
  color: var(--landing-muted);
  font-size: 11px;
}
.verify-review ul {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.verify-review li {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;
  padding: 10px 12px;
  border: 1px solid var(--landing-line);
  border-radius: 10px;
  background: var(--landing-surface);
  font-size: 12px;
  font-weight: 650;
}
@keyframes verify-strike {
  to {
    background-size: 100% 1.5px;
  }
}
@keyframes verify-insert {
  from {
    opacity: 0;
  }
}
@container (max-width: 680px) {
  .verify {
    grid-template-columns: minmax(0, 1fr);
  }
  .verify-review {
    display: none;
  }
}
@container (max-width: 460px) {
  .verify-toolbar {
    padding-inline: 18px;
  }
  .verify-paper {
    padding: 22px 18px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .verify-text del,
  .verify-text ins {
    animation: none;
  }
  .verify-text del {
    background-size: 100% 1.5px;
  }
}
</style>
