import { authenticatedFetch } from './authenticatedFetch';
import { KrogerAddToCartRequestObject } from '../models/models';

const ERRAND_API_BASE_URL = import.meta.env.VITE_ERRAND_API_BASE_URL;

export const krogerService = {
    async getProducts(term: string, limit: number = 12, offset: number = 0) {
        const searchParams = new URLSearchParams();
        searchParams.append("term", term);
        searchParams.append("limit", limit.toString());
        searchParams.append("offset", offset.toString());

        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/products?${searchParams.toString()}`);

        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }

        return await response.json();
    },

    async getProductByUpc(upc: string) {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/products/${upc}`);

        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }

        return await response.json();
    },

    async getIngredientsList(terms: string[]) {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/products/ingredients-list?terms=${terms.toString()}`);

        if (!response.ok) {
            throw new Error(`Error fetching ingredients list: ${response.statusText}`);
        }

        return await response.json();
    },

    async addToCart(products: KrogerAddToCartRequestObject[]): Promise<void> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/cart/items`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ products: products })
        });

        if (!response.ok) {
            throw new Error(`Error calling addToCart -- Response status: ${response.status}`);
        }
    }
};