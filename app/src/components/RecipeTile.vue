<script setup>
import { defineProps } from 'vue';

defineProps({
    recipe: {
        type: Object,
        required: true
    }
})
</script>

<template>
    <div :key="recipe.recipeName" class="recipe-tile">
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
    font-family: "Montserrat", sans-serif;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
    padding: 1.5rem;
    cursor: pointer;
}

.recipe-tile:hover {
    background-color: #f3f0ff;
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