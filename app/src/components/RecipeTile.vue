<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { recipesService } from '../services';

const toast = useToast();

const props = defineProps({
    recipe: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['recipe-saved']);

const isSaved = ref(props.recipe.isSaved ?? false);
const isSaving = ref(false);

async function handleSaveClick(event) {
    event.stopPropagation();
    if (isSaved.value || isSaving.value) return;

    isSaving.value = true;
    try {
        await recipesService.saveRecipe(props.recipe);
        isSaved.value = true;
        emit('recipe-saved', props.recipe.recipeName);
        toast.add({
            severity: 'success',
            summary: 'Recipe Saved',
            detail: `${props.recipe.recipeName} has been saved to your recipes.`,
            life: 3000
        });
    } catch {
        toast.add({
            severity: 'error',
            summary: 'Save Failed',
            detail: 'Could not save the recipe. Please try again.',
            life: 3000
        });
    } finally {
        isSaving.value = false;
    }
}
</script>

<template>
    <div :key="recipe.recipeName" class="recipe-tile">
        <button
            class="save-button"
            :class="{ 'is-saved': isSaved }"
            :disabled="isSaved || isSaving"
            :aria-label="isSaved ? 'Recipe saved' : 'Save recipe'"
            :title="isSaved ? 'Saved' : 'Save recipe'"
            @click="handleSaveClick"
        >
            <i :class="isSaved ? 'pi pi-bookmark-fill' : 'pi pi-bookmark'"></i>
        </button>
        <h3>{{ recipe.recipeName }}</h3>
        <span v-for="tag in recipe.tags" class="recipe-tag">
            {{ tag }}
        </span>
        <ul>
            <li v-for="ingredient in recipe.ingredients" :key="ingredient.name" class="ingredient-li">
                {{ ingredient.name }}, {{ ingredient.quantity }}<span class="ingredient-units">{{ ingredient.unit
                    }}</span>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.recipe-tile {
    position: relative;
    font-family: "Montserrat", sans-serif;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
    padding: 1.5rem;
    cursor: pointer;
}

.save-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.1rem;
    height: 2.1rem;
    border: none;
    border-radius: 50%;
    background: transparent;
    color: #a08ccc;
    font-size: 1.1rem;
    cursor: pointer;
    transition: color 0.15s ease, background-color 0.15s ease;
    z-index: 1;
}

.save-button:hover:not(:disabled) {
    color: #4713a3;
    background-color: #ede8fa;
}

.save-button:focus-visible {
    outline: 3px solid rgba(71, 19, 163, 0.25);
    outline-offset: 2px;
}

.save-button.is-saved {
    color: #4713a3;
    cursor: default;
}

.save-button:disabled {
    cursor: default;
}

.recipe-tag {
    border: 1px solid blue;
    padding: 5px 8px;
    border-radius: 30px;
    background-color: #e0e0ff;
    margin-right: 5px;
}

.ingredient-li {
    margin: 5px 0;
}

.ingredient-units {
    margin-left: 5px;
}
</style>
