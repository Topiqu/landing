<script setup lang="ts">
definePageMeta({ layout: 'onboarding' })

const route = useRoute()
const { form, userEditedDomain, domainStatus, fullDomainPreview, canAdvanceSite, setDomainType, complete } =
  useOnboarding()

// Pricing CTAs pass ?plan= so the plan step opens on the plan the visitor chose.
const requestedPlan = String(route.query.plan ?? '').toUpperCase()
if (requestedPlan === 'PRO' || requestedPlan === 'PREMIUM') form.selectedPlan = requestedPlan
const requestedInterval = String(route.query.interval ?? '')
if (requestedInterval === 'month' || requestedInterval === 'year') form.billingInterval = requestedInterval

const languageOptions = computed(() =>
  CONTENT_LANGUAGES.map((value) => ({ value, label: $t('languages.' + value), code: value.toUpperCase() })),
)

const domainOptions = computed(() => [
  {
    value: 'SUBDOMAIN' as const,
    icon: 'mdi:link-variant',
    title: $t('landing.onboarding.site.subdomainTitle'),
    text: $t('landing.onboarding.site.subdomainText'),
  },
  {
    value: 'CUSTOM' as const,
    icon: 'mdi:web',
    title: $t('landing.onboarding.site.customTitle'),
    text: $t('landing.onboarding.site.customText'),
  },
])

const status = computed(() => {
  const value = domainStatus.value
  if (!form.domain || value === 'idle' || value === 'empty') return null
  if (value === 'checking')
    return { tone: 'muted', icon: 'mdi:loading', text: $t('landing.onboarding.domainStatus.checking') }
  if (value === 'available')
    return { tone: 'available', icon: 'mdi:check-circle', text: $t('landing.onboarding.domainStatus.available') }
  const key = value === 'invalid' && form.domainType === 'CUSTOM' ? 'invalidCustom' : value
  return { tone: 'error', icon: 'mdi:alert-circle', text: $t('landing.onboarding.domainStatus.' + key) }
})

const handleSubmit = () => {
  if (canAdvanceSite.value) complete('site')
}
</script>
<template>
  <form class="onb-form" novalidate @submit.prevent="handleSubmit">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.site.title') }}</h1>
      <p>{{ $t('landing.onboarding.site.description') }}</p>
    </div>

    <UFormField :label="$t('landing.onboarding.site.name')" required>
      <UInput
        v-model="form.siteName"
        size="lg"
        class="tw:w-full"
        autofocus
        maxlength="80"
        :placeholder="$t('landing.onboarding.site.namePlaceholder')"
      />
    </UFormField>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">{{ $t('landing.onboarding.site.domainType') }}</legend>
      <div class="onb-choice-grid">
        <label v-for="option in domainOptions" :key="option.value" class="onb-choice">
          <input
            type="radio"
            name="domain-type"
            :value="option.value"
            :checked="form.domainType === option.value"
            @change="setDomainType(option.value)"
          />
          <Icon :name="option.icon" aria-hidden="true" />
          <span class="onb-choice-text">
            <strong>{{ option.title }}</strong>
            <small>{{ option.text }}</small>
          </span>
          <Icon name="mdi:check-circle" class="onb-choice-check" aria-hidden="true" />
        </label>
      </div>
    </fieldset>

    <UFormField
      :label="
        form.domainType === 'SUBDOMAIN'
          ? $t('landing.onboarding.site.subdomain')
          : $t('landing.onboarding.site.customDomain')
      "
      required
    >
      <UFieldGroup v-if="form.domainType === 'SUBDOMAIN'" class="tw:w-full">
        <UInput
          v-model="form.domain"
          size="lg"
          class="tw:min-w-0 tw:flex-1"
          autocapitalize="off"
          spellcheck="false"
          :placeholder="$t('landing.onboarding.site.subdomainPlaceholder')"
          @update:modelValue="userEditedDomain = true"
        />
        <UBadge color="neutral" variant="outline" size="lg" class="tw:font-mono">.topiqu.com</UBadge>
      </UFieldGroup>
      <UInput
        v-else
        v-model="form.domain"
        size="lg"
        class="tw:w-full"
        icon="mdi:web"
        inputmode="url"
        autocapitalize="off"
        spellcheck="false"
        :placeholder="$t('landing.onboarding.site.customDomainPlaceholder')"
      />
      <template #help>
        <span v-if="status" class="onb-domain-status" :data-status="status.tone" role="status" aria-live="polite">
          <Icon :name="status.icon" :class="{ 'tw:animate-spin': status.tone === 'muted' }" aria-hidden="true" />
          <span
            >{{ status.text }}<template v-if="status.tone === 'available'"> · {{ fullDomainPreview }}</template></span
          >
        </span>
      </template>
    </UFormField>

    <div v-if="form.domainType === 'CUSTOM'" class="onb-note">
      <Icon name="mdi:dns-outline" aria-hidden="true" />
      <span
        ><strong>{{ $t('landing.onboarding.site.dnsTitle') }}</strong
        >{{ $t('landing.onboarding.site.dnsText') }}</span
      >
    </div>

    <fieldset class="onb-fieldset">
      <legend class="onb-legend">{{ $t('landing.onboarding.site.language') }}</legend>
      <div class="site-languages">
        <label v-for="option in languageOptions" :key="option.value" class="onb-choice">
          <input v-model="form.language" type="radio" name="language" :value="option.value" />
          <span class="site-language-code" aria-hidden="true">{{ option.code }}</span>
          <span class="onb-choice-text">
            <strong>{{ option.label }}</strong>
          </span>
        </label>
      </div>
      <p class="onb-help">{{ $t('landing.onboarding.site.languageHelp') }}</p>
    </fieldset>

    <OnboardingActions :disabled="!canAdvanceSite" />
  </form>
</template>
<style scoped>
.site-languages {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}
.site-languages .onb-choice {
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}
.site-language-code {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 22px;
  border: 1px solid var(--landing-line);
  border-radius: 6px;
  background: var(--landing-bg);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.04em;
}
.onb-choice:has(input:checked) .site-language-code {
  border-color: var(--landing-accent);
  color: var(--landing-accent);
}
@media (max-width: 640px) {
  .site-languages {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
