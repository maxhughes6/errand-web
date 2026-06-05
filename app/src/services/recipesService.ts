import { authenticatedFetch } from './authenticatedFetch';
import { Recipe } from '../models/models';

const ERRAND_API_BASE_URL = import.meta.env.VITE_ERRAND_API_BASE_URL;

export const recipesService = {
    async generateRecipes(prompt: string, dietaryPreferences?: string[]): Promise<Recipe[]> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/generate-recipes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt, dietaryPreferences }),
        });

        if (!response.ok) {
            throw new Error(`Error calling generateRecipes -- Response status: ${response.status}`);
        }

        return await response.json();
    },

    async generateRecipeWithIngredient(ingredient: Object): Promise<Recipe> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/generate-recipe-with-ingredient`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ingredient),
        });

        if (!response.ok) {
            throw new Error(`Error calling generateRecipeWithIngredient -- Response status: ${response.status}`);
        }

        return await response.json();
    },

    async getRecipes(): Promise<Recipe[]> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/recipes`);

        if (!response.ok) {
            throw new Error(`Error calling getRecipes -- Response status: ${response.status}`);
        }

        const data = await response.json();
        return data.recipes as Recipe[];
    },

    async saveRecipe(recipe: Recipe): Promise<void> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/recipes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            throw new Error(`Error calling saveRecipe -- Response status: ${response.status}`);
        }
    },

    async generateRecipeInstructions(recipe: Recipe): Promise<string> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/recipes/instructions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(recipe),
        });

        if (!response.ok) {
            throw new Error(`Error calling generateRecipeInstructions -- Response status: ${response.status}`);
        }

        const data = await response.json();
        return data.instructions as string;
    }
};
