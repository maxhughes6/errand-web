<script setup lang="ts">
import { authService } from '../services';
import { userState } from '../state';

const props = defineProps({
    redirectPage: {
        type: String,
        required: true
    }
});

function handleReauthorizeClick() {
    const user = userState.getUser();
    const preferredStore = user?.errandUserData?.preferredStore || '';
    authService.redirectToGrocererAuthorization(preferredStore, props.redirectPage);
}
</script>

<template>
    <section class="reauthorization-alert" role="alert" aria-live="polite">
        <div class="alert-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false">
                <path
                    d="M12 3.5L21 19a1 1 0 0 1-.87 1.5H3.87A1 1 0 0 1 3 19L12 3.5Zm0 4.25a.75.75 0 0 0-.75.75v5.75a.75.75 0 0 0 1.5 0V8.5A.75.75 0 0 0 12 7.75Zm0 10.5a1.02 1.02 0 1 0 0-2.04 1.02 1.02 0 0 0 0 2.04Z"
                />
            </svg>
        </div>
        <div class="alert-copy">
            <p class="alert-title">Reauthorization required</p>
            <p class="alert-message">
                You will need to reauthorize Errand to access your Kroger cart to continue adding items to your cart.
            </p>
        </div>
        <button type="button" class="alert-action" @click="handleReauthorizeClick">
            Reauthorize now
        </button>
    </section>
</template>

<style scoped lang="scss">
.reauthorization-alert {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border: 1px solid #f1c453;
    border-radius: 14px;
    background: #fff7dd;
    box-shadow: 0 10px 24px rgba(177, 121, 0, 0.12);
    color: #5b4300;
}

.alert-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    svg {
        width: 2.0rem;
        height: 2.0rem;
        fill: #b77900;
    }
}

.alert-copy {
    flex: 1;
    min-width: 0;
}

.alert-title,
.alert-message {
    margin: 0;
    font-family: "Montserrat", sans-serif;
}

.alert-title {
    font-size: 1rem;
    font-weight: 700;
}

.alert-message {
    margin-top: 0.25rem;
    font-size: 0.95rem;
    line-height: 1.5;
    color: #705200;
}

.alert-action {
    border: none;
    border-radius: 999px;
    padding: 0.8rem 1.1rem;
    background: #b77900;
    color: #fffdf6;
    font-family: "Montserrat", sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;

    &:hover {
        background: #9e6700;
        box-shadow: 0 8px 20px rgba(158, 103, 0, 0.24);
    }

    &:focus-visible {
        outline: 3px solid rgba(183, 121, 0, 0.28);
        outline-offset: 3px;
    }
}

@media (max-width: 720px) {
    .reauthentication-alert {
        flex-direction: column;
        align-items: flex-start;
    }

    .alert-action {
        width: 100%;
    }
}
</style>