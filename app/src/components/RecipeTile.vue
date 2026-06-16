<script setup>
import { defineProps } from 'vue';

defineProps({
  recipe: {
    type: Object,
    required: true
  }
});
</script>

<template>
  <div class="recipe-tile">
    <h3 class="tile-name">{{ recipe.recipeName }}</h3>
    <div v-if="recipe.tags && recipe.tags.length" class="tile-tags">
      <span v-for="tag in recipe.tags" :key="tag" class="tile-tag">{{ tag }}</span>
    </div>
    <ul class="tile-ingredients">
      <li v-for="ingredient in recipe.ingredients" :key="ingredient.name" class="ingredient-li">
        {{ ingredient.name }}<span v-if="ingredient.quantity">, {{ ingredient.quantity }}<span
          v-if="ingredient.unit" class="ingredient-unit"> {{ ingredient.unit }}</span></span>
      </li>
    </ul>
    <span class="tile-cta" aria-hidden="true">View recipe →</span>
  </div>
</template>

<style scoped lang="scss">
.recipe-tile {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition:
    transform var(--dur-short) var(--ease-out),
    box-shadow var(--dur-short) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px oklch(20% 0.012 50 / 0.08);
    border-color: var(--color-accent);

    .tile-cta { color: var(--color-accent); }
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.tile-name {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  margin: 0;
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.tile-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.tile-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  color: var(--color-accent-2);
}

.tile-ingredients {
  margin: 0;
  padding-left: var(--space-md);
  flex: 1;
}

.ingredient-li {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.5;
  margin: 0;

  & + & { margin-top: var(--space-3xs); }
}

.ingredient-unit {
  color: var(--color-ink-2);
}

.tile-cta {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink-2);
  letter-spacing: 0.02em;
  margin-top: var(--space-2xs);
  transition: color var(--dur-micro) var(--ease-out);
}
</style>
