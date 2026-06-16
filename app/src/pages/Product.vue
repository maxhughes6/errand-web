<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Carousel from 'primevue/carousel';
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

onMounted(async () => {
  try {
    const product = await krogerService.getProductByUpc(productId);
    productDetails.value = product;
  } catch (error) {
  } finally {
    loading.value = false;
  }

  const storedRecipe = window.sessionStorage.getItem(`recipe-${productId}`);
  if (storedRecipe) {
    recipeSuggestion.value = JSON.parse(storedRecipe);
  }
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
  try {
    await krogerService.addToCart([{ upc: productDetails.value.upc, quantity: 1, modality: 'PICKUP' }]);
    toast.add({ severity: 'success', summary: 'Added to Cart', detail: 'Product added to cart successfully! Remember to check out on the Kroger website.', life: 5000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product to cart. Please try again.', life: 5000 });
  } finally {
    addingToCart.value = false;
  }
}

const openRecipeDialog = () => { dialogVisible.value = true; };
const closeRecipeDialog = () => { dialogVisible.value = false; };
</script>

<template>
  <div class="product-page">
    <loading-spinner v-if="loading" message="Loading product details…" />

    <template v-else-if="productDetails">
      <!-- Header -->
      <header class="product-header">
        <h1 class="product-title">{{ productDetails.description || 'Product Details' }}</h1>
      </header>

      <!-- Main two-column layout -->
      <div class="product-grid">
        <!-- Image carousel -->
        <div class="product-carousel-panel">
          <Carousel
            :value="productDetails.imageUrls"
            :numVisible="1"
            :numScroll="1"
            :autoplayInterval="5000"
            :showNavigators="true"
            :showIndicators="true"
            class="product-carousel"
          >
            <template #item="slotProps">
              <div class="carousel-item">
                <img :src="slotProps.data" :alt="productDetails.description" class="carousel-img" />
              </div>
            </template>
          </Carousel>
        </div>

        <!-- Product info panel -->
        <div class="product-info-panel">
          <div class="info-header">
            <h2 class="info-heading">Product Information</h2>
          </div>

          <!-- Categories -->
          <div v-if="productDetails.categories" class="categories-section">
            <p class="section-label">Categories</p>
            <div class="categories-list">
              <span
                v-for="category in productDetails.categories"
                :key="category"
                class="category-tag"
              >{{ category }}</span>
            </div>
          </div>

          <!-- Details -->
          <div class="details-list">
            <div v-if="productDetails.brand" class="detail-row">
              <span class="detail-key">Brand</span>
              <span class="detail-val">{{ productDetails.brand }}</span>
            </div>
            <div v-if="productDetails.productId" class="detail-row">
              <span class="detail-key">Product ID</span>
              <span class="detail-val">{{ productDetails.productId }}</span>
            </div>
            <div v-if="productDetails.size" class="detail-row">
              <span class="detail-key">Size</span>
              <span class="detail-val">{{ productDetails.size }}</span>
            </div>
          </div>

          <!-- Add to cart -->
          <div class="cart-section">
            <button
              type="button"
              class="action-btn action-btn--primary"
              :disabled="addingToCart"
              @click="handleAddToCartClick()"
            >
              <span v-if="addingToCart" class="btn-loading">
                <span class="btn-spinner" aria-hidden="true"></span>
                Adding…
              </span>
              <span v-else>
                <i class="pi pi-shopping-cart" aria-hidden="true"></i>
                Add to Cart
              </span>
            </button>
          </div>
        </div>
      </div>

      <!-- AI recipe suggestions -->
      <section class="suggestions-widget">
        <h2 class="suggestions-heading">
          Get AI recipe ideas using <em>{{ productDetails.description }}</em>
        </h2>

        <loading-spinner v-if="loadingRecipeSuggestion" message="Generating recipe suggestion…" />

        <button
          v-else-if="!recipeSuggestion"
          type="button"
          class="action-btn action-btn--primary"
          @click="handleGetRecipeSuggestion()"
        >
          <i class="pi pi-sparkles" aria-hidden="true"></i>
          Get AI-generated recipes
        </button>

        <recipe-tile
          v-else
          :recipe="recipeSuggestion"
          @click="openRecipeDialog"
        />
      </section>
    </template>

    <div v-else class="error-state">
      <h2 class="error-heading">Product Not Found</h2>
      <p class="error-sub">The requested product could not be found.</p>
    </div>
  </div>

  <recipe-ingredients-dialog
    :selectedRecipe="recipeSuggestion"
    :dialogVisible="dialogVisible"
    @close-dialog="closeRecipeDialog"
  />
</template>

<style scoped lang="scss">
/* ─── Page layout ────────────────────────────────────────── */
.product-page {
  width: 100%;
  max-width: 1100px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* ─── Header ─────────────────────────────────────────────── */
.product-title {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.15;
}

/* ─── Two-col grid ───────────────────────────────────────── */
.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  align-items: start;
}

/* ─── Carousel panel ─────────────────────────────────────── */
.product-carousel-panel {
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.carousel-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 380px;
  padding: var(--space-md);
}

.carousel-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

/* ─── Info panel ─────────────────────────────────────────── */
.product-info-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  overflow: hidden;
}

.info-header {
  padding: var(--space-md) var(--space-lg);
  border-bottom: 1px solid var(--color-rule);
  background: var(--color-paper-2);
}

.info-heading {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
}

/* Categories */
.categories-section {
  padding: 0 var(--space-lg);
}

.section-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  margin: 0 0 var(--space-xs);
}

.categories-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.category-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: capitalize;
  padding: 0.25rem 0.7rem;
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  color: var(--color-accent-2);
}

