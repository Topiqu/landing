<script setup lang="ts">
const steps = ['knowledge', 'demand', 'research', 'write', 'publish', 'measure'] as const
</script>

<template>
  <section id="specs" class="landing-section workflow-section">
    <div class="landing-container">
      <div class="section-heading">
        <p class="eyebrow">{{ $t('landing.design.workflow.eyebrow') }}</p>
        <h2>{{ $t('landing.design.workflow.title') }}</h2>
      </div>
      <ol class="workflow-steps">
        <li v-for="(step, index) in steps" :key="step">
          <span class="workflow-number">0{{ index + 1 }}</span>
          <h3>{{ $t(`landing.design.workflow.steps.${index}.title`) }}</h3>
          <p>{{ $t(`landing.design.workflow.steps.${index}.text`) }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.workflow-steps {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--landing-line);
  border-left: 1px solid var(--landing-line);
}
.workflow-steps li {
  min-width: 0;
  padding: 24px 28px 28px;
  border-right: 1px solid var(--landing-line);
  border-bottom: 1px solid var(--landing-line);
}
.workflow-number {
  display: block;
  margin-bottom: 22px;
  color: var(--landing-accent);
  font: 500 28px/1 var(--topiqu-font-reading);
}
.workflow-steps h3 {
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: 700;
}
.workflow-steps p {
  max-width: 320px;
  color: var(--landing-muted);
  font-size: 14px;
  line-height: 1.7;
}
@media (max-width: 850px) {
  .workflow-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 600px) {
  .workflow-steps {
    grid-template-columns: 1fr;
  }
  .workflow-steps li {
    padding: 19px 22px;
  }
  .workflow-number {
    margin-bottom: 12px;
  }
}
</style>
