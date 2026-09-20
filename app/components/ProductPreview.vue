<script setup lang="ts">
const { t } = useI18n()
const tab = ref('write')
const items = computed(() =>
  ['research', 'write', 'publish'].map((value) => ({
    label: t('landing.design.preview.' + value),
    value,
    slot: value,
  })),
)
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
        <template #write>
          <div class="editor-toolbar" aria-hidden="true">
            <span>H₁</span><span><b>B</b></span
            ><span><i>I</i></span
            ><Icon name="mdi:link-variant" /><span class="toolbar-separator" /><Icon
              name="mdi:format-list-bulleted"
            /><Icon name="mdi:image-outline" /><span class="draft-label">{{ $t('landing.design.preview.saved') }}</span>
          </div>
          <div class="editor-paper">
            <p class="editor-category">{{ $t('landing.design.preview.category') }}</p>
            <h2>{{ $t('landing.design.preview.title') }}</h2>
            <p>{{ $t('landing.design.preview.excerpt') }}</p>
            <h3>{{ $t('landing.design.preview.section') }}</h3>
            <p>{{ $t('landing.design.preview.paragraph') }}</p>
          </div>
        </template>
        <template #research>
          <div class="editor-paper research-paper">
            <p class="editor-category">{{ $t('landing.design.preview.sources') }}</p>
            <h2>{{ $t('landing.design.preview.researchTitle') }}</h2>
            <p>{{ $t('landing.design.preview.researchText') }}</p>
            <ul class="source-list">
              <li v-for="n in 3" :key="n">
                <Icon name="mdi:file-document-outline" /><span>{{ $t('landing.design.preview.source' + n) }}</span>
              </li>
            </ul>
          </div>
        </template>
        <template #publish>
          <div class="editor-paper research-paper">
            <p class="editor-category">{{ $t('landing.design.preview.review') }}</p>
            <h2>{{ $t('landing.design.preview.publishTitle') }}</h2>
            <p>{{ $t('landing.design.preview.publishText') }}</p>
            <dl class="publish-list">
              <div v-for="key in ['language', 'channel', 'date']" :key="key">
                <dt>{{ $t('landing.design.preview.' + key) }}</dt>
                <dd>{{ $t('landing.design.preview.' + key + 'Value') }}</dd>
              </div>
            </dl>
          </div>
        </template>
      </UTabs>
      <div class="preview-footer"><Icon name="mdi:check-circle-outline" />{{ $t('landing.design.preview.flow') }}</div>
    </div>
    <figcaption>{{ $t('landing.design.preview.caption') }}</figcaption>
  </figure>
</template>
