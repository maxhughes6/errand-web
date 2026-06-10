<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { krogerService, recipesService } from '../services';
import { LoadingSpinner, KrogerConnectionAlert } from './';
import { sessionState, userState } from '../state';

const toast = useToast();

const props = defineProps({
    selectedRecipe: {
        type: Object,
        required: true
    },
    dialogVisible: {
        type: Boolean,
        required: true
    },
    dietaryPreferences: {
        type: Array,
        default: () => []
    }
});

const ingredientsList = ref([]);
const numberOfItems = ref(0);
const isLoading = ref(false);
const isAddingToCart = ref(false);
const krogerConnected = ref(true);

const emit = defineEmits(['close-dialog']);

const closeDialog = () => {
    ingredientsList.value = [];
    numberOfItems.value = 0;
    emit('close-dialog');
};

watch(() => props.dialogVisible, async (isVisible) => {
    if (isVisible) {
        krogerConnected.value = sessionState.getIsKrogerAccountConnected();

        const recipe = props.selectedRecipe;
        if (!recipe) {
            ingredientsList.value = [];
            numberOfItems.value = 0;
            isLoading.value = false;
            return;
        }

        if (!krogerConnected.value) {
            // No Kroger: display the recipe's raw ingredients without product matching
            ingredientsList.value = recipe.ingredients.map(ing => ({
                name: ing.name,
                description: ing.quantity
                    ? `${ing.quantity}${ing.unit ? ' ' + ing.unit : ''}`
                    : '',
                upc: null,
                imageUrls: []
            }));
            numberOfItems.value = ingredientsList.value.length;
            isLoading.value = false;
            return;
        }

        isLoading.value = true;
        numberOfItems.value = recipe.ingredients.length;
        const ingredients = recipe.ingredients.map(ingredient => {
            return `${props.dietaryPreferences.join(' ')} ${ingredient.name}`.trim();
        });
        ingredientsList.value = await krogerService.getIngredientsList(ingredients);
        isLoading.value = false;
        return;
    }

    ingredientsList.value = [];
    numberOfItems.value = 0;
    isLoading.value = false;
    krogerConnected.value = true;
});

function handleRemoveItemClick(upc) {
    ingredientsList.value = ingredientsList.value.filter(item => item.upc !== upc);
    numberOfItems.value = ingredientsList.value.length;
    if (numberOfItems.value === 0) {
        closeDialog();
    }
}

async function handleAddItemsToCartClick() {
    if (isAddingToCart.value || !ingredientsList.value.length) {
        return;
    }

    const numItemsAdded = ingredientsList.value.length;
    let itemsToAdd = ingredientsList.value.map(item => ({
        upc: item.upc,
        quantity: 1,
        modality: "PICKUP"
    }));

    isAddingToCart.value = true;

    try {
        await krogerService.addToCart(itemsToAdd);
        recipesService.saveRecipe(props.selectedRecipe).catch(() => {});
        closeDialog();
        toast.add({ severity: 'success', summary: 'Added to Cart', detail: `${numItemsAdded} items added to cart successfully! Remember to check out on the Kroger website.`, life: 5000 });
    } finally {
        isAddingToCart.value = false;
    }
}
</script>

