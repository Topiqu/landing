<script setup lang="ts">
const { t, tm, rt } = useI18n()
const tab = shallowRef('knowledge')
const items = computed(() =>
  ['knowledge', 'write', 'check', 'visibility'].map((value) => ({
    label: t('landing.design.preview.tabs.' + value),
    value,
    slot: value,
  })),
)
const sources = computed(() =>
  (tm('landing.design.preview.knowledge.sources') as { name: string; meta: string }[]).map((source) => ({
    name: rt(source.name),
    meta: rt(source.meta),
  })),
)
const claims = computed(() =>
  (tm('landing.design.preview.check.claims') as { text: string; status: string; tone: string }[]).map((claim) => ({
    text: rt(claim.text),
    status: rt(claim.status),
    tone: rt(claim.tone),
  })),
)
const visibilityItems = [
  { key: 'questions', icon: 'mdi:comment-question-outline' },
  { key: 'citations', icon: 'mdi:link-variant' },
  { key: 'opportunities', icon: 'mdi:lightbulb-outline' },
] as const
const languages = ['EN', 'CS', 'DE', 'FR']
</script>
<template>
  <figure class="product-preview" :aria-label="$t('landing.design.preview.label')">
    <div class="preview-window">
      <div class="preview-top">
        <img src="/brand/topiqu-mark.png" width="24" height="25" alt="" /><span>{{
          $t('landing.design.preview.workspace')
        }}</span
        ><span class="preview-dots" aria-hidden="true">•••</span>
      </div>
      <UTabs v-model="tab" :items="items" variant="link" :unmountOnHide="false" class="preview-tabs">
        <template #knowledge>
          <div class="editor-paper research-paper">
            <p class="editor-category">{{ $t('landing.design.preview.knowledge.category') }}</p>
            <h2>{{ $t('landing.design.preview.knowledge.title') }}</h2>
            <p>{{ $t('landing.design.preview.knowledge.text') }}</p>
            <ul class="source-list">
              <li v-for="source in sources" :key="source.name">
                <Icon name="mdi:file-document-outline" aria-hidden="true" /><span>{{ source.name }}</span
                ><small>{{ source.meta }}</small>
              </li>
            </ul>
            <p class="preview-status">
              <Icon name="mdi:check-circle-outline" />{{ $t('landing.design.preview.knowledge.used') }}
            </p>
          </div>
        </template>
        <template #write>
          <div class="editor-toolbar" aria-hidden="true">
            <span>H₂</span><span><b>B</b></span
            ><span><i>I</i></span
            ><Icon name="mdi:link-variant" /><span class="toolbar-separator" /><span
              v-for="(language, index) in languages"
              :key="language"
              class="toolbar-language"
              :class="{ active: index === 0 }"
              >{{ language }}</span
            ><span class="draft-label">{{ $t('landing.design.preview.write.saved') }}</span>
          </div>
          <div class="editor-paper">
            <div class="editor-score">
              <span>{{ $t('landing.design.preview.write.score') }}</span
              ><strong>{{ $t('landing.design.preview.write.scoreValue') }}</strong>
            </div>
            <p class="editor-category">{{ $t('landing.design.preview.write.category') }}</p>
            <h2>{{ $t('landing.design.preview.write.title') }}</h2>
            <p>{{ $t('landing.design.preview.write.excerpt') }}</p>
            <h3>{{ $t('landing.design.preview.write.section') }}</h3>
            <p>{{ $t('landing.design.preview.write.paragraph') }}</p>
          </div>
        </template>
        <template #check>
          <div class="editor-paper research-paper">
            <p class="editor-category">{{ $t('landing.design.preview.check.category') }}</p>
            <h2>{{ $t('landing.design.preview.check.title') }}</h2>
            <p>{{ $t('landing.design.preview.check.summary') }}</p>
            <ul class="claim-list">
              <li v-for="claim in claims" :key="claim.text">
                <span>{{ claim.text }}</span
                ><span class="claim-status" :data-tone="claim.tone"
                  ><Icon :name="claim.tone === 'ok' ? 'mdi:check-circle-outline' : 'mdi:alert-outline'" />{{
                    claim.status
                  }}</span
                >
              </li>
            </ul>
          </div>
        </template>
        <template #visibility>
          <div class="editor-paper research-paper">
            <p class="editor-category">{{ $t('landing.design.preview.visibility.category') }}</p>
            <h2>{{ $t('landing.design.preview.visibility.title') }}</h2>
            <p>{{ $t('landing.design.preview.visibility.description') }}</p>
            <div class="visibility-provider">
              <Icon name="mdi:radar" aria-hidden="true" />
              <span>{{ $t('landing.design.preview.visibility.provider') }}</span>
              <strong>OpenAI</strong>
            </div>
            <ul class="visibility-list">
              <li v-for="item in visibilityItems" :key="item.key">
                <Icon :name="item.icon" aria-hidden="true" />
                <div>
                  <strong>{{ $t(`landing.design.preview.visibility.items.${item.key}.title`) }}</strong>
                  <span>{{ $t(`landing.design.preview.visibility.items.${item.key}.text`) }}</span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </UTabs>
      <div class="preview-footer"><Icon name="mdi:check-circle-outline" />{{ $t('landing.design.preview.flow') }}</div>
    </div>
    <figcaption>{{ $t('landing.design.preview.caption') }}</figcaption>
  </figure>
</template>
