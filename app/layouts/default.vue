<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">{{ $t('landing.design.nav.skip') }}</a>
    <Header />
    <main id="main-content"><slot /></main>
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
.skip-link {
  position: fixed;
  top: -100px;
  left: 1rem;
  z-index: 100;
  padding: 0.75rem 1rem;
  background: var(--landing-surface);
}
.skip-link:focus {
  top: 1rem;
}
</style>
