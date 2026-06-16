<script setup lang="ts">
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import '@aws-amplify/ui-vue/styles.css';
import { Hub } from 'aws-amplify/utils';
import { watch, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { userState, sessionState } from "../state";
import { amplifyAuthService } from "../amplify/amplifyAuthService";
import { authService as errandAuthService } from "../services/authService";

const formFields = {
    signIn: {
        username: {
            placeholder: "Enter your email",
            isRequired: true,
        },
        password: {
            placeholder: "Enter your password",
            isRequired: true,
        },
    },
    signUp: {
        preferred_username: {
            placeholder: "What should we call you?",
            isRequired: true,
            order: 1
        },
        email: {
            placeholder: "Enter your email",
            isRequired: true,
            order: 2
        },
        phone_number: {
            placeholder: "Enter your phone number",
            isRequired: true,
            order: 3
        },
        password: {
            placeholder: "Create a password",
            isRequired: true,
            order: 4
        }
    },
}

const emit = defineEmits(['signingIn']);
const router = useRouter();
const auth = useAuthenticator();

watch(() => auth.route, (route) => {
    if (route === 'signUp' || route === 'confirmSignUp') {
        sessionStorage.setItem('pendingNewSignup', 'true');
    }
});

const unsubscribeHub = Hub.listen('auth', async ({ payload }) => {
    if (payload.event !== 'signedIn') return;

    emit('signingIn');

    const user = await amplifyAuthService.getCurrentUser();
    userState.setUser({
        email: user.email,
        phoneNumber: user.phone_number,
        preferredName: user.preferred_username,
        sub: user.sub,
        refreshToken: ""
    });

    const isNewSignup = sessionStorage.getItem('pendingNewSignup') === 'true';
    if (isNewSignup) {
        sessionStorage.removeItem('pendingNewSignup');
        router.push('/user-signup');
    } else {
        const errandUserData = await errandAuthService.signIn(user.sub);
        userState.setErrandUserData(errandUserData.user);
        sessionState.setSessionId(errandUserData.sessionId);
        sessionState.setMustReauthorize(errandUserData.mustReauthorize);
        sessionState.setIsKrogerAccountConnected(errandUserData.isKrogerAccountConnected);
        router.push('/home');
    }
});

onUnmounted(() => unsubscribeHub());
</script>

<template>
    <div class="login-auth-shell">
        <authenticator :form-fields="formFields" id="authenticator">
            <template>
                <div class="success-message">
                    <h2>You're in!</h2>
                    <p>Taking you to Errand now…</p>
                </div>
            </template>
        </authenticator>
    </div>
</template>

<style lang="scss" scoped>
.login-auth-shell {
    width: 100%;
    max-width: 480px;
    font-family: var(--font-body);

    .success-message {
        text-align: center;
        padding: var(--space-lg);
        border-radius: var(--radius-card);
        background: var(--color-paper);
        border: 1px solid var(--color-rule);

        h2 {
            font-family: var(--font-display);
            font-size: var(--text-xl);
            color: var(--color-ink);
            margin: 0 0 var(--space-2xs);
            font-style: normal;
        }

        p {
            color: var(--color-ink-2);
            font-family: var(--font-body);
            margin: 0;
        }
    }

    /* ─── Amplify Authenticator overrides ──────────────────── */
    :deep([data-amplify-authenticator]) {
        width: 100%;
        font-family: var(--font-body);
    }

    :deep([data-amplify-container]) { width: 100%; }

    :deep([data-amplify-router]) {
        background: var(--color-paper);
        border-radius: var(--radius-card);
        border: 1px solid var(--color-rule);
        box-shadow: 0 8px 32px oklch(20% 0.012 50 / 0.08);
        overflow: hidden;
    }

    :deep([data-amplify-router-content]) {
        padding: var(--space-lg) var(--space-lg) var(--space-xl);
    }

    /* Submit / primary button */
    :deep(button[type="submit"]),
    :deep(button[data-variation="primary"]) {
        background: var(--color-accent);
        color: var(--color-accent-ink);
        border: none;
        border-radius: var(--radius-btn);
        padding: 0.95rem 1.4rem;
        font-family: var(--font-body);
        font-weight: 700;
        font-size: var(--text-base);
        cursor: pointer;
        width: 100%;
        box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10);
        transition: background-color var(--dur-micro) var(--ease-out);

        &:hover { background: oklch(54% 0.22 42); }

        &:focus-visible {
            outline: 2px solid var(--color-focus);
            outline-offset: 3px;
        }
    }

    /* Link / secondary buttons */
    :deep(button[data-variation="link"]),
    :deep(button:not([type="submit"]):not([data-variation="primary"]):not(.amplify-field__show-password)) {
        color: var(--color-accent);
        font-family: var(--font-body);
        font-weight: 500;
        background: none;
        border: none;
        cursor: pointer;

        &:hover { color: var(--color-ink); }
    }

    /* Inputs */
    :deep(input) {
        border: 1px solid var(--color-rule);
        border-radius: var(--radius-input);
        padding: 0.75rem var(--space-sm);
        font-family: var(--font-body);
        font-size: var(--text-base);
        background: var(--color-paper);
        color: var(--color-ink);
        width: 100%;
        transition:
            border-color var(--dur-micro) var(--ease-out),
            box-shadow var(--dur-micro) var(--ease-out);

        &:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px var(--color-accent-dim);
        }

        &::placeholder { color: var(--color-ink-2); }
    }

    /* Labels */
    :deep(label) {
        color: var(--color-ink);
        font-family: var(--font-body);
        font-weight: 600;
        font-size: var(--text-sm);
    }

    /* Tabs */
    :deep(.amplify-authenticator__tabs-wrapper) {
        border-bottom: 1px solid var(--color-rule);
    }

    :deep([role="tablist"] button) {
        color: var(--color-ink-2);
        font-family: var(--font-body);
        font-weight: 600;
        border-bottom: 2px solid transparent;
        background: none;
        cursor: pointer;
        transition: color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out);

        &[aria-selected="true"] {
            color: var(--color-accent);
            border-bottom-color: var(--color-accent);
        }

        &:hover { color: var(--color-ink); }
    }

    /* Error text */
    :deep([data-amplify-error]) {
        color: var(--color-error);
        font-family: var(--font-body);
        font-size: var(--text-sm);
    }

    /* Links inside form */
    :deep(a) {
        color: var(--color-accent);
        font-family: var(--font-body);
        font-weight: 500;
        text-decoration: none;

        &:hover {
            color: var(--color-ink);
            text-decoration: underline;
        }
    }

    /* Password show/hide button */
    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field-group) {
        display: flex;
        align-items: stretch;
        gap: 0;
        width: 100%;
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field-group__field-wrapper) {
        flex: 1;
        min-width: 0;
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-input) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field__show-password) {
        align-self: stretch;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 48px;
        padding: 0.75rem;
        cursor: pointer;
        border: 1px solid var(--color-rule);
        border-left-width: 0;
        border-top-right-radius: var(--radius-input);
        border-bottom-right-radius: var(--radius-input);
        background: var(--color-paper);
        color: var(--color-ink-2);
        transition: color var(--dur-micro) var(--ease-out), border-color var(--dur-micro) var(--ease-out);
        box-shadow: none;

        &:hover {
            color: var(--color-accent);
            border-color: var(--color-accent);
        }

        &:focus-visible {
            outline: 2px solid var(--color-focus);
            outline-offset: 2px;
        }

        svg { width: 18px; height: 18px; }
    }

    /* Phone country-code select */
    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group) {
        display: flex;
        align-items: stretch;
        gap: 0;
        width: 100%;
        flex-wrap: nowrap;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start) {
        display: flex;
        align-items: stretch;
        flex: 0 0 92px;
        min-width: 92px;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-select__wrapper),
    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-field) {
        width: 100%;
        display: flex;
        align-items: stretch;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start select.amplify-select),
    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-field-group__control) {
        width: 100%;
        height: auto;
        align-self: stretch;
        box-sizing: border-box;
        margin: 0;
        border: 1px solid var(--color-rule);
        border-right-width: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: var(--radius-input);
        border-bottom-left-radius: var(--radius-input);
        padding: 0.75rem 2rem 0.75rem 0.75rem;
        font-family: var(--font-body);
        font-size: var(--text-base);
        color: var(--color-ink);
        background: var(--color-paper);
        cursor: pointer;
        transition: border-color var(--dur-micro) var(--ease-out);

        &:focus {
            outline: none;
            border-color: var(--color-accent);
            box-shadow: 0 0 0 3px var(--color-accent-dim);
            z-index: 1;
            position: relative;
        }
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-select__icon-wrapper) {
        right: 0.5rem;
        color: var(--color-ink-2);
        pointer-events: none;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__field-wrapper) {
        flex: 1;
        min-width: 0;
        display: flex;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__field-wrapper > input),
    :deep(.amplify-field:has(> .amplify-field-group select) input.amplify-input) {
        width: 100%;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    :deep(.amplify-field-group__control) {
        border-radius: var(--radius-input);
    }
}
</style>