<template>
    <div v-if="dialogVisible && selectedRecipe" class="recipe-dialog-overlay" @click.self="closeDialog">
        <section class="recipe-dialog" role="dialog" aria-modal="true" aria-labelledby="recipe-dialog-title">
            <div class="recipe-dialog-shell">
                <header class="recipe-dialog-header">
                    <div class="shopping-icon" aria-hidden="true">
                        <i class="pi pi-cart-arrow-down"></i>
                    </div>
                    <div class="recipe-dialog-heading">
                        <h2 id="recipe-dialog-title">{{ selectedRecipe.recipeName }}</h2>
                        <p v-if="krogerConnected">Review the ingredients below, remove anything you do not need, then add the rest to your Kroger cart.</p>
                                <p v-else>Here are the ingredients for this recipe. Connect your Kroger account to add them to your cart.</p>
                    </div>
                </header>

                <div class="recipe-dialog-body">
                    <loading-spinner v-if="isLoading" message="One sec, grabbing those items for you..."></loading-spinner>

                    <template v-else>
                        <div v-if="selectedRecipe.tags?.length" class="recipe-tags-section">
                            <span v-for="tag in selectedRecipe.tags" :key="tag" class="recipe-tag">
                                {{ tag }}
                            </span>
                        </div>

                        <div class="ingredients-section">
                            <div class="ingredients-summary">
                                <h3>{{ krogerConnected ? 'Add ingredients to cart' : 'Ingredients' }}</h3>
                                <span>{{ numberOfItems }} {{ numberOfItems === 1 ? 'item' : 'items' }}</span>
                            </div>

                            <ul v-if="ingredientsList.length" class="ingredients-list">
                                <li v-for="ingredient in ingredientsList" :key="ingredient.upc || ingredient.name"
                                    class="ingredient-card">
                                    <div class="ingredient-main">
                                        <img v-if="ingredient.imageUrls?.[0]" :src="ingredient.imageUrls[0]"
                                            :alt="ingredient.name" class="ingredient-image" />
                                        <div class="ingredient-copy">
                                            <p class="ingredient-name">{{ ingredient.name }}</p>
                                            <span class="ingredient-description">{{ ingredient.description }}</span>
                                        </div>
                                    </div>
                                    <button v-if="krogerConnected" type="button" class="remove-ingredient-button"
                                        :aria-label="`Remove ${ingredient.name}`"
                                        @click="handleRemoveItemClick(ingredient.upc)">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </li>
                            </ul>

                            <p v-else class="empty-state">No ingredients are left to add for this recipe.</p>
                        </div>

                        <!-- No Kroger connection: prompt to connect -->
                        <kroger-connection-alert
                            v-if="!krogerConnected"
                            redirect-page="recipes"
                            class="dialog-kroger-alert"
                        />

                        <div class="recipe-dialog-actions">
                            <button type="button" class="dialog-button secondary" @click="closeDialog()">
                                Close
                            </button>
                            <button v-if="krogerConnected" type="button" class="dialog-button primary"
                                :disabled="!numberOfItems || isLoading || isAddingToCart"
                                @click="handleAddItemsToCartClick()">
                                <span v-if="isAddingToCart" class="button-loading-state" aria-live="polite">
                                    <span class="button-spinner" aria-hidden="true"></span>
                                    Adding items...
                                </span>
                                <span v-else>
                                    Add {{ numberOfItems }} {{ numberOfItems === 1 ? 'item' : 'items' }} to cart
                                </span>
                            </button>
                        </div>
                    </template>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.recipe-dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(29, 16, 48, 0.42);
    backdrop-filter: blur(6px);
}

.recipe-dialog {
    width: min(100%, 46rem);
    max-height: min(88vh, 54rem);
    border-radius: 28px;
    background: #ffffff;
    box-shadow: 0 24px 60px rgba(41, 23, 74, 0.2);
    overflow: hidden;
}

.recipe-dialog-shell {
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: min(88vh, 54rem);
}

.recipe-dialog-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.75rem 2.5rem 1.5rem;
    text-align: center;
}

.shopping-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.75rem;
    height: 4.75rem;
    border-radius: 999px;
    background: linear-gradient(135deg, #4713a3 0%, #6f38d8 100%);
    box-shadow: 0 14px 30px rgba(71, 19, 163, 0.28);
    color: #ffffff;
    font-size: 2rem;
}

.recipe-dialog-heading {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;

    h2 {
        margin: 0;
        color: #2f1760;
        font-family: "Montserrat", sans-serif;
        font-size: 2rem;
        font-weight: 700;
    }

    p {
        margin: 0;
        color: #5b5170;
        font-family: "Montserrat", sans-serif;
        font-size: 1rem;
        line-height: 1.7;
    }
}

.recipe-dialog-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 0 2.5rem 2rem;
}

.recipe-tags-section {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
    margin-bottom: 1.5rem;
}

.recipe-tag {
    border-radius: 999px;
    padding: 0.45rem 0.9rem;
    background: #f2ebff;
    color: #5b30b3;
    font-family: "Montserrat", sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
}

