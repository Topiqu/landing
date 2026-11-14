<template>
  <div class="lead-form">
    <form class="lead-signup" @submit.prevent="submit">
      <label :for="`${id}-email`" class="lead-email-label">{{ $t('landing.onboarding.account.email') }}</label>
      <input
        :id="`${id}-email`"
        v-model.trim="email"
        name="email"
        type="email"
        autocomplete="email"
        autocapitalize="off"
        :spellcheck="false"
        required
        maxlength="254"
        :placeholder="$t('landing.design.lead.placeholder')"
        :aria-describedby="`${id}-note`"
      />
      <input
        v-model="honeypot"
        class="onb-honeypot"
        type="text"
        name="website"
        tabindex="-1"
        autocomplete="off"
        aria-hidden="true"
      />
      <UButton type="submit" size="xl" trailingIcon="mdi:arrow-right">{{ $t('landing.design.lead.cta') }}</UButton>
    </form>
    <p :id="`${id}-note`" class="lead-note">
      {{ $t('landing.design.lead.note', trial) }}
      <span class="lead-hint" aria-live="polite">
        <template v-if="domain"
          ><Icon name="mdi:auto-fix" aria-hidden="true" />{{ $t('landing.design.lead.reads', { domain }) }}</template
        >
      </span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { companyDomain, type LeadSource } from '~~/shared/utils/leads'

const { id, source } = defineProps<{ id: string; source: LeadSource }>()

const { locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const nuxtApp = useNuxtApp()
const trial = { days: TRIAL_DAYS, articles: TRIAL_ARTICLES }
const email = shallowRef('')
const honeypot = shallowRef('')
// Settles before announcing, so the live region does not read every keystroke.
const domain = refDebounced(
  computed(() => companyDomain(email.value)),
  400,
)

const submit = async () => {
  const address = email.value.trim()
  const website = companyDomain(address)
  // Never awaited: the CRM must not hold up the onboarding.
  $fetch('/api/leads', {
    method: 'POST',
    body: {
      email: address,
      source,
      locale: locale.value,
      path: route.path,
      attribution: readAttribution(),
      website: honeypot.value,
    },
  }).catch(() => {})

  // Password analysis and signup state are not needed to render the public homepage.
  const { useOnboardingStore } = await import('~/stores/onboarding')
  return nuxtApp.runWithContext(() => {
    const store = useOnboardingStore()
    store.form.email = address
    if (website && !store.form.websiteUrl.trim()) store.form.websiteUrl = `https://${website}`
    return navigateTo(localePath({ name: 'onboarding-site' }))
  })
}
</script>
