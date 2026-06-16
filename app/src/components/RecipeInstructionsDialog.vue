<script setup lang="ts">
import { Recipe } from '../models';

defineProps<{
  selectedRecipe: Recipe;
  dialogVisible: boolean;
}>();

const emit = defineEmits(['close-dialog']);

const closeDialog = () => { emit('close-dialog'); };
</script>

<template>
  <div
    v-if="dialogVisible && selectedRecipe"
    class="dialog-overlay"
    @click.self="closeDialog"
  >
    <section
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="instructions-dialog-title"
    >
      <!-- Header -->
      <header class="dialog-header">
        <div class="book-icon" aria-hidden="true">
          <i class="pi pi-book"></i>
        </div>
        <h2 id="instructions-dialog-title" class="dialog-title">
          {{ selectedRecipe.recipeName }}
        </h2>
      </header>

      <!-- Body -->
      <div class="dialog-body">
        <p v-if="selectedRecipe.instructions" class="instructions-text">
          {{ selectedRecipe.instructions }}
        </p>
        <p v-else class="empty-state">
          No instructions available for this recipe yet.
        </p>
      </div>

      <!-- Footer -->
      <footer class="dialog-footer">
        <button type="button" class="close-btn" @click="closeDialog()">
          Close
        </button>
      </footer>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ─── Overlay ─────────────────────────────────────────────── */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: oklch(20% 0.012 50 / 0.48);
  backdrop-filter: blur(6px);
}

/* ─── Dialog shell ───────────────────────────────────────── */
.dialog {
  width: min(100%, 46rem);
  max-height: min(88vh, 54rem);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  box-shadow: 0 24px 60px oklch(20% 0.012 50 / 0.14);
  overflow: hidden;
}

/* ─── Header ─────────────────────────────────────────────── */
.dialog-header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) var(--space-xl) var(--space-lg);
  text-align: center;
}

.book-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid oklch(62% 0.22 42 / 0.25);
  color: var(--color-accent);
  font-size: 1.9rem;
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

/* ─── Body ───────────────────────────────────────────────── */
.dialog-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-lg) var(--space-xl);
}

.instructions-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink);
  line-height: 1.75;
  white-space: pre-wrap;
  margin: 0;
}

.empty-state {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  text-align: center;
  padding: var(--space-lg);
  background: var(--color-paper-2);
  border-radius: var(--radius-card);
  margin: 0;
}

/* ─── Footer ─────────────────────────────────────────────── */
.dialog-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: var(--space-md) var(--space-xl);
}

.close-btn {
  padding: 0.95rem 1.4rem;
  border-radius: var(--radius-btn);
  border: 1px solid var(--color-rule);
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);
  transition: background-color var(--dur-micro) var(--ease-out);

  &:hover { background: oklch(88% 0.018 88); }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 640px) {
  .dialog {
    width: min(100%, 34rem);
    max-height: min(92vh, 54rem);
  }

  .dialog-header { padding: var(--space-xl) var(--space-md) var(--space-md); }
  .dialog-title { font-size: var(--text-lg); }
  .dialog-body { padding: var(--space-md); }

  .dialog-footer {
    padding: var(--space-md);

    .close-btn { width: 100%; justify-content: center; }
  }
}
</style>
