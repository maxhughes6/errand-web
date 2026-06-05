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
    <h2>{{ recipe.recipeName }}</h2>
    <div class="recipe-tags">
      <span v-for="tag in recipe.tags" :key="`${recipeKey}-${tag}`" class="recipe-tag-pill">
        {{ tag }}
      </span>
      <span v-if="!recipe.tags.length" class="recipe-tag-pill recipe-tag-pill-empty">
        No tags
      </span>
    </div>
    <div class="recipe-ingredients">
      <h3>Ingredients</h3>
      <ul>
        <li v-for="ingredient in recipe.ingredients" :key="`${recipeKey}-${ingredient.name}`">
          {{ ingredient.name }}: {{ ingredient.quantity }} {{ ingredient.unit }}
        </li>
      </ul>
      <p v-if="!recipe.ingredients || !recipe.ingredients.length" class="ingredients-empty">No ingredients listed.</p>
    </div>
    <div class="recipe-actions">
      <button type="button" class="primary-action-button" @click="emit('add-ingredients', recipe)">
        Add ingredients to cart
      </button>
      <button v-if="!hasInstructions" type="button" class="secondary-action-button"
        :disabled="isGeneratingInstructions" @click="emit('generate-instructions', recipe)">
        <span v-if="isGeneratingInstructions" class="button-spinner" aria-hidden="true"></span>
        {{ isGeneratingInstructions ? 'Generating instructions...' : 'Generate recipe instructions' }}
      </button>
      <button v-else type="button" class="secondary-action-button see-instructions-button"
        @click="emit('view-instructions', recipe)">
        See instructions
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.recipe-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  min-height: 24rem;
  border: 1px solid #e7dcf8;
  border-radius: 14px;
  background: #fcfbff;

  h2 {
    margin: 0;
    color: #4713a3;
    font-size: 1.4rem;
  }
}

.recipe-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recipe-tag-pill {
  border: 1px solid #7062b5;
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  background: #ece8ff;
  color: #473c7a;
  font-size: 0.92rem;
  font-weight: 600;
  text-transform: capitalize;
}

.recipe-tag-pill-empty {
  border-style: dashed;
  background: #f6f4ff;
  color: #7d7398;
}

.recipe-ingredients {
  h3 {
    margin: 0 0 0.75rem 0;
    color: #2d2352;
    font-size: 1rem;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #44385f;
  }

  li + li {
    margin-top: 0.35rem;
  }
}

.recipe-actions {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.primary-action-button,
.secondary-action-button {
  width: 100%;
  padding: 0.8rem 1.1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease, border-color 160ms ease;
}

.primary-action-button:hover,
.secondary-action-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 22px rgba(71, 19, 163, 0.14);
}

.primary-action-button {
  border: none;
  background: #4713a3;
  color: #fff;

  &:hover {
    background: #5a21c0;
  }
}

.secondary-action-button {
  border: 1px solid #cbb8ef;
  background: #f4efff;
  color: #4713a3;

  &:hover {
    border-color: #b08fe6;
    background: #ede4ff;
  }
}

.secondary-action-button:disabled {
  cursor: wait;
  opacity: 0.8;
}

.see-instructions-button {
  border-color: #1f8f4d;
  background: #e6f6ec;
  color: #11452d;

  &:hover {
    border-color: #18713d;
    background: #d4efde;
  }
}

.secondary-action-button:disabled:hover {
  transform: none;
  box-shadow: none;
}

.button-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(71, 19, 163, 0.18);
  border-top-color: #4713a3;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.ingredients-empty {
  margin: 0;
  color: #7d7398;
  font-style: italic;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
