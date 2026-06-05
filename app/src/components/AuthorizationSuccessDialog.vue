<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const isVisible = computed(() => route.query.auth === 'success');

function closeDialog() {
    const nextQuery = { ...route.query };
    delete nextQuery.auth;

    router.replace({
        path: route.path,
        query: nextQuery,
        hash: route.hash
    });
}
</script>

<template>
    <div v-if="isVisible" class="authorization-success-overlay" @click.self="closeDialog">
        <section class="authorization-success-dialog" role="dialog" aria-modal="true"
            aria-labelledby="authorization-success-title">
            <div class="success-icon" aria-hidden="true">
                <i class="pi pi-check"></i>
            </div>
            <h2 id="authorization-success-title">Thanks for authorizing!</h2>
            <p>
                You've given Errand access to add items to your Kroger cart for the next 24 hours! Please note that
                <strong>each sign-in essentially resets this 24 hour timer.</strong>
                To check out the items added to your cart, you'll need to head to the Kroger website or app and complete the checkout process there. Happy shopping!
            </p>
            <button type="button" class="dialog-button" @click="closeDialog">
                Okay!
            </button>
        </section>
    </div>
</template>

<style scoped lang="scss">
.authorization-success-overlay {
    position: fixed;
    inset: 0;
    z-index: 1200;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    background: rgba(14, 24, 19, 0.45);
    backdrop-filter: blur(4px);
}

.authorization-success-dialog {
    width: min(100%, 38rem);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
    padding: 2.75rem 2.5rem 2rem;
    border-radius: 28px;
    background: #ffffff;
    box-shadow: 0 24px 60px rgba(15, 38, 26, 0.16);
    text-align: center;

    h2 {
        margin: 0;
        color: #11452d;
        font-family: "Montserrat", sans-serif;
        font-size: 2rem;
        font-weight: 700;
    }

    p {
        margin: 0;
        color: #325342;
        font-family: "Montserrat", sans-serif;
        max-width: 30rem;
        font-size: 1.08rem;
        line-height: 1.7;
    }
}

.success-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 4.75rem;
    height: 4.75rem;
    border-radius: 999px;
    border: 1.5px solid #1f8f4d;
    background: #1f8f4d;

    :deep(.pi) {
        color: #ffffff;
        font-size: 2.35rem;
        line-height: 1;
    }
}

.dialog-button {
    width: 100%;
    border: none;
    border-radius: 16px;
    padding: 1rem 1.4rem;
    background: #1f8f4d;
    color: #ffffff;
    font-family: "Montserrat", sans-serif;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

    &:hover {
        background: #18713d;
        box-shadow: 0 10px 24px rgba(31, 143, 77, 0.24);
        transform: translateY(-1px);
    }

    &:focus-visible {
        outline: 3px solid rgba(31, 143, 77, 0.25);
        outline-offset: 3px;
    }
}

@media (max-width: 640px) {
    .authorization-success-dialog {
        width: min(100%, 34rem);
        padding: 2rem 1.25rem 1.25rem;

        h2 {
            font-size: 1.6rem;
        }

        p {
            font-size: 0.95rem;
        }
    }
}
</style>