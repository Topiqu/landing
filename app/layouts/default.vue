<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">{{ $t('landing.design.nav.skip') }}</a>
    <Header />
    <main id="main-content" tabindex="-1"><slot /></main>
    <Footer />
    <ButtonBackToTop />
  </div>
</template>
<style scoped>
.site-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--landing-bg);
}
</style>
