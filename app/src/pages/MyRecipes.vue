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
  selectedInstructionsRecipe.value = {
    recipeName: '',
    tags: [],
    ingredients: []
  };
};

const addIngredientsToCart = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
  isRecipeDialogVisible.value = true;
};

const closeRecipeDialog = () => {
  isRecipeDialogVisible.value = false;
  selectedRecipe.value = {
    recipeName: '',
    tags: [],
    ingredients: []
  };
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
  <div class="page-container">
    <div class="page-content">
      <h1>{{ userState.getUser()?.preferredName }}'s Recipes</h1>
      <p class="page-description">Here are your saved recipes! Save recipes from the Recipes tab by clicking the bookmark icon on a recipe tile, or by adding its ingredients to your cart.</p>
      <LoadingSpinner v-if="isLoading" message="Loading your saved recipes..." />
      <div v-else-if="recipes.length" class="recipes-list">
        <RecipeCard v-for="recipe in recipes" :key="recipe.recipeId ?? recipe.recipeName" :recipe="recipe"
          :is-generating-instructions="isGeneratingInstructions(recipe)"
          @add-ingredients="addIngredientsToCart"
          @generate-instructions="generateInstructions"
          @view-instructions="openInstructionsDialog" />
      </div>
      <div v-else class="empty-state">
        <p>Looks like you don't have any saved recipes yet. Generate some on the Recipes tab and save them using the bookmark icon or by adding ingredients to your cart.</p>
      </div>
    </div>

    <RecipeIngredientsDialog :selectedRecipe="selectedRecipe" :dialogVisible="isRecipeDialogVisible"
      :dietaryPreferences="dietaryPreferences" @close-dialog="closeRecipeDialog" />

    <RecipeInstructionsDialog :selectedRecipe="selectedInstructionsRecipe"
      :dialogVisible="isInstructionsDialogVisible" @close-dialog="closeInstructionsDialog" />
  </div>
</template>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem;
  font-family: "Montserrat", sans-serif;
}

.page-content {
  width: 100%;
  max-width: 1100px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  padding: 2.5rem;

  h1 {
    color: #4713a3;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    font-family: "Montserrat", sans-serif;
  }

  .page-description {
    color: #5d4a7a;
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  border: 2px dashed #e0d4f7;
  border-radius: 12px;
  background: #f9f7ff;

  p {
    color: #5d4a7a;
    font-size: 1rem;
    margin: 0;
  }
}

.recipes-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .recipes-list {
    grid-template-columns: 1fr;
  }
}
</style>
