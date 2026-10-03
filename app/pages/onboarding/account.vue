<script setup lang="ts">
definePageMeta({ layout: 'onboarding', middleware: ['onboarding-guard'] })

const { form, canAdvanceAccount, complete } = useOnboarding()
const mismatch = computed(
  () =>
    !!form.passwordConfirm &&
    form.password !== form.passwordConfirm &&
    $t('landing.onboarding.account.passwordMismatch'),
)
const handleSubmit = () => {
  if (canAdvanceAccount.value) complete('account')
}
</script>
<template>
  <form class="onb-form" novalidate @submit.prevent="handleSubmit">
    <div class="onb-heading">
      <h1 id="onboarding-title">{{ $t('landing.onboarding.account.title') }}</h1>
      <p>{{ $t('landing.onboarding.account.description') }}</p>
    </div>

    <div class="account-grid">
      <UFormField
        :label="$t('landing.onboarding.account.username')"
        :hint="$t('landing.onboarding.account.usernameHint')"
        required
      >
        <UInput
          v-model="form.username"
          size="lg"
          class="tw:w-full"
          autocomplete="username"
          autocapitalize="off"
          maxlength="50"
          :placeholder="$t('landing.onboarding.account.usernamePlaceholder')"
        />
      </UFormField>
      <UFormField :label="$t('landing.onboarding.account.email')" required>
        <UInput
          v-model="form.email"
          size="lg"
          type="email"
          class="tw:w-full"
          autocomplete="email"
          :placeholder="$t('landing.onboarding.account.emailPlaceholder')"
        />
      </UFormField>
      <UserPassword v-model="form.password" :label="$t('landing.onboarding.account.password')" showStrength />
      <UserPassword
        v-model="form.passwordConfirm"
        :label="$t('landing.onboarding.account.passwordConfirm')"
        :error="mismatch"
      />
    </div>

    <OnboardingActions back="plan" :disabled="!canAdvanceAccount" />
  </form>
</template>
<style scoped>
.account-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 16px;
  align-items: start;
}
@media (max-width: 640px) {
  .account-grid {
    grid-template-columns: 1fr;
  }
}
</style>
