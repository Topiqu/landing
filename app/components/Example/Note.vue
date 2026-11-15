<template>
  <article class="example-note" :class="[`is-${note.kind}`, { 'is-active': active, 'is-brief': brief }]">
    <header v-if="!brief" class="example-note-head">
      <img src="/brand/topiqu-mark.webp" alt="" width="28" height="28" class="example-note-avatar" />
      <span class="example-note-author">Topiqu</span>
      <span class="example-note-number" aria-hidden="true">{{ number }}</span>
    </header>
    <p class="example-note-kind">
      <span v-if="brief" class="example-note-number" aria-hidden="true">{{ number }}</span>
      <Icon v-else :name="KIND_ICONS[note.kind]" aria-hidden="true" />{{ $t(`landing.examples.kinds.${note.kind}`) }}
    </p>
    <p class="example-note-text">{{ note.text }}</p>
    <template v-if="!brief">
      <p v-if="note.calc" class="example-note-calc">{{ note.calc }}</p>
      <blockquote v-if="note.excerpt" class="example-note-excerpt">
        <p>{{ note.excerpt }}</p>
        <p v-if="note.original" class="example-note-original" lang="cs">
          <span>{{ $t('landing.examples.czechOriginal') }}:</span> {{ note.original }}
        </p>
      </blockquote>
      <a v-if="file" :href="file.href" target="_blank" rel="noopener" class="example-note-source">
        <Icon name="mdi:file-document-outline" aria-hidden="true" />{{ file.label }}
      </a>
      <a v-if="note.url" :href="note.url" target="_blank" rel="noopener" class="example-note-source">
        <Icon name="mdi:open-in-new" aria-hidden="true" />{{ host }}
      </a>
    </template>
  </article>
</template>

<script setup lang="ts">
import type { Example, ExampleNote, NoteKind } from '~~/shared/examples'

const props = defineProps<{
  note: ExampleNote
  number: number
  example: Example
  active?: boolean
  /** Only the kind and the claim, for the homepage; the evidence stays on the article page. */
  brief?: boolean
}>()

const KIND_ICONS: Record<NoteKind, string> = {
  source: 'mdi:domain',
  computed: 'mdi:calculator-variant-outline',
  research: 'mdi:magnify',
  restraint: 'mdi:shield-check-outline',
  voice: 'mdi:account-voice',
  corrected: 'mdi:pencil-outline',
}

const { locale } = useI18n()
const host = computed(() => (props.note.url ? new URL(props.note.url).hostname.replace(/^www\./, '') : ''))
const file = computed(() => {
  const name = props.note.file
  const entry = name && props.example.files.find((item) => item.name === name)
  if (!name || !entry) return null
  const english = locale.value === 'en'
  return {
    href: `/examples/${props.example.id}/${english ? 'en/' : ''}${name}`,
    label: english ? entry.en : entry.cs,
  }
})
</script>

<style scoped>
.example-note {
  padding: 14px 16px 15px;
  border: 1px solid var(--landing-line);
  border-radius: 12px;
  background: var(--landing-surface);
  box-shadow: 0 1px 2px color-mix(in srgb, var(--landing-ink) 6%, transparent);
  font-size: 13.5px;
  line-height: 1.6;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
}
.example-note.is-active {
  border-color: color-mix(in srgb, var(--landing-accent) 40%, var(--landing-line));
  box-shadow: 0 16px 34px -20px color-mix(in srgb, var(--landing-accent) 55%, transparent);
}
.example-note-head {
  display: flex;
  align-items: center;
  gap: 9px;
}
.example-note-avatar {
  width: 28px;
  height: 28px;
  padding: 4px;
  border-radius: 999px;
  background: #fff;
  box-shadow: 0 0 0 1px var(--landing-line);
  object-fit: contain;
}
.example-note-author {
  font-size: 13.5px;
  font-weight: 700;
}
.example-note-number {
  display: inline-grid;
  place-items: center;
  min-width: 22px;
  height: 22px;
  margin-left: auto;
  border-radius: 999px;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 750;
}
.example-note-kind {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px !important;
  color: var(--landing-accent);
  font-size: 11px;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.example-note-kind .iconify {
  font-size: 14px;
}
.is-corrected .example-note-kind {
  color: var(--landing-warn);
}
.example-note-text {
  margin-top: 4px !important;
  color: var(--landing-ink);
}
.example-note.is-brief {
  padding: 0 0 0 12px;
  border: 0;
  border-radius: 0;
  background: none;
  box-shadow: none;
  font-size: 14.5px;
}
.is-brief .example-note-kind {
  gap: 10px;
  margin-top: 0 !important;
}
.is-brief .example-note-number {
  margin-left: 0;
  transition:
    background 0.2s,
    color 0.2s;
}
.is-brief.is-active .example-note-number {
  background: var(--landing-accent);
  color: #fff;
}
.is-brief .example-note-text {
  margin-top: 6px !important;
  color: var(--landing-muted);
  transition: color 0.2s;
}
.is-brief.is-active .example-note-text {
  color: var(--landing-ink);
}
.example-note-calc {
  margin-top: 10px !important;
  padding: 8px 12px;
  border: 1px solid var(--landing-line);
  border-radius: 8px;
  background: var(--landing-bg);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1.7;
  white-space: pre-line;
}
.example-note-excerpt {
  margin: 10px 0 0;
  padding: 8px 10px;
  border-left: 2px solid var(--landing-line);
  border-radius: 0 8px 8px 0;
  background: var(--landing-bg);
  color: var(--landing-muted);
  font-size: 12.5px;
  white-space: pre-line;
}
.example-note-original {
  margin-top: 6px !important;
  font-style: italic;
}
.example-note-original span {
  font-style: normal;
  font-weight: 650;
}
.example-note-source {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 10px;
  margin-right: 12px;
  color: var(--landing-accent);
  font-size: 12.5px;
  font-weight: 650;
  text-decoration: none;
}
.example-note-source:hover {
  text-decoration: underline;
}
.example-note-source:focus-visible {
  outline: 2px solid var(--landing-accent);
  outline-offset: 2px;
  border-radius: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .example-note,
  .is-brief .example-note-number,
  .is-brief .example-note-text {
    transition: none;
  }
}
</style>
