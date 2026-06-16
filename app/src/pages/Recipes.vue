<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { recipesService } from '../services';
import { userState } from '../state';
import { DietaryPreferenceTab, RecipeIngredientsDialog, LoadingSpinner, RecipeTile } from '../components';

const headers = [
  "What are you craving tonight?",
  'Or just type "something with cheese, please"',
  "Vegan, gluten-free, low-calorie…",
  "Make a timeless classic or explore something new",
  "Add a twist to your favourite recipe"
]

let intervalId = null;
let recipes = ref([]);
let loading = ref(false);
let hasSearched = ref(false);

const currentHeaderIndex = ref(0);
const isVisible = ref(true);
const searchInput = defineModel('searchInput');

const selectedRecipe = ref(null);
const dialogVisible = ref(false);
const dietaryPreferences = ref([]);

const cycleHeaders = () => {
  isVisible.value = false;
  setTimeout(() => {
    currentHeaderIndex.value =
      currentHeaderIndex.value === headers.length - 1 ? 0 : currentHeaderIndex.value + 1;
    isVisible.value = true;
  }, 400);
};

const openRecipeDialog = (recipe) => {
  selectedRecipe.value = recipe;
  dialogVisible.value = true;
};

const closeRecipeDialog = () => {
  dialogVisible.value = false;
  selectedRecipe.value = null;
};

const removeDietaryPreference = (label) => {
  const index = dietaryPreferences.value.indexOf(label);
  if (index !== -1) dietaryPreferences.value.splice(index, 1);
};

onMounted(() => {
  intervalId = setInterval(cycleHeaders, 3500);
  dietaryPreferences.value = userState.getErrandUserData()?.dietaryPreferences || [];

  const storedRecipes = window.sessionStorage.getItem('recipes');
  recipes.value = storedRecipes ? JSON.parse(storedRecipes)._value : [];
  hasSearched.value = !!storedRecipes;

  const storedInput = window.sessionStorage.getItem('searchInput');
  searchInput.value = storedInput ?? '';
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  window.sessionStorage.setItem('searchInput', searchInput.value);
  window.sessionStorage.setItem('recipes', JSON.stringify(recipes));
});

async function getRecipeSuggestions() {
  hasSearched.value = true;
  loading.value = true;
  recipes.value = [];
  const generated = await recipesService.generateRecipes(searchInput.value, dietaryPreferences.value);
  recipes.value = generated.recipes;
  loading.value = false;
  recipes.value.forEach(recipe => recipesService.saveRecipe(recipe));
}
</script>

<template>
  <div class="recipes-page">
    <header class="recipes-header">
      <h1
        class="recipes-headline"
        :class="{ 'headline--out': !isVisible, 'headline--in': isVisible }"
      >
        {{ headers[currentHeaderIndex] }}
      </h1>
    </header>

    <div class="search-row">
      <div class="search-wrap">
        <input
          type="text"
          placeholder="Get AI-generated recipes…"
          class="search-input"
          v-model="searchInput"
          @keydown.enter="getRecipeSuggestions"
          aria-label="Recipe search"
        />
        <button
          class="search-btn"
          @click="getRecipeSuggestions"
          aria-label="Generate recipes"
        >
          <i class="pi pi-sparkles" aria-hidden="true"></i>
        </button>
      </div>

      <div v-if="dietaryPreferences.length" class="preferences-row">
        <dietary-preference-tab
          v-for="preference in dietaryPreferences"
          :key="preference"
          :label="preference"
          @close="removeDietaryPreference"
        />
      </div>
    </div>

    <loading-spinner v-if="loading" message="Generating recipe suggestions…" />

    <div v-else-if="recipes && recipes.length" class="recipes-grid">
      <recipe-tile
        v-for="recipe in recipes"
        :key="recipe.recipeName"
        :recipe="recipe"
        @click="openRecipeDialog(recipe)"
      />
    </div>

    <p v-else-if="!loading && hasSearched" class="recipes-empty">
      No recipes yet — hit the sparkle button to generate some.
    </p>
  </div>

  <recipe-ingredients-dialog
    :selectedRecipe="selectedRecipe"
    :dialogVisible="dialogVisible"
    :dietary-preferences="dietaryPreferences"
    @close-dialog="closeRecipeDialog"
  />
</template>

<style scoped lang="scss">
.recipes-page {
  width: 100%;
  max-width: 1100px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ─── Header ─────────────────────────────────────────────── */
.recipes-header { min-height: 3.5rem; }

.recipes-headline {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1.15;
  margin: 0;
  transition: opacity var(--dur-short) var(--ease-in-out);

  &.headline--out { opacity: 0; }
  &.headline--in  { opacity: 1; }
}

/* ─── Search ─────────────────────────────────────────────── */
.search-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.search-wrap {
  position: relative;
  width: 100%;
  max-width: 560px;
}

.search-input {
  width: 100%;
  padding: var(--space-sm) 3.25rem var(--space-sm) var(--space-md);
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-pill);
  outline: none;
  transition:
    border-color var(--dur-micro) var(--ease-out),
    box-shadow var(--dur-micro) var(--ease-out);

  &:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px var(--color-accent-dim);
  }

  &::placeholder { color: var(--color-ink-2); }
}

.search-btn {
  position: absolute;
  right: var(--space-2xs);
  top: 50%;
  transform: translateY(-50%);
  width: 2.4rem;
  height: 2.4rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent);
  border: none;
  color: var(--color-accent-ink);
  font-size: 1.05rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color var(--dur-micro) var(--ease-out);

  &:hover { background: oklch(54% 0.22 42); }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.preferences-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

/* ─── Results grid ───────────────────────────────────────── */
.recipes-grid {
  display: grid;
  gap: var(--space-md);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.recipes-empty {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .recipes-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .recipes-grid { grid-template-columns: 1fr; }
  .recipes-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}
</style>
