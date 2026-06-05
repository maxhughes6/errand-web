<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import { krogerService, recipesService } from '../services';
import { LoadingSpinner, RecipeTile, RecipeIngredientsDialog } from '../components';

const route = useRoute();
const toast = useToast();
const productId = route.params.productId;

const productDetails = ref({});
const loading = ref(true);
const addingToCart = ref(false);

const recipeSuggestion = ref(null);
const loadingRecipeSuggestion = ref(false);
const dialogVisible = ref(false);

const krogerAccessToken = ref('');

onMounted(async () => {
    // Request product details from the API
    try {
        const product = await krogerService.getProductByUpc(productId);
        productDetails.value = product;
    } catch (error) {
    } finally {
        loading.value = false;
    }

    // Show recipe suggestion if it exists in session storage
    let storedRecipe = window.sessionStorage.getItem(`recipe-${productId}`);
    if (storedRecipe) {
        recipeSuggestion.value = JSON.parse(storedRecipe);
    }

    // Get access token if user is logged in with their Kroger account
    krogerAccessToken.value = window.sessionStorage.getItem('authenticatedAccessToken') || '';
});

async function handleGetRecipeSuggestion() {
    loadingRecipeSuggestion.value = true;
    const cached = window.sessionStorage.getItem(`recipe-${productId}`);
    if (cached) {
        recipeSuggestion.value = JSON.parse(cached);
        loadingRecipeSuggestion.value = false;
        return;
    }

    try {
        const recipe = await recipesService.generateRecipeWithIngredient(productDetails.value);
        recipeSuggestion.value = recipe;
        window.sessionStorage.setItem(`recipe-${productId}`, JSON.stringify(recipe));
        recipesService.saveRecipe(recipe);
    } catch (error) {
    } finally {
        loadingRecipeSuggestion.value = false;
    }
}

async function handleAddToCartClick() {
    addingToCart.value = true;
    const product = {
        upc: productDetails.value.upc,
        quantity: 1,
        modality: 'PICKUP'
    };

    try {
        let productsArray = new Array();
        productsArray.push(product);
        await krogerService.addToCart(productsArray);
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product to cart. Please try again.', life: 5000 });
        return;
    } finally {
        addingToCart.value = false;
    }
    toast.add({ severity: 'success', summary: 'Added to Cart', detail: 'Product added to cart successfully! Remember to check out on the Kroger website.', life: 5000 });
}

const openRecipeDialog = (recipe) => {
    dialogVisible.value = true;
}

const closeRecipeDialog = () => {
    dialogVisible.value = false;
}

</script>

<template>
    <div class="product-page-container">
        <loading-spinner v-if="loading" message="Loading product details..." />
        <div v-else-if="productDetails" class="product-content">
            <!-- Product Header -->
            <div class="product-header">
                <h1 class="product-title">{{ productDetails.description || 'Product Details' }}</h1>
            </div>

            <div class="product-main-content">
                <!-- Product Images Carousel -->
                <Card class="product-carousel-card">
                    <template #content>
                        <Carousel :value="productDetails.imageUrls" :numVisible="1" :numScroll="1" :autoplayInterval="5000"
                            :showNavigators="true" :showIndicators="true" class="product-carousel">
                            <template #item="slotProps">
                                <div class="carousel-item">
                                    <img :src="slotProps.data" :alt="productDetails.description"
                                        class="product-image" />
                                </div>
                            </template>
                        </Carousel>
                    </template>
                </Card>
                <!-- Product Details -->
                <Card class="product-details-card">
                    <template #header>
                        <h2>Product Information</h2>
                    </template>

                    <template #content>
                        <!-- Categories -->
                        <div class="categories-section" v-if="productDetails.categories">
                            <h3>Categories</h3>
                            <div class="categories-container">
                                <Chip v-for="category in productDetails.categories" :key="category" :label="category"
                                    class="category-chip" />
                            </div>
                        </div>
                        <!-- Product Details -->
                        <div class="product-info-section">
                            <div class="info-item" v-if="productDetails.brand">
                                <strong>Brand:</strong> {{ productDetails.brand }}
                            </div>
                            <div class="info-item" v-if="productDetails.productId">
                                <strong>Product ID:</strong> {{ productDetails.productId }}
                            </div>
                            <div class="info-item" v-if="productDetails.size">
                                <strong>Size:</strong> {{ productDetails.size }}
                            </div>
                        </div>
                        <!-- Add to Cart Button -->
                        <div class="add-to-cart-section">
                            <button type="button" class="action-button primary"
                                :disabled="addingToCart"
                                @click="handleAddToCartClick()">
                                <span v-if="addingToCart" class="button-loading-state">
                                    <span class="button-spinner" aria-hidden="true"></span>
                                    Adding...
                                </span>
                                <span v-else>
                                    <i class="pi pi-shopping-cart"></i>
                                    Add to Cart
                                </span>
                            </button>
                        </div>
                    </template>
                </Card>
            </div>
            <div class="get-ai-suggestions-widget">
                <h3>Get AI suggested recipes that use {{ productDetails.description }}!</h3>
                <loading-spinner v-if="loadingRecipeSuggestion" message="Generating recipe suggestion..." />
                <button v-else-if="!recipeSuggestion" type="button"
                    class="action-button primary" @click="handleGetRecipeSuggestion()">
                    <i class="pi pi-sparkles"></i>
                    Get AI-generated recipes
                </button>
                <recipe-tile v-else :recipe="recipeSuggestion" :dialogVisible="dialogVisible"
                    @click="openRecipeDialog" />
            </div>
        </div>

        <div v-else class="error-container">
            <h2>Product Not Found</h2>
            <p>The requested product could not be found.</p>
        </div>
    </div>

    <recipe-ingredients-dialog :selectedRecipe="recipeSuggestion" :dialogVisible="dialogVisible"
        @close-dialog="closeRecipeDialog">
    </recipe-ingredients-dialog>
