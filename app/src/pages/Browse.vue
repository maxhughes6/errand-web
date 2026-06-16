<script setup>
import { ref, defineModel, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { krogerService } from '../services';
import { LoadingSpinner, ReauthorizationAlert, KrogerConnectionAlert } from "../components";
import { sessionState, userState } from '../state';
import { useToast } from "primevue/usetoast";

const router = useRouter();
const toast = useToast();
const isKrogerAccountConnected = ref(sessionState.getIsKrogerAccountConnected());
const mustReauthorize = ref(sessionState.getMustReauthorize());

const query = defineModel('query');
let products = ref([]);
let loadingProducts = ref(false);
let hasSearched = ref(false);

async function getProducts() {
  if (!query.value || query.value.trim() === '') {
    toast.add({ severity: 'warn', summary: 'Invalid Search', detail: 'Please enter a search term.', life: 3000 });
    return;
  }

  hasSearched.value = true;
  loadingProducts.value = true;
  let krogerProducts = await krogerService.getProducts(query.value, 12, 0);
  loadingProducts.value = false;

  if (krogerProducts.length === 0) {
    toast.add({ severity: 'info', summary: 'No Products Found', detail: 'No products found for your search term.', life: 3000 });
  } else {
    products.value = krogerProducts;
    window.sessionStorage.setItem('products', JSON.stringify(products.value));
    window.sessionStorage.setItem('query', query.value);
  }
}

function handleProductTileClick(productId) {
  router.push('browse/' + productId);
}

onMounted(() => {
  const storedProducts = window.sessionStorage.getItem('products');
  products.value = storedProducts ? JSON.parse(storedProducts) : [];
  hasSearched.value = !!storedProducts;

  const storedQuery = window.sessionStorage.getItem('query');
  query.value = storedQuery ?? '';
});
</script>

<template>
  <div class="browse-page">
    <header class="browse-header">
      <h1 class="browse-heading">Browse Products</h1>
      <p class="browse-sub">Shop the catalogue, or click a product to get AI recipe ideas built around it.</p>
    </header>

    <kroger-connection-alert redirect-page="browse" v-if="!isKrogerAccountConnected" />
    <reauthorization-alert redirect-page="browse" v-else-if="mustReauthorize" />

    <div v-else class="browse-body">
      <div class="search-wrap">
        <input
          type="text"
          v-model="query"
          placeholder="Search products…"
          class="search-input"
          name="query"
          @keydown.enter="getProducts"
          aria-label="Product search"
        />
        <button class="search-btn" @click="getProducts" aria-label="Search">
          <i class="pi pi-search" aria-hidden="true"></i>
        </button>
      </div>

      <loading-spinner v-if="loadingProducts" message="Loading products…" />

      <div class="products-grid" v-else-if="products && products.length">
        <div
          v-for="product in products"
          :key="product.productId"
          class="product-tile"
          @click="handleProductTileClick(product.productId)"
          role="button"
          tabindex="0"
          @keydown.enter="handleProductTileClick(product.productId)"
        >
          <div class="product-img-wrap">
            <img :src="product.imageUrls[0]" alt="" aria-hidden="true" width="80" height="80" loading="lazy" />
          </div>
          <div class="product-info">
            <h2 class="product-name">{{ product.description }}</h2>
            <span class="product-size">{{ product.size }}</span>
          </div>
          <span class="product-arrow" aria-hidden="true">→</span>
        </div>
      </div>

      <p v-else-if="!loadingProducts && hasSearched" class="browse-empty">
        No products yet — search for something above.
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.browse-page {
  width: 100%;
  max-width: 1100px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ─── Header ─────────────────────────────────────────────── */
.browse-heading {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-2xs);
}

.browse-sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Search ─────────────────────────────────────────────── */
.browse-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
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

/* ─── Products grid ──────────────────────────────────────── */
.products-grid {
  display: grid;
  gap: var(--space-sm);
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.product-tile {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  cursor: pointer;
  transition:
    transform var(--dur-short) var(--ease-out),
    box-shadow var(--dur-short) var(--ease-out),
    border-color var(--dur-micro) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px oklch(20% 0.012 50 / 0.07);
    border-color: var(--color-accent);

    .product-arrow { color: var(--color-accent); transform: translateX(3px); }
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.product-img-wrap {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-paper-2);
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.product-info {
  flex: 1;
  min-width: 0;
}

.product-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
  margin: 0 0 var(--space-3xs);
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.product-size {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

.product-arrow {
  flex-shrink: 0;
  color: var(--color-rule);
  font-size: var(--text-md);
  transition:
    color var(--dur-micro) var(--ease-out),
    transform var(--dur-short) var(--ease-out);
}

.browse-empty {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 900px) {
  .products-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 600px) {
  .products-grid { grid-template-columns: 1fr; }
  .browse-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}
</style>
