<template>
  <div class="landing-page agencies-page">
    <section class="agencies-hero" aria-labelledby="agencies-title">
      <div class="landing-container">
        <p class="agencies-kicker">{{ $t('agencies.hero.kicker') }}</p>
        <h1 id="agencies-title">{{ $t('agencies.hero.title') }}</h1>
        <p class="agencies-lead">{{ $t('agencies.hero.description') }}</p>
        <div class="agencies-actions">
          <UButton :to="signUp()" external size="xl" trailingIcon="mdi:arrow-right">
            {{ $t('agencies.hero.cta') }}
          </UButton>
          <a href="#calculator" class="agencies-anchor">
            {{ $t('agencies.hero.secondary') }}
            <UIcon name="mdi:arrow-down" />
          </a>
        </div>
        <AgencyShelf />
      </div>
    </section>

    <section class="landing-section agencies-pool-section" aria-labelledby="agencies-pool-title">
      <div class="landing-container">
        <div class="agencies-heading">
          <h2 id="agencies-pool-title">{{ $t('agencies.pool.title') }}</h2>
          <p>{{ $t('agencies.pool.text') }}</p>
        </div>
        <AgencyCreditPool />
      </div>
    </section>

    <section id="calculator" class="landing-section agencies-price-section" aria-labelledby="agencies-price-title">
      <div class="landing-container">
        <div class="agencies-heading agencies-heading-center">
          <h2 id="agencies-price-title">{{ $t('agencies.calculator.title') }}</h2>
          <p>{{ $t('agencies.calculator.text') }}</p>
        </div>
        <AgencyCalculator />
      </div>
    </section>

    <section class="landing-section agencies-plans-section" aria-labelledby="agencies-plans-title">
      <div class="landing-container">
        <div class="agencies-heading">
          <h2 id="agencies-plans-title">{{ $t('agencies.plans.title') }}</h2>
          <p>{{ $t('agencies.plans.description', { addOn: usd(AGENCY_PRICES_USD.premium) }) }}</p>
        </div>
        <div class="agencies-pair">
          <article v-for="plan in plans" :key="plan.key" class="agencies-plan" :data-plan="plan.key">
            <h3>{{ $t(`agencies.plans.names.${plan.key}`) }}</h3>
            <p class="agencies-plan-price">
              <strong>{{ usd(plan.price) }}</strong> {{ $t('agencies.plans.perBlog') }}
            </p>
            <ul>
              <li v-for="feature in plan.features" :key="feature">
                <UIcon name="mdi:check" />
                {{ feature }}
              </li>
            </ul>
          </article>
        </div>
        <p class="agencies-free">
          <strong>{{ $t('agencies.plans.names.free') }} · {{ usd(0) }}</strong>
          {{ $t('agencies.plans.free') }}
        </p>
      </div>
    </section>

    <section class="landing-section agencies-faq-section" aria-labelledby="agencies-faq-title">
      <div class="landing-container agencies-faq">
        <h2 id="agencies-faq-title">{{ $t('agencies.faq.title') }}</h2>
        <UAccordion
          :items="faq"
          :ui="{ trigger: 'tw:py-6 tw:text-base tw:font-semibold', content: 'tw:text-base tw:leading-7 tw:text-muted' }"
        />
      </div>
    </section>

    <section class="landing-section closing-section" aria-labelledby="agencies-closing-title">
      <div class="landing-container closing-inner">
        <div>
          <p class="agencies-dots" aria-hidden="true">
            <i v-for="sample in samples" :key="sample.domain" :style="{ background: sample.color }" />
          </p>
          <h2 id="agencies-closing-title">{{ $t('agencies.closing.title') }}</h2>
          <p>{{ $t('agencies.closing.text') }}</p>
        </div>
        <UButton :to="signUp()" external size="xl" trailingIcon="mdi:arrow-right">
          {{ $t('agencies.hero.cta') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import {
  AGENCY_LIMITS,
  AGENCY_PRICES_USD,
  agencyPriceUsd,
  formatUsd,
  PREMIUM_VISIBILITY_RESPONSES,
  TRANSLATION_LANGUAGES,
} from '~~/shared/utils/plans'

const { t, tm, rt, locale } = useI18n()
const signUp = useAgencySignUp()
const samples = useAgencySamples()
const usd = (amount: number) => formatUsd(amount, locale.value)
const minimumPrice = agencyPriceUsd({ blogs: AGENCY_LIMITS.minBlogs, premium: 0, packs: AGENCY_LIMITS.minPacks })

const meta = () => ({
  title: t('agencies.meta.title'),
  description: t('agencies.meta.description', { blog: usd(AGENCY_PRICES_USD.blog), price: usd(minimumPrice) }),
})
useSeoMeta({
  title: () => meta().title,
  description: () => meta().description,
  ogTitle: () => meta().title,
  ogDescription: () => meta().description,
  ogType: 'website',
})

// A Premium blog pays its slot plus the add-on.
const plans = computed(() => [
  {
    key: 'pro',
    price: AGENCY_PRICES_USD.blog,
    features: [
      t('agencies.plans.features.articles'),
      t('agencies.plans.features.domain'),
      t('agencies.plans.features.translations', { count: TRANSLATION_LANGUAGES.pro }),
      t('agencies.plans.features.team'),
    ],
  },
  {
    key: 'premium',
    price: AGENCY_PRICES_USD.blog + AGENCY_PRICES_USD.premium,
    features: [
      t('agencies.plans.features.everything'),
      t('agencies.plans.features.gsc'),
      t('agencies.plans.features.visibility', { count: PREMIUM_VISIBILITY_RESPONSES }),
      t('agencies.plans.features.translations', { count: TRANSLATION_LANGUAGES.premium }),
    ],
  },
])

const faq = computed(() =>
  (tm('agencies.faq.items') as { q: string; a: string }[]).map((item) => ({ label: rt(item.q), content: rt(item.a) })),
)
useSchemaOrg([
  defineWebPage({ name: meta().title }),
  ...faq.value.map((item) => defineQuestion({ name: item.label, acceptedAnswer: item.content })),
])
</script>

<style scoped>
.agencies-hero {
  padding-top: clamp(56px, 7vw, 96px);
  overflow: hidden;
  background: linear-gradient(180deg, var(--landing-surface) 0%, var(--landing-tint) 100%);
  text-align: center;
}
.agencies-kicker {
  color: var(--landing-accent);
  font-size: 13px;
  font-weight: 750;
}
.agencies-hero h1 {
  max-width: 15ch;
  margin: 18px auto 0;
  font-size: clamp(2.5rem, 6vw, 4.6rem);
  line-height: 1.04;
  letter-spacing: -0.055em;
  font-weight: 650;
  text-wrap: balance;
}
.agencies-lead {
  max-width: 620px;
  margin: 24px auto 0;
  color: var(--landing-muted);
  font-size: 18px;
  line-height: 1.75;
}
.agencies-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 16px 28px;
  margin-top: 36px;
}
.agencies-anchor {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--landing-accent);
  font-weight: 700;
  text-decoration: none;
}
.agencies-anchor:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}
.agencies-heading {
  max-width: 660px;
}
.agencies-heading > p {
  margin-top: 18px;
  color: var(--landing-muted);
  font-size: 17px;
  line-height: 1.75;
}
.agencies-heading-center {
  margin: 0 auto 56px;
  text-align: center;
}
.agencies-pool-section,
.agencies-faq-section {
  background: var(--landing-surface);
}
.agencies-price-section {
  background: var(--landing-tint);
}
.agencies-plans-section {
  background: var(--landing-bg);
}
.agencies-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 48px;
  overflow: hidden;
  border: 1px solid var(--landing-line);
  border-radius: 18px;
}
.agencies-plan {
  padding: 44px;
  background: var(--landing-surface);
}
.agencies-plan[data-plan='premium'] {
  border-left: 1px solid var(--landing-line);
  background: var(--landing-tint);
}
.agencies-plan h3 {
  font: 600 34px/1 var(--topiqu-font-reading);
  letter-spacing: -0.03em;
}
.agencies-plan-price {
  margin-top: 18px;
  color: var(--landing-muted);
  font-size: 15px;
}
.agencies-plan-price strong {
  margin-right: 4px;
  color: var(--landing-ink);
  font-size: 30px;
  font-weight: 650;
  letter-spacing: -0.04em;
}
.agencies-plan ul {
  display: grid;
  gap: 14px;
  margin: 30px 0 0;
  padding: 26px 0 0;
  border-top: 1px solid var(--landing-line);
  list-style: none;
  font-size: 15px;
  line-height: 1.6;
}
.agencies-plan li {
  display: flex;
  gap: 12px;
}
.agencies-plan li .iconify {
  flex: none;
  margin-top: 3px;
  color: var(--landing-accent);
}
.agencies-free {
  display: flex;
  align-items: baseline;
  gap: 6px 16px;
  margin-top: 20px;
  padding: 18px 24px;
  border: 1px dashed color-mix(in srgb, var(--landing-muted) 40%, transparent);
  border-radius: 12px;
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
.agencies-free strong {
  flex: none;
  color: var(--landing-ink);
}
.agencies-faq {
  max-width: 760px;
}
.agencies-faq h2 {
  margin-bottom: 32px;
  text-align: center;
}
.agencies-dots {
  display: flex;
  gap: 8px;
  margin-bottom: 22px;
}
.agencies-dots i {
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
@media (max-width: 760px) {
  .agencies-lead {
    font-size: 16px;
  }
  .agencies-pair {
    grid-template-columns: minmax(0, 1fr);
  }
  .agencies-plan {
    padding: 28px 22px;
  }
  .agencies-plan[data-plan='premium'] {
    border-top: 1px solid var(--landing-line);
    border-left: 0;
  }
  .agencies-free {
    flex-direction: column;
    padding: 16px 18px;
  }
  .agencies-heading-center {
    margin-bottom: 40px;
  }
}
</style>
