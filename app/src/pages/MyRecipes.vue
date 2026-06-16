<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { LoadingSpinner, RecipeCard, RecipeIngredientsDialog, RecipeInstructionsDialog } from '../components';
import { recipesService } from '../services';
import { Recipe } from '../models';
import { userState } from '../state';

const recipes = ref([] as Recipe[]);
const isLoading = ref(true);
const isRecipeDialogVisible = ref(false);
const isInstructionsDialogVisible = ref(false);
const selectedRecipe = ref<Recipe>({
  recipeName: '',
  tags: [],
  ingredients: []
});
const selectedInstructionsRecipe = ref<Recipe>({
  recipeName: '',
  tags: [],
  ingredients: []
});
const dietaryPreferences = ref<string[]>(userState.getErrandUserData()?.dietaryPreferences ?? []);
const pendingInstructionKeys = ref<Set<string>>(new Set());

const getRecipeKey = (recipe: Recipe) => String(recipe.recipeId ?? recipe.recipeName);

const isGeneratingInstructions = (recipe: Recipe) =>
  pendingInstructionKeys.value.has(getRecipeKey(recipe));

const generateInstructions = async (recipe: Recipe) => {
  const key = getRecipeKey(recipe);
  pendingInstructionKeys.value.add(key);
  try {
    const instructions = await recipesService.generateRecipeInstructions(recipe);
    const index = recipes.value.findIndex((r) => getRecipeKey(r) === key);
    if (index !== -1) {
      recipes.value[index] = { ...recipes.value[index], instructions };
    }
  } finally {
    pendingInstructionKeys.value.delete(key);
  }
};

const openInstructionsDialog = (recipe: Recipe) => {
  selectedInstructionsRecipe.value = recipe;
  isInstructionsDialogVisible.value = true;
};

const closeInstructionsDialog = () => {
  isInstructionsDialogVisible.value = false;
  selectedInstructionsRecipe.value = { recipeName: '', tags: [], ingredients: [] };
};

const addIngredientsToCart = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  isRecipeDialogVisible.value = true;
};

const closeRecipeDialog = () => {
  isRecipeDialogVisible.value = false;
  selectedRecipe.value = { recipeName: '', tags: [], ingredients: [] };
};

onMounted(async () => {
  try {
    const fetchedRecipes = await recipesService.getRecipes();
    recipes.value = fetchedRecipes;
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="my-recipes-page">
    <header class="page-header">
      <h1 class="page-heading">{{ userState.getUser()?.preferredName }}'s Recipes</h1>
      <p class="page-sub">Here are your saved recipes. When you generate new recipes, they'll be saved here automatically.</p>
    </header>

    <LoadingSpinner v-if="isLoading" message="Loading your saved recipes…" />

    <div v-else-if="recipes.length" class="recipes-grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.recipeId ?? recipe.recipeName"
        :recipe="recipe"
        :is-generating-instructions="isGeneratingInstructions(recipe)"
        @add-ingredients="addIngredientsToCart"
        @generate-instructions="generateInstructions"
        @view-instructions="openInstructionsDialog"
      />
    </div>

    <div v-else class="empty-state">
      <i class="pi pi-bookmark empty-icon" aria-hidden="true"></i>
      <p class="empty-text">
        No saved recipes yet. Generate recipes on the Recipes tab and they'll be saved here automatically.
      </p>
    </div>

    <RecipeIngredientsDialog
      :selectedRecipe="selectedRecipe"
      :dialogVisible="isRecipeDialogVisible"
      :dietaryPreferences="dietaryPreferences"
      @close-dialog="closeRecipeDialog"
    />
    <RecipeInstructionsDialog
      :selectedRecipe="selectedInstructionsRecipe"
      :dialogVisible="isInstructionsDialogVisible"
      @close-dialog="closeInstructionsDialog"
    />
  </div>
</template>

<style scoped lang="scss">
.my-recipes-page {
  width: 100%;
  max-width: 1100px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ─── Header ─────────────────────────────────────────────── */
.page-heading {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-2xs);
}

.page-sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Grid ───────────────────────────────────────────────── */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

/* ─── Empty state ────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  border: 2px dashed var(--color-rule);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}

.empty-icon {
  font-size: 2rem;
  color: var(--color-ink-2);
  opacity: 0.5;
}

.empty-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
  max-width: 48ch;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .recipes-grid { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .my-recipes-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}
</style>
