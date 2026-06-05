<script setup lang="ts">
import { Recipe } from '../models';

defineProps<{
    selectedRecipe: Recipe;
    dialogVisible: boolean;
}>();

const emit = defineEmits(['close-dialog']);

const closeDialog = () => {
    emit('close-dialog');
};
</script>

<template>
    <div v-if="dialogVisible && selectedRecipe" class="instructions-dialog-overlay" @click.self="closeDialog">
        <section class="instructions-dialog" role="dialog" aria-modal="true"
            aria-labelledby="instructions-dialog-title">
            <div class="instructions-dialog-shell">
                <header class="instructions-dialog-header">
                    <div class="instructions-icon" aria-hidden="true">
                        <i class="pi pi-book"></i>
                    </div>
                    <div class="instructions-dialog-heading">
                        <h2 id="instructions-dialog-title">
                            {{ selectedRecipe.recipeName }} instructions
                        </h2>
                    </div>
                </header>

                <div class="instructions-dialog-body">
                    <p v-if="selectedRecipe.instructions" class="instructions-content">
                        {{ selectedRecipe.instructions }}
                    </p>
                    <p v-else class="empty-state">
                        No instructions available for this recipe yet.
                    </p>
                </div>

                <footer class="instructions-dialog-footer">
                    <button type="button" class="dialog-button secondary" @click="closeDialog()">
                        Close
                    </button>
                </footer>
            </div>
        </section>
    </div>
</template>

<style scoped lang="scss">
.instructions-dialog-overlay {
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

.instructions-dialog {
    width: min(100%, 46rem);
    max-height: min(88vh, 54rem);
    border-radius: 28px;
    background: #ffffff;
    box-shadow: 0 24px 60px rgba(41, 23, 74, 0.2);
    overflow: hidden;
}

.instructions-dialog-shell {
    display: flex;
    flex-direction: column;
    min-height: 0;
    max-height: min(88vh, 54rem);
}

.instructions-dialog-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.75rem 2.5rem 1.5rem;
    text-align: center;
}

.instructions-icon {
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

.instructions-dialog-heading {
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
}

.instructions-dialog-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding: 0 2.5rem 1.5rem;
}

.instructions-content {
    margin: 0;
    color: #325342;
    font-family: "Montserrat", sans-serif;
    font-size: 1.05rem;
    line-height: 1.7;
    white-space: pre-wrap;
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

.instructions-dialog-footer {
    flex-shrink: 0;
    display: flex;
    justify-content: flex-end;
    gap: 0.9rem;
    padding: 1rem 2.5rem 1.5rem;
    background: #ffffff;
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
}

.dialog-button.primary {
    border: none;
    background: linear-gradient(135deg, #4713a3 0%, #6f38d8 100%);
    color: #ffffff;
    box-shadow: 0 14px 30px rgba(71, 19, 163, 0.28);

    &:hover {
        box-shadow: 0 18px 34px rgba(71, 19, 163, 0.32);
        transform: translateY(-1px);
    }
}

.dialog-button.secondary {
    border: 1px solid #d8c9f8;
    background: #ffffff;
    color: #4f2a9d;
    box-shadow: 0 10px 24px rgba(71, 19, 163, 0.18);

    &:hover {
        background: #f7f2ff;
        border-color: #bea5f2;
        box-shadow: 0 14px 28px rgba(71, 19, 163, 0.22);
        transform: translateY(-1px);
    }
}

@media (max-width: 640px) {
    .instructions-dialog {
        width: min(100%, 34rem);
        max-height: min(92vh, 54rem);
    }

    .instructions-dialog-header {
        padding: 2rem 1.25rem 1.25rem;

        h2 {
            font-size: 1.6rem;
        }
    }

    .instructions-dialog-body {
        padding: 0 1.25rem 1.25rem;
    }

    .instructions-dialog-footer {
        padding: 1rem 1.25rem 1.25rem;
        background: none;
        background-color: transparent;
    }

    .dialog-button {
        width: 100%;
    }
}
</style>
