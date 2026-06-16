<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import { krogerService } from '../services';
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
    const ingredients = recipe.ingredients.map(ingredient =>
      `${props.dietaryPreferences.join(' ')} ${ingredient.name}`.trim()
    );
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
  if (numberOfItems.value === 0) closeDialog();
}

async function handleAddItemsToCartClick() {
  if (isAddingToCart.value || !ingredientsList.value.length) return;

  const numItemsAdded = ingredientsList.value.length;
  const itemsToAdd = ingredientsList.value.map(item => ({
    upc: item.upc,
    quantity: 1,
    modality: "PICKUP"
  }));

  isAddingToCart.value = true;
  try {
    await krogerService.addToCart(itemsToAdd);
    closeDialog();
    toast.add({
      severity: 'success',
      summary: 'Added to Cart',
      detail: `${numItemsAdded} items added to cart successfully! Remember to check out on the Kroger website.`,
      life: 5000
    });
  } finally {
    isAddingToCart.value = false;
  }
}
</script>

<template>
  <div
    v-if="dialogVisible && selectedRecipe"
    class="dialog-overlay"
    @click.self="closeDialog"
  >
    <section
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="recipe-dialog-title"
    >
      <!-- Header -->
      <header class="dialog-header">
        <div class="cart-icon" aria-hidden="true">
          <i class="pi pi-cart-arrow-down"></i>
        </div>
        <div class="dialog-heading">
          <h2 id="recipe-dialog-title" class="dialog-title">{{ selectedRecipe.recipeName }}</h2>
          <p class="dialog-sub" v-if="krogerConnected">
            Review the ingredients below, remove anything you don't need, then add the rest to your cart.
          </p>
          <p class="dialog-sub" v-else>
            Here are the ingredients for this recipe. Connect your Kroger account to add them to your cart.
          </p>
        </div>
      </header>

      <!-- Body -->
      <div class="dialog-body">
        <loading-spinner v-if="isLoading" message="One sec, grabbing those items for you…" />

        <template v-else>
          <!-- Tags -->
          <div v-if="selectedRecipe.tags?.length" class="dialog-tags">
            <span v-for="tag in selectedRecipe.tags" :key="tag" class="dialog-tag">{{ tag }}</span>
          </div>

          <!-- Ingredients -->
          <div class="ingredients-section">
            <div class="ingredients-summary">
              <h3 class="ingredients-heading">{{ krogerConnected ? 'Add ingredients to cart' : 'Ingredients' }}</h3>
              <span class="ingredients-count">{{ numberOfItems }} {{ numberOfItems === 1 ? 'item' : 'items' }}</span>
            </div>

            <ul v-if="ingredientsList.length" class="ingredients-list">
              <li
                v-for="ingredient in ingredientsList"
                :key="ingredient.upc || ingredient.name"
                class="ingredient-item"
              >
                <div class="ingredient-main">
                  <div v-if="ingredient.imageUrls?.[0]" class="ingredient-img-wrap">
                    <img :src="ingredient.imageUrls[0]" :alt="ingredient.name" class="ingredient-img" />
                  </div>
                  <div class="ingredient-copy">
                    <p class="ingredient-name">{{ ingredient.name }}</p>
                    <span class="ingredient-desc">{{ ingredient.description }}</span>
                  </div>
                </div>
                <button
                  v-if="krogerConnected"
                  type="button"
                  class="remove-btn"
                  :aria-label="`Remove ${ingredient.name}`"
                  @click="handleRemoveItemClick(ingredient.upc)"
                >
                  <i class="pi pi-times" aria-hidden="true"></i>
                </button>
              </li>
            </ul>

            <p v-else class="ingredients-empty">No ingredients left to add for this recipe.</p>
          </div>

          <!-- Kroger connection prompt -->
          <kroger-connection-alert
            v-if="!krogerConnected"
            redirect-page="recipes"
            class="dialog-kroger-alert"
          />

          <!-- Actions -->
          <div class="dialog-actions">
            <button type="button" class="btn-secondary" @click="closeDialog()">
              Close
            </button>
            <button
              v-if="krogerConnected"
              type="button"
              class="btn-primary"
              :disabled="!numberOfItems || isLoading || isAddingToCart"
              @click="handleAddItemsToCartClick()"
            >
              <span v-if="isAddingToCart" class="btn-loading">
                <span class="btn-spinner" aria-hidden="true"></span>
                Adding items…
              </span>
              <span v-else>
                Add {{ numberOfItems }} {{ numberOfItems === 1 ? 'item' : 'items' }} to cart
              </span>
            </button>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
