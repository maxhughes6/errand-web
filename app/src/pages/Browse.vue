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

async function getProducts() {
    if (!query.value || query.value.trim() === '') {
        toast.add({ severity: 'warn', summary: 'Invalid Search', detail: 'Please enter a search term.', life: 3000 });
        return;
    }

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
    if (storedProducts) {
        products.value = JSON.parse(storedProducts);
    } else {
        products.value = [];
    }

    const storedQuery = window.sessionStorage.getItem('query');
    if (storedQuery) {
        query.value = storedQuery;
    } else {
        query.value = '';
    }
});

</script>

<template>
    <div id="container">
        <h1 class="browse-page-header">Browse Products</h1>
        <p>Shop the old school way, or click on a product and get recipe suggestions that use it!</p>
        <kroger-connection-alert redirect-page="browse" v-if="!isKrogerAccountConnected" />
        <reauthorization-alert redirect-page="browse" v-else-if="mustReauthorize" />
        <div v-else class="product-search-container">
            <div class="search-container">
                <input type="text" v-model="query" placeholder="Search products..." class="products-search-input"
                    name="query">
                <button class="search-button" @click="getProducts()">
                    <i class="pi pi-search"></i>
                </button>
            </div>
            <loading-spinner v-if="loadingProducts" message="Loading products..." />
            <div class="browse-items-container" v-else-if="products">
                <div v-for="product in products" class="product-tile"
                    @click="handleProductTileClick(product.productId)">
                    <img :src="product.imageUrls[0]" height="100px" width="100px" />
                    <div>
                        <h5>{{ product.description }}</h5>
                        <span class="product-size">{{ product.size }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
#container {
    min-height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.browse-page-header {
    font-family: "Montserrat", sans-serif;
    font-size: 2rem;
    margin-top: 70px;
    margin-bottom: 20px;
}

.browse-items-container {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    margin-top: 50px;
    width: 80%;
}

.product-search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
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

    svg {
      width: 18px;
      height: 18px;
    }

    &:hover {
        background-color: #6e3ff3;
    }
}

.search-container {
    position: relative;
    display: flex;
    width: min(100%, 640px);
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-top: 25px;
}

.product-tile {
    font-family: "Montserrat", sans-serif;
    border-radius: 18px;
    box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
    padding: 1.2rem;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;

    h5 {
        margin: 5px
    }

    .product-size {
        margin-left: 8px;
        font-weight: 500;
    }
}

.product-tile:hover {
    background-color: #f3f0ff;
}

.products-search-input {
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
</style>