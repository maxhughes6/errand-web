<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { recipesService } from '../services';
import { userState } from '../state';
import { DietaryPreferenceTab, RecipeIngredientsDialog, LoadingSpinner, RecipeTile } from '../components';

const headers = [
  "What are you craving?",
  "Or just type, \"Something with cheese, please\"",
  "Vegan, gluten-free, low-calorie, etc.",
  "Make a timeless classic or explore something new",
  "Or, add a twist to your favorite recipe"
]

let intervalId = null;
let recipes = ref([]);
let loading = ref(false);

const currentHeaderIndex = ref(0);
const isVisible = ref(true);
const searchInput = defineModel('searchInput');

// Dialog state
const selectedRecipe = ref(null);
const dialogVisible = ref(false);
const dietaryPreferences = ref([]);

const cycleHeaders = () => {
  isVisible.value = false;

  setTimeout(() => {
    currentHeaderIndex.value =
      currentHeaderIndex.value == headers.length - 1 ? 0
        : currentHeaderIndex.value + 1;
    isVisible.value = true
  }, 600)
}

const openRecipeDialog = (recipe) => {
  selectedRecipe.value = recipe;
  dialogVisible.value = true;
}

const closeRecipeDialog = () => {
  dialogVisible.value = false;
  selectedRecipe.value = null;
}

const removeDietaryPreference = (label) => {
  const index = dietaryPreferences.value.indexOf(label);

  if (index !== -1) {
    dietaryPreferences.value.splice(index, 1);
  }
}

onMounted(() => {
  intervalId = setInterval(cycleHeaders, 3000);
  dietaryPreferences.value = userState.getErrandUserData()?.dietaryPreferences || [];
  const storedRecipes = window.sessionStorage.getItem('recipes');
  if (storedRecipes) {
    recipes.value = JSON.parse(storedRecipes)._value;
  } else {
    recipes.value = [];
  }

  const storedSearchInput = window.sessionStorage.getItem('searchInput');
  if (storedSearchInput) {
    searchInput.value = storedSearchInput;
  } else {
    searchInput.value = '';
  }
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
  window.sessionStorage.setItem('searchInput', searchInput.value);
  window.sessionStorage.setItem('recipes', JSON.stringify(recipes));
})

async function getRecipeSuggestions() {
  loading.value = true;
  recipes.value = [];

  const generatedRecipes = await recipesService.generateRecipes(searchInput.value, dietaryPreferences.value);
  recipes.value = generatedRecipes.recipes;
  loading.value = false;
}
</script>

<template>
  <div id="container">
    <h1 class="title" :class="{ 'fade-out': !isVisible, 'fade-in': isVisible }">
      {{ headers[currentHeaderIndex] }}
    </h1>
    <div class="search-container">
      <input type="text" placeholder="Get AI-generated recipes..." class="generate-recipe-input" v-model="searchInput">
      <button class="search-button" @click="getRecipeSuggestions()">
        <i class="pi pi-sparkles"></i>
      </button>
    </div>
    <div v-if="dietaryPreferences.length" class="dietary-preferences-container">
      <dietary-preference-tab
        v-for="preference in dietaryPreferences"
        :key="preference"
        :label="preference"
        @close="removeDietaryPreference"
      />
    </div>
    <loading-spinner v-if="loading" message="Generating recipe suggestions..." />
    <div class="recipe-suggestions-container" v-else-if="recipes">
      <recipe-tile  v-for="recipe in recipes" :recipe="recipe" @click="openRecipeDialog(recipe)"/>
    </div>
  </div>

  <recipe-ingredients-dialog
    :selectedRecipe="selectedRecipe"
    :dialogVisible="dialogVisible"
    :dietary-preferences="dietaryPreferences"
    @close-dialog="closeRecipeDialog">
  </recipe-ingredients-dialog>
</template>

<style scoped lang="scss">
#container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 100px;

  h1 {
    margin-bottom: 20px;
    font-size: 2rem;
    color: #333;
  }

  .title {
    font-family: "Montserrat", sans-serif;
    transition: opacity 0.5s ease-in-out;

    &.fade-out {
      opacity: 0;
    }

    &.fade-in {
      opacity: 1;
    }
  }

  .search-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    display: flex;
    align-items: center;
  }

  .dietary-preferences-container {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 16px;
  }

  .generate-recipe-input {
    width: 100%;
    padding: 16px 50px 16px 20px;
    font-size: 1rem;
    border: 2px solid #6e3ff3;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
    border-radius: 25px;
    outline: none;
    background: white;

    &:focus {
      border-color: #4713a3;
    }
  }

  .search-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    background: #4713a3;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #6e3ff3;
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .recipe-suggestions-container {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 50px;
  }
}
</style>