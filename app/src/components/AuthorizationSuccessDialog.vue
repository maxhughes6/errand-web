<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isVisible = computed(() => route.query.auth === 'success');

function closeDialog() {
  const nextQuery = { ...route.query };
  delete nextQuery.auth;

  router.replace({
    path: route.path,
    query: nextQuery,
    hash: route.hash
  });
}
</script>

<template>
  <div v-if="isVisible" class="overlay" @click.self="closeDialog">
    <section
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-success-title"
    >
      <div class="success-icon" aria-hidden="true">
        <i class="pi pi-check"></i>
      </div>

      <div class="dialog-body">
        <h2 id="auth-success-title" class="dialog-title">Thanks for authorizing!</h2>
        <p class="dialog-copy">
          You've given Errand access to add items to your Kroger cart for the next 24 hours.
          Note that <strong>each sign-in resets this 24-hour timer.</strong>
          To check out, head to the Kroger website or app to complete the process. Happy shopping!
        </p>
      </div>

      <button type="button" class="dialog-btn" @click="closeDialog">
        Got it!
      </button>
    </section>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: oklch(20% 0.012 50 / 0.48);
  backdrop-filter: blur(4px);
}

.dialog {
  width: min(100%, 38rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) var(--space-xl) var(--space-lg);
  border-radius: 20px;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  box-shadow: 0 24px 60px oklch(20% 0.012 50 / 0.14);
  text-align: center;
}

.success-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
  background: var(--color-accent-2-bg);
  border: 1.5px solid var(--color-accent-2-border);

  :deep(.pi) {
    color: var(--color-accent-2);
    font-size: 2.1rem;
    line-height: 1;
  }
}

.dialog-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0;
}

.dialog-copy {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  line-height: 1.7;
  margin: 0;
  max-width: 32ch;

  strong { color: var(--color-ink); font-weight: 700; }
}

.dialog-btn {
  width: 100%;
  padding: 0.95rem 1.4rem;
  border: none;
  border-radius: var(--radius-btn);
  background: var(--color-accent-2);
  color: #fff;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);
  transition: background-color var(--dur-micro) var(--ease-out);

  &:hover { background: oklch(34% 0.13 148); }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

@media (max-width: 640px) {
  .dialog {
    padding: var(--space-xl) var(--space-md) var(--space-md);
  }

  .dialog-title { font-size: var(--text-lg); }
  .dialog-copy { font-size: var(--text-sm); }
}
</style>