</template>

<style scoped lang="scss">
.product-page-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    min-height: 100vh;
}

.product-content {
    .product-header {
        margin-bottom: 30px;
        text-align: center;

        .product-title {
            font-size: 2.5rem;
            color: #333;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .product-price {
            .price-amount {
                font-size: 1.8rem;
                font-weight: bold;
                color: #4713a3;
            }

            .price-unit {
                font-size: 1rem;
                color: #666;
                margin-left: 8px;
            }
        }
    }

    .product-main-content {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 30px;

        @media (max-width: 768px) {
            grid-template-columns: 1fr;
        }
    }

    .get-ai-suggestions-widget {
        width: 100%;
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
        padding: 1.2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
    }
}

.action-button {
    border-radius: 16px;
    padding: 0.95rem 1.4rem;
    font-family: "Montserrat", sans-serif;
    font-size: 0.98rem;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 10px 22px rgba(41, 23, 74, 0.12);
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

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

    &.primary {
        border: none;
        background: linear-gradient(135deg, #4713a3 0%, #6f38d8 100%);
        color: #ffffff;
        box-shadow: 0 14px 30px rgba(71, 19, 163, 0.28);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;

        &:hover:not(:disabled) {
            box-shadow: 0 18px 34px rgba(71, 19, 163, 0.32);
            transform: translateY(-1px);
        }
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

.product-carousel-card {
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
    padding: 1.2rem;

    .product-carousel {
        .carousel-item {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 400px;

            .product-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }
        }
    }
}

.product-details-card {
    .categories-section {
        margin-bottom: 30px;

        h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 1.2rem;
        }

        .categories-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .category-chip {
                background: #f3f0ff;
                color: #4713a3;
                border: none;
                padding: 8px 12px;
                border-radius: 10px;
                box-shadow: 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
            }
        }
    }

    .product-info-section {
        border-radius: 18px;
        box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
        padding: 1.2rem;
        margin-bottom: 30px;

        .info-item {
            padding: 12px 0;
            border-bottom: 1px solid #eee;

            &:last-child {
                border-bottom: none;
            }

            strong {
                color: #333;
                margin-right: 8px;
            }
        }
    }

    .add-to-cart-section {
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
    }
}

.error-container {
    text-align: center;
    padding: 60px 20px;

    h2 {
        color: #333;
        margin-bottom: 15px;
    }

    p {
        color: #666;
        font-size: 1.1rem;
    }
}

// PrimeVue Component Overrides
:deep(.p-carousel) {
    .p-carousel-indicators {
        .p-carousel-indicator {
            button {
                background: #4713a3;
                border: none;

                &.p-highlight {
                    background: #3a0f8a;
                }
            }
        }
    }

    .p-carousel-prev,
    .p-carousel-next {
        background: rgba(71, 19, 163, 0.8);
        border: none;
        color: white;

        &:hover {
            background: rgba(58, 15, 138, 0.9);
        }
    }
}

:deep(.p-card) {
    border: none;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);

    .p-card-header {
        background: #f9fafb;
        border-bottom: 1px solid #f3f0ff;
        border-radius: 18px 18px 0 0;
        padding: 1.5rem;

        h2 {
            margin: 0;
            color: #333;
            font-size: 1.3rem;
        }
    }

    .p-card-content {
        padding: 1.5rem;
    }
}
</style>