/* ─── Overlay ─────────────────────────────────────────────── */
.dialog-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-lg);
  background: oklch(20% 0.012 50 / 0.48);
  backdrop-filter: blur(6px);
}

/* ─── Dialog shell ───────────────────────────────────────── */
.dialog {
  width: min(100%, 46rem);
  max-height: min(88vh, 54rem);
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  box-shadow: 0 24px 60px oklch(20% 0.012 50 / 0.14);
  overflow: hidden;
}

/* ─── Header ─────────────────────────────────────────────── */
.dialog-header {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) var(--space-xl) var(--space-lg);
  text-align: center;
}

.cart-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.25rem;
  height: 4.25rem;
  border-radius: 50%;
  background: var(--color-accent-dim);
  border: 1px solid oklch(62% 0.22 42 / 0.25);
  color: var(--color-accent);
  font-size: 1.9rem;
}

.dialog-heading {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.dialog-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0;
}

.dialog-sub {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.6;
  margin: 0;
}

/* ─── Scrollable body ─────────────────────────────────────── */
.dialog-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-lg) var(--space-xl) var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

/* ─── Tags ───────────────────────────────────────────────── */
.dialog-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2xs);
}

.dialog-tag {
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

/* ─── Ingredients ─────────────────────────────────────────── */
.ingredients-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.ingredients-summary {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: var(--space-sm);
}

.ingredients-heading {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
}

.ingredients-count {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink-2);
}

.ingredients-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  margin: 0;
  padding: 0;
  list-style: none;
}

.ingredient-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  transition: border-color var(--dur-micro) var(--ease-out);

  &:hover { border-color: oklch(80% 0.012 85); }
}

.ingredient-main {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  min-width: 0;
  flex: 1;
}

.ingredient-img-wrap {
  flex-shrink: 0;
  width: 3.75rem;
  height: 3.75rem;
  border-radius: 10px;
  background: var(--color-paper-2);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ingredient-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.ingredient-copy {
  display: flex;
  flex-direction: column;
  gap: var(--space-3xs);
  min-width: 0;
}

.ingredient-name {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0;
  overflow-wrap: anywhere;
}

.ingredient-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.5;
}

.remove-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-rule);
  border-radius: 50%;
  background: var(--color-paper);
  color: var(--color-ink-2);
  font-size: 0.7rem;
  cursor: pointer;
  transition:
    background var(--dur-micro) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out),
    color var(--dur-micro) var(--ease-out),
    transform var(--dur-micro) var(--ease-out);

  &:hover {
    background: var(--color-error-bg);
    border-color: var(--color-error);
    color: var(--color-error);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.ingredients-empty {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  text-align: center;
  padding: var(--space-lg);
  background: var(--color-paper-2);
  border-radius: var(--radius-card);
  margin: 0;
}

/* ─── Kroger alert spacing ────────────────────────────────── */
.dialog-kroger-alert { margin-top: var(--space-xs); }

/* ─── Actions ─────────────────────────────────────────────── */
.dialog-actions {
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  gap: var(--space-sm);
  padding-top: var(--space-md);
  margin-top: auto;
}

.btn-primary,
.btn-secondary {
  padding: 0.95rem 1.4rem;
  border-radius: var(--radius-btn);
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

.btn-secondary {
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
  color: var(--color-ink);

  &:hover:not(:disabled) { background: oklch(88% 0.018 88); }
}

.btn-primary {
  background: var(--color-accent);
  border: none;
  color: var(--color-accent-ink);

  &:hover:not(:disabled) { background: oklch(54% 0.22 42); }
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

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 640px) {
  .dialog {
    width: min(100%, 34rem);
    max-height: min(92vh, 54rem);
  }

  .dialog-header { padding: var(--space-xl) var(--space-md) var(--space-md); }
  .dialog-body { padding: var(--space-md); }

  .dialog-title { font-size: var(--text-lg); }
  .dialog-sub { font-size: var(--text-xs); }

  .ingredients-summary { flex-direction: column; align-items: flex-start; }
  .ingredient-item { align-items: flex-start; }
  .ingredient-main { align-items: flex-start; }

  .dialog-actions {
    flex-direction: column-reverse;

    .btn-primary,
    .btn-secondary { width: 100%; justify-content: center; }
  }
}
</style>
