<script setup lang="ts">
import { ref, computed } from 'vue';
import { authService } from '../services';
import { krogerStores } from '../constants';
import { sessionState } from '../state';
import Select from 'primevue/select';

const props = defineProps({
    redirectPage: {
        type: String,
        default: 'home'
    }
});

const storeOptions = Object.values(krogerStores);
const selectedStore = ref<{ label: string; value: string; image: string } | null>(null);

const connectLabel = computed(() => selectedStore.value ? `Connect to ${selectedStore.value.label}` : 'Connect Kroger');

const canConnect = computed(() => !!selectedStore.value);

function handleConnectClick() {
    if (!selectedStore.value) return;
    sessionState.setPendingKrogerStore(selectedStore.value.value);
    authService.redirectToGrocererAuthorization(selectedStore.value.value, props.redirectPage);
}
</script>

<template>
    <section class="kroger-alert" role="status" aria-live="polite">
        <div class="alert-icon" aria-hidden="true">
            <i class="pi pi-shopping-cart"></i>
        </div>

        <div class="alert-body">
            <p class="alert-title">Connect your Kroger account</p>
            <p class="alert-message">
                Link a Kroger account to search for grocery products and add recipe
                ingredients directly to your cart.
            </p>

            <div class="store-picker">
                <Select
                    v-model="selectedStore"
                    :options="storeOptions"
                    optionLabel="label"
                    placeholder="Pick your store first…"
                    class="store-select"
                    checkmark
                    :highlightOnSelect="false"
                >
                    <template #value="slotProps">
                        <div v-if="slotProps.value" class="store-option">
                            <img :src="slotProps.value.imageUrl" height="22px" width="36px" />
                            <span>{{ slotProps.value.label }}</span>
                        </div>
                        <span v-else>{{ slotProps.placeholder }}</span>
                    </template>
                    <template #option="slotProps">
                        <div class="store-option">
                            <img :src="slotProps.option.imageUrl" height="22px" width="36px" />
                            <span>{{ slotProps.option.label }}</span>
                        </div>
                    </template>
                </Select>
            </div>
        </div>

        <button
            type="button"
            class="alert-action"
            :disabled="!canConnect"
            @click="handleConnectClick"
        >
            {{ connectLabel }}
            <i class="pi pi-external-link"></i>
        </button>
    </section>
</template>

<style scoped lang="scss">
.kroger-alert {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid #c9b4f5;
    border-radius: 14px;
    background: linear-gradient(135deg, #f5f0ff 0%, #ebe0ff 100%);
    box-shadow: 0 10px 24px rgba(71, 19, 163, 0.08);
    color: #3a1480;
    font-family: "Montserrat", sans-serif;
}

.alert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    background: rgba(71, 19, 163, 0.12);

    i {
        font-size: 1.1rem;
        color: #4713a3;
    }
}

.alert-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
}

.alert-title {
    margin: 0;
    font-size: 1rem;
    font-weight: 700;
    color: #3a1480;
}

.alert-message {
    margin: 0;
    font-size: 0.93rem;
    line-height: 1.55;
    color: #5a3c9e;
}

.store-picker {
    margin-top: 0.6rem;
}

.store-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.alert-action {
    flex-shrink: 0;
    align-self: center;
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    border: none;
    border-radius: 999px;
    padding: 0.75rem 1.1rem;
    background: linear-gradient(90deg, #4713a3 60%, #6e3ff3 100%);
    color: #fff;
    font-family: "Montserrat", sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

    i {
        font-size: 0.85rem;
    }

    &:hover:not(:disabled) {
        box-shadow: 0 8px 20px rgba(71, 19, 163, 0.28);
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 3px solid rgba(71, 19, 163, 0.28);
        outline-offset: 3px;
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
}

/* Store select inside alert */
:deep(.store-select) {
    width: 100%;
    font-family: "Montserrat", sans-serif;

    &.p-select {
        border: 1.5px solid #c9b4f5;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.75);
        transition: border-color 0.2s;

        &:hover {
            border-color: #a084e8;
        }

        &.p-focus {
            border-color: #4713a3;
            box-shadow: 0 0 0 3px rgba(71, 19, 163, 0.1);
        }
    }

    .p-select-label {
        padding: 0.55rem 0.85rem;
        font-size: 0.9rem;
        font-family: "Montserrat", sans-serif;
        color: #3a1480;
    }

    .p-select-label.p-placeholder {
        color: #9b8bb5;
    }

    .p-select-dropdown {
        margin-right: 10px;
    }
}

@media (max-width: 640px) {
    .kroger-alert {
        flex-direction: column;
    }

    .alert-action {
        width: 100%;
        justify-content: center;
    }
}
</style>
