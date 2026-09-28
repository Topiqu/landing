<script setup lang="ts">
import { zxcvbn } from '@zxcvbn-ts/core'

const {
  label,
  showStrength = false,
  error,
} = defineProps<{
  label: string
  showStrength?: boolean
  error?: string | false
}>()

const password = defineModel<string>({ default: '', required: true })
const visible = shallowRef(false)
const MIN_LENGTH = 8

const analysis = computed(() => (showStrength && password.value ? zxcvbn(password.value) : null))
const score = computed(() => analysis.value?.score ?? 0)

// zxcvbn-ts runs without its language packs, so it reports suggestion keys, not sentences.
const SUGGESTION_KEYS: Record<string, string> = {
  anotherWord: 'common.passwordSuggestions.addWords',
  recentYears: 'common.passwordSuggestions.avoidRecentYears',
  associatedYears: 'common.passwordSuggestions.avoidDates',
  fewWords: 'common.passwordSuggestions.avoidCommonPhrases',
  repeated: 'common.passwordSuggestions.avoidRepeated',
  sequences: 'common.passwordSuggestions.avoidSequences',
  dates: 'common.passwordSuggestions.avoidDates',
  useWords: 'common.passwordSuggestions.avoidCommonPhrases',
  noNeed: 'common.passwordSuggestions.addWords',
  capitalization: 'common.passwordSuggestions.addUppercase',
  allUppercase: 'common.passwordSuggestions.addLowercase',
  reverseWords: 'common.passwordSuggestions.avoidCommonWords',
  l33t: 'common.passwordSuggestions.avoidCommonWords',
  pwned: 'common.passwordSuggestions.avoidCommonWords',
}

const hint = computed(() => {
  if (!analysis.value) return undefined
  if (password.value.length < MIN_LENGTH) return $t('common.passwordSuggestions.tooShort', { minLength: MIN_LENGTH })
  if (score.value >= 3) return undefined
  const key = analysis.value.feedback.suggestions.map((s) => SUGGESTION_KEYS[s.trim()]).find(Boolean)
  return key ? $t(key) : $t('common.passwordSuggestions.useLongerPassword')
})

const strength = computed(() => {
  const s = score.value
  if (s <= 1) return { label: $t('common.passwordSuggestions.weak'), tone: 'weak' }
  if (s === 2) return { label: $t('common.passwordSuggestions.medium'), tone: 'medium' }
  if (s === 3) return { label: $t('common.passwordSuggestions.strong'), tone: 'strong' }
  return { label: $t('common.passwordSuggestions.veryStrong'), tone: 'strong' }
})
</script>
<template>
  <UFormField :label="label" :error="error" :hint="showStrength && password ? strength.label : undefined">
    <UInput
      v-model="password"
      :type="visible ? 'text' : 'password'"
      autocomplete="new-password"
      size="lg"
      class="tw:w-full"
      :ui="{ trailing: 'tw:pe-1' }"
    >
      <template #trailing>
        <UButton
          color="neutral"
          variant="link"
          size="sm"
          :icon="visible ? 'mdi:eye-off-outline' : 'mdi:eye-outline'"
          :aria-label="visible ? $t('common.hidePassword') : $t('common.showPassword')"
          :aria-pressed="visible"
          @click="visible = !visible"
        />
      </template>
    </UInput>
    <template v-if="showStrength && password" #help>
      <div class="password-meter" :data-tone="strength.tone" aria-hidden="true">
        <span v-for="n in 4" :key="n" :class="{ filled: n <= Math.max(1, score) }" />
      </div>
      <p v-if="hint" class="password-hint" aria-live="polite">{{ hint }}</p>
    </template>
  </UFormField>
</template>
<style scoped>
.password-meter {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: 2px;
}
.password-meter span {
  height: 4px;
  border-radius: 999px;
  background: var(--landing-line);
}
.password-meter[data-tone='weak'] .filled {
  background: #dc2626;
}
.password-meter[data-tone='medium'] .filled {
  background: #d97706;
}
.password-meter[data-tone='strong'] .filled {
  background: #059669;
}
.password-hint {
  margin: 6px 0 0;
}
</style>
