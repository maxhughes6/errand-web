<script setup lang="ts">
import { computed } from 'vue';
import { Recipe } from '../models';

const props = defineProps<{
  recipe: Recipe;
  isGeneratingInstructions?: boolean;
}>();

const emit = defineEmits<{
  (e: 'add-ingredients', recipe: Recipe): void;
  (e: 'generate-instructions', recipe: Recipe): void;
  (e: 'view-instructions', recipe: Recipe): void;
}>();

const recipeKey = computed(() => String(props.recipe.recipeId ?? props.recipe.recipeName));
const hasInstructions = computed(() => Boolean(props.recipe.instructions));
</script>

<template>
  <div class="recipe-card">
    <div class="card-header">
      <h2 class="card-title">{{ recipe.recipeName }}</h2>
      <div class="card-tags">
        <span v-for="tag in recipe.tags" :key="`${recipeKey}-${tag}`" class="card-tag">{{ tag }}</span>
        <span v-if="!recipe.tags.length" class="card-tag card-tag--empty">No tags</span>
      </div>
    </div>

    <div class="card-ingredients">
      <h3 class="ingredients-heading">Ingredients</h3>
      <ul class="ingredients-list">
        <li
          v-for="ingredient in recipe.ingredients"
          :key="`${recipeKey}-${ingredient.name}`"
        >
          {{ ingredient.name }}: {{ ingredient.quantity }} {{ ingredient.unit }}
        </li>
      </ul>
      <p v-if="!recipe.ingredients || !recipe.ingredients.length" class="ingredients-empty">
        No ingredients listed.
      </p>
    </div>

    <div class="card-actions">
      <button type="button" class="btn-primary" @click="emit('add-ingredients', recipe)">
        Add ingredients to cart
      </button>
      <button
        v-if="!hasInstructions"
        type="button"
        class="btn-secondary"
        :disabled="isGeneratingInstructions"
        @click="emit('generate-instructions', recipe)"
      >
        <span v-if="isGeneratingInstructions" class="btn-spinner" aria-hidden="true"></span>
        {{ isGeneratingInstructions ? 'Generating instructions…' : 'Generate recipe instructions' }}
      </button>
      <button
        v-else
        type="button"
        class="btn-secondary btn-secondary--green"
        @click="emit('view-instructions', recipe)"
      >
        See instructions
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.recipe-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
  min-height: 24rem;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  transition:
    box-shadow var(--dur-short) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out);

  &:hover {
    box-shadow: 0 6px 24px oklch(20% 0.012 50 / 0.07);
    border-color: oklch(80% 0.012 85);
  }
}

/* ─── Header ─────────────────────────────────────────────── */
.card-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.card-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  margin: 0;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.card-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.25rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  color: var(--color-accent-2);

  &--empty {
    border-style: dashed;
    background: var(--color-paper-2);
    border-color: var(--color-rule);
    color: var(--color-ink-2);
  }
}

/* ─── Ingredients ─────────────────────────────────────────── */
.card-ingredients { flex: 1; }

.ingredients-heading {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  margin: 0 0 var(--space-xs);
}

.ingredients-list {
  margin: 0;
  padding-left: var(--space-md);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.55;

  li + li { margin-top: var(--space-3xs); }
}

.ingredients-empty {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  font-style: italic;
  margin: 0;
}

/* ─── Actions ─────────────────────────────────────────────── */
.card-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding-top: var(--space-xs);
}

.btn-primary,
.btn-secondary {
  width: 100%;
  padding: 0.95rem 1.4rem;
  border-radius: var(--radius-btn);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);
  transition: background-color var(--dur-micro) var(--ease-out);

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.btn-primary {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;

  &:hover:not(:disabled) { background: oklch(54% 0.22 42); }
}

.btn-secondary {
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
  color: var(--color-ink);

  &:hover:not(:disabled) { background: oklch(88% 0.018 88); }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  &--green {
    background: var(--color-accent-2-bg);
    border-color: var(--color-accent-2-border);
    color: var(--color-accent-2);

    &:hover:not(:disabled) { background: oklch(87% 0.09 148); }
  }
}

/* ─── Spinner ─────────────────────────────────────────────── */
.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid var(--color-accent-dim);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