/* Details */
.details-list {
  padding: 0 var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: 0;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-sm);
  padding: var(--space-xs) 0;
  border-bottom: 1px solid var(--color-rule);
  font-family: var(--font-body);
  font-size: var(--text-sm);

  &:last-child { border-bottom: none; }
}

.detail-key {
  font-weight: 700;
  color: var(--color-ink);
  flex-shrink: 0;
}

.detail-val {
  color: var(--color-ink-2);
  text-align: right;
}

/* Add to cart */
.cart-section {
  padding: var(--space-xs) var(--space-lg) var(--space-lg);
}

/* ─── Action buttons ─────────────────────────────────────── */
.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  border-radius: var(--radius-btn);
  padding: 0.95rem 1.4rem;
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);
  transition: background-color var(--dur-micro) var(--ease-out);

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}

.action-btn--primary {
  background: var(--color-accent);
  color: var(--color-accent-ink);
  border: none;

  &:hover:not(:disabled) {
    background: oklch(54% 0.22 42);
  }
}

/* ─── Button spinner ─────────────────────────────────────── */
.btn-loading {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
}

.btn-spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid oklch(98% 0.005 85 / 0.4);
  border-top-color: var(--color-accent-ink);
  border-radius: 50%;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── AI suggestions widget ──────────────────────────────── */
.suggestions-widget {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
}

.suggestions-heading {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;

  em {
    font-style: normal;
    color: var(--color-accent);
  }
}

/* ─── Error state ────────────────────────────────────────── */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-2xl);
  text-align: center;
}

.error-heading {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  margin: 0;
}

.error-sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 768px) {
  .product-grid { grid-template-columns: 1fr; }
  .carousel-item { height: 280px; }
}

@media (max-width: 600px) {
  .product-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}

/* ─── PrimeVue Carousel overrides ────────────────────────── */
:deep(.p-carousel-indicators .p-carousel-indicator button) {
  background: var(--color-rule);
  border: none;
  border-radius: var(--radius-pill);

  &.p-highlight { background: var(--color-accent); }
}

:deep(.p-carousel-prev),
:deep(.p-carousel-next) {
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: 50%;
  color: var(--color-ink);

  &:hover { background: var(--color-paper-2); }
}
</style>
