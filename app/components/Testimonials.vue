<template>
  <section id="testimonials" class="landing-section testimonials-section" aria-labelledby="testimonials-title">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ t('landing.design.testimonials.eyebrow') }}</p>
        <h2 id="testimonials-title">{{ t('landing.design.testimonials.title') }}</h2>
        <p class="section-description">{{ t('landing.design.testimonials.description') }}</p>
      </div>
      <div class="testimonials-grid">
        <figure v-for="profile in profiles" :key="profile.key" class="testimonial-card">
          <div class="testimonial-meta">
            <div
              class="testimonial-rating"
              role="img"
              :aria-label="t('landing.design.testimonials.rating', { rating: profile.rating })"
            >
              <span class="testimonial-stars" aria-hidden="true">
                <Icon v-for="star in 5" :key="star" :name="star <= profile.rating ? 'mdi:star' : 'mdi:star-outline'" />
              </span>
              <span aria-hidden="true">{{ profile.rating }}/5</span>
            </div>
          </div>
          <blockquote class="testimonial-quote">
            <p>{{ t(`landing.design.testimonials.items.${profile.key}.quote`) }}</p>
          </blockquote>
          <figcaption class="testimonial-author">
            <span class="testimonial-initials" aria-hidden="true">{{ profile.initials }}</span>
            <span>
              <span class="testimonial-name">{{ t(`landing.design.testimonials.items.${profile.key}.name`) }}</span>
              <span class="testimonial-role">{{ t(`landing.design.testimonials.items.${profile.key}.role`) }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const profiles = [
  { key: 'personal', initials: 'PN', rating: 5 },
  { key: 'garden', initials: 'JD', rating: 5 },
  { key: 'travel', initials: 'MV', rating: 4 },
  { key: 'crafts', initials: 'LB', rating: 5 },
  { key: 'beginner', initials: 'TK', rating: 4 },
] as const
</script>

<style scoped>
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 20px;
}
.testimonial-card {
  display: flex;
  flex-direction: column;
  grid-column: span 2;
  gap: 24px;
  min-width: 0;
  margin: 0;
  padding: 28px;
  border: 1px solid var(--landing-line);
  border-radius: var(--topiqu-surface-radius);
  background: var(--landing-surface);
  overflow-wrap: anywhere;
}
.testimonial-card:nth-child(-n + 2) {
  grid-column: span 3;
}
.testimonial-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px 16px;
  color: var(--landing-muted);
  font-size: 12px;
  line-height: 1.5;
}
.testimonial-rating,
.testimonial-stars {
  display: inline-flex;
  align-items: center;
}
.testimonial-rating {
  gap: 8px;
  font-variant-numeric: tabular-nums;
}
.testimonial-stars {
  gap: 2px;
  color: var(--landing-accent);
  font-size: 16px;
}
.testimonial-quote {
  margin: 0;
  font-family: var(--topiqu-font-reading);
  font-size: 18px;
  line-height: 1.75;
}
.testimonial-card:nth-child(-n + 2) .testimonial-quote {
  font-size: 20px;
}
.testimonial-author {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: auto;
  padding-top: 24px;
  border-top: 1px solid var(--landing-line);
}
.testimonial-initials {
  display: grid;
  flex: none;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--landing-tint);
  color: var(--landing-accent);
  font-size: 13px;
  font-weight: 600;
}
.testimonial-name,
.testimonial-role {
  display: block;
}
.testimonial-name {
  font-size: 14px;
  font-weight: 600;
}
.testimonial-role {
  margin-top: 4px;
  color: var(--landing-muted);
  font-size: 12px;
  line-height: 1.5;
}
@media (max-width: 1000px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .testimonial-card,
  .testimonial-card:nth-child(-n + 2) {
    grid-column: auto;
  }
  .testimonial-card:last-child {
    grid-column: 1 / -1;
  }
}
@media (max-width: 600px) {
  .testimonials-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
  .testimonial-card {
    padding: 24px;
  }
  .testimonial-card:nth-child(-n + 2) .testimonial-quote {
    font-size: 18px;
  }
}
</style>
