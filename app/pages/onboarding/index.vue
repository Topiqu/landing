<script setup lang="ts">
const localePath = useLocalePath()
await navigateTo(localePath({ name: 'onboarding-site' }), { replace: true })
</script>
