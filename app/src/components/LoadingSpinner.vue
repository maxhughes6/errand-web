<script setup>
defineProps({
  message: {
    type: String,
    default: 'Loading…'
  }
});
</script>

<template>
  <div class="loading-container">
    <div class="loading-spinner" aria-hidden="true"></div>
    <p class="loading-message">{{ message }}</p>
  </div>
</template>

<style scoped lang="scss">
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: var(--space-md);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--color-rule);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.85s linear infinite;
}

.loading-message {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