.ingredients-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.ingredients-summary {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;

    h3 {
        margin: 0;
        color: #2f1760;
        font-family: "Montserrat", sans-serif;
        font-size: 1.2rem;
        font-weight: 700;
    }

    span {
        color: #6d6283;
        font-family: "Montserrat", sans-serif;
        font-size: 0.95rem;
        font-weight: 600;
    }
}

.ingredients-list {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.ingredient-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.1rem;
    border: 1px solid #e7ddfb;
    border-radius: 20px;
    box-shadow: 0 4px 6px rgba(38, 18, 76, 0.1);
}

.ingredient-main {
    display: flex;
    align-items: center;
    gap: 1rem;
    min-width: 0;
}

.ingredient-image {
    width: 4rem;
    height: 4rem;
    border-radius: 16px;
    object-fit: cover;
    background: #f1eef8;
    flex-shrink: 0;
}

.ingredient-copy {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
}

.ingredient-name {
    margin: 0;
    color: #26124c;
    font-family: "Montserrat", sans-serif;
    font-size: 1rem;
    font-weight: 700;
}

.ingredient-description {
    color: #6d6283;
    font-family: "Montserrat", sans-serif;
    font-size: 0.92rem;
    line-height: 1.5;
}

.remove-ingredient-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    border: 1px solid #dcccfb;
    border-radius: 999px;
    background: #ffffff;
    color: #6a3acf;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease, transform 0.15s ease;

    span {
        font-size: 1.35rem;
        line-height: 1;
    }

    &:hover {
        background: #f3ecff;
        border-color: #c6aff8;
        color: #4713a3;
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 3px solid rgba(111, 56, 216, 0.2);
        outline-offset: 3px;
    }
}

.empty-state {
    margin: 0;
    border-radius: 20px;
    padding: 1.2rem;
    background: #faf7ff;
    color: #5b5170;
    font-family: "Montserrat", sans-serif;
    text-align: center;
}

.recipe-dialog-actions {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    gap: 0.9rem;
    margin-top: 1.5rem;
    padding: 1rem 0 0;
}

.dialog-button {
    border-radius: 16px;
    padding: 0.95rem 1.4rem;
    font-family: "Montserrat", sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(41, 23, 74, 0.12);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;

    &:focus-visible {
        outline: 3px solid rgba(111, 56, 216, 0.2);
        outline-offset: 3px;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
    }
}

.dialog-button.secondary {
    border: 1px solid #d8c9f8;
    background: #ffffff;
    color: #4f2a9d;

    &:hover:not(:disabled) {
        background: #f7f2ff;
        border-color: #bea5f2;
    }
}

.dialog-button.primary {
    border: none;
    background: linear-gradient(135deg, #4713a3 0%, #6f38d8 100%);
    color: #ffffff;
    box-shadow: 0 14px 30px rgba(71, 19, 163, 0.28);

    &:hover:not(:disabled) {
        box-shadow: 0 18px 34px rgba(71, 19, 163, 0.32);
    }
}

.button-loading-state {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
}

.button-spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #ffffff;
    border-radius: 999px;
    animation: spin 0.7s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.dialog-kroger-alert {
    margin-top: 1.25rem;
}

@media (max-width: 640px) {
    .recipe-dialog {
        width: min(100%, 34rem);
        max-height: min(92vh, 54rem);
    }

    .recipe-dialog-header {
        padding: 2rem 1.25rem 1.25rem;
    }

    .recipe-dialog-heading {
        h2 {
            font-size: 1.6rem;
        }

        p {
            font-size: 0.95rem;
        }
    }

    .recipe-dialog-body {
        padding: 0 1.25rem 1.25rem;
    }

    .ingredients-summary {
        flex-direction: column;
        align-items: flex-start;
    }

    .ingredient-card {
        align-items: flex-start;
    }

    .ingredient-main {
        align-items: flex-start;
    }

    .recipe-dialog-actions {
        flex-direction: column-reverse;
    }

    .dialog-button {
        width: 100%;
    }
}
</style>