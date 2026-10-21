<script setup lang="ts">
import { cs, en } from '@nuxt/ui/locale'

import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const { t, locale } = useI18n()
const localePath = useLocalePath()
const status = computed(() => props.error?.statusCode ?? 500)
const title = computed(() => t(`common.errorPage.${status.value === 404 ? 'notFoundTitle' : 'title'}`))
const description = computed(() =>
  t(`common.errorPage.${status.value === 404 ? 'notFoundDescription' : 'description'}`),
)
const home = computed(() => localePath('/'))
const handleClearError = () => clearError({ redirect: home.value })

if (import.meta.server) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, status.value)
}

useSeoMeta({
  title: () => `${status.value} — ${title.value}`,
  robots: 'noindex, nofollow',
})
</script>

<template>
  <UApp :locale="locale === 'cs' ? cs : en">
    <NuxtLayout name="default">
      <section class="error-page" aria-labelledby="error-title">
        <div class="error-content">
          <NuxtImg
            v-if="status === 404"
            src="/topik_404_rm.png"
            width="180"
            height="220"
            fit="inside"
            format="webp"
            alt=""
            class="error-illustration"
          />
          <p class="error-code">{{ status }}</p>
          <h1 id="error-title">{{ title }}</h1>
          <p class="error-description">{{ description }}</p>
          <UButton :to="home" size="lg" icon="mdi:arrow-left" @click.prevent="handleClearError">
            {{ t('common.errorPage.home') }}
          </UButton>
        </div>
      </section>
    </NuxtLayout>
  </UApp>
</template>

<style scoped>
.error-page {
  display: grid;
  place-items: center;
  min-height: calc(100svh - var(--ui-header-height, 72px));
  padding: clamp(48px, 8vw, 96px) 24px;
  text-align: center;
  color: var(--landing-ink);
}
.error-content {
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.error-illustration {
  width: 180px;
  height: 220px;
  object-fit: contain;
  margin-bottom: 24px;
}
.error-code {
  margin: 0 0 12px;
  color: var(--landing-accent);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.error-content h1 {
  margin: 0;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.15;
  letter-spacing: -0.04em;
}
.error-description {
  margin: 20px 0 32px;
  color: var(--landing-muted);
  font-size: 17px;
  line-height: 1.7;
  text-wrap: pretty;
}
</style>
