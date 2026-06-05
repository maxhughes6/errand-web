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
                    <h2>Welcome, you are logged in!</h2>
                    <p>Taking you to Errand now...</p>
                </div>
            </template>
        </authenticator>
    </div>
</template>

<style lang="scss" scoped>
.login-auth-shell {
    width: 100%;
    max-width: 540px;
    font-family: "Montserrat", sans-serif;

    .success-message {
        text-align: center;
        padding: 2rem;
        border-radius: 18px;
        background: #fff;
        box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);

        h2 {
            color: #4713a3;
            font-family: "Montserrat", sans-serif;
            margin-bottom: 0.5rem;
        }

        p {
            color: #5d4a7a;
            font-family: "Montserrat", sans-serif;
        }
    }

    :deep([data-amplify-authenticator]) {
        width: 100%;
        font-family: "Montserrat", sans-serif;
    }

    :deep([data-amplify-container]) {
        width: 100%;
    }

    :deep([data-amplify-router]) {
        background: #fff;
        border-radius: 28px;
        box-shadow: 0 18px 44px rgba(71, 19, 163, 0.08), 0 4px 14px rgba(71, 19, 163, 0.06);
        border: 1px solid rgba(71, 19, 163, 0.18);
        overflow: hidden;
    }

    :deep([data-amplify-router-content]) {
        padding: 2rem;
    }

    :deep(button[type="submit"]),
    :deep(button[data-variation="primary"]) {
        background: linear-gradient(90deg, #4713a3 60%, #6e3ff3 100%);
        color: white;
        border: none;
        border-radius: 16px;
        padding: 0.75rem 1.5rem;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
        font-size: 1rem;
        cursor: pointer;
        transition: box-shadow 0.2s, transform 0.1s;
    }

    :deep(button[type="submit"]:hover),
    :deep(button[data-variation="primary"]:hover) {
        box-shadow: 0 4px 18px 0 rgba(71, 19, 163, 0.25);
        transform: translateY(-1px);
    }

    :deep(button[type="submit"]:active),
    :deep(button[data-variation="primary"]:active) {
        transform: translateY(0);
    }

    :deep(button[data-variation="link"]),
    :deep(button:not([type="submit"]):not([data-variation="primary"]):not(.amplify-field__show-password)) {
        color: #4713a3;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
    }

    :deep(button[data-variation="link"]:hover),
    :deep(button:not([type="submit"]):not([data-variation="primary"]):not(.amplify-field__show-password):hover) {
        color: #6e3ff3;
    }

    :deep(input) {
        border: 2px solid #e0d4f7;
        border-radius: 16px;
        padding: 0.75rem 1rem;
        font-family: "Montserrat", sans-serif;
        font-size: 1rem;
        transition: border-color 0.2s, box-shadow 0.2s;
        background: rgba(255, 255, 255, 0.92);
    }

    :deep(input:focus) {
        outline: none;
        border-color: #4713a3;
        box-shadow: 0 0 0 3px rgba(71, 19, 163, 0.1);
    }

    :deep(input::placeholder) {
        color: #9b8bb5;
    }

    /* Phone number field — match the country-code select to the input
       the same way the password show/hide button is attached.
       Scoped via :has(select) since only the phone field has a select inside;
       this avoids matching the empty .amplify-field-group__outer-start wrappers
       Amplify renders on every other field. */
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
        border: 2px solid #e0d4f7;
        border-right-width: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        border-top-left-radius: 16px;
        border-bottom-left-radius: 16px;
        padding: 0.75rem 2rem 0.75rem 0.9rem;
        font-family: "Montserrat", sans-serif;
        font-size: 1rem;
        color: #5d4a7a;
        background: rgba(255, 255, 255, 0.92);
        cursor: pointer;
        transition: border-color 0.2s, box-shadow 0.2s;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start select.amplify-select:focus),
    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-field-group__control:focus) {
        outline: none;
        border-color: #4713a3;
        box-shadow: 0 0 0 3px rgba(71, 19, 163, 0.1);
        z-index: 1;
        position: relative;
    }

    :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group__outer-start .amplify-select__icon-wrapper) {
        right: 0.5rem;
        color: #5d4a7a;
        pointer-events: none;
    }

    /* Phone input next to the country-code select: kill the left border/radius
       so the two render as one continuous control. */
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
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
    }

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
        width: 100%;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field__show-password) {
        position: static;
        align-self: stretch;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 64px;
        min-width: 64px;
        padding: 0.75rem 0.9rem;
        cursor: pointer;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 16px;
        border-bottom-right-radius: 16px;
        border: 2px solid #e0d4f7;
        border-left-width: 0;
        background: rgba(255, 255, 255, 0.92);
        color: #5d4a7a;
        transition: color 0.2s, border-color 0.2s, box-shadow 0.2s, transform 0.1s;
        box-shadow: none;
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field__show-password:hover) {
        color: #4713a3;
        border-color: #6e3ff3;
        border-left-color: transparent;
        background: #fff;
        box-shadow: 0 0 0 3px rgba(71, 19, 163, 0.08);
        transform: translateY(-1px);
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field__show-password:focus-visible) {
        outline: none;
        border-color: #4713a3;
        border-left-color: transparent;
        box-shadow: 0 0 0 4px rgba(71, 19, 163, 0.14);
    }

    :deep(.amplify-field:has(.amplify-field__show-password) .amplify-field__show-password svg) {
        width: 20px;
        height: 20px;
    }

    :deep(.amplify-field-group__control) {
        border-radius: 16px;
    }

    :deep(label) {
        color: #5d4a7a;
        font-family: "Montserrat", sans-serif;
        font-weight: 500;
        font-size: 0.95rem;
    }

    :deep(.amplify-authenticator__tabs-wrapper) {
        border-bottom: 1px solid rgba(71, 19, 163, 0.12);
    }

    :deep([role="tablist"] button) {
        color: #79689d;
        font-family: "Montserrat", sans-serif;
        font-weight: 600;
        border-bottom: 3px solid transparent;
        transition: color 0.2s, border-color 0.2s, background-color 0.2s;
    }

    :deep([role="tablist"] button[aria-selected="true"]) {
        color: #4713a3;
        border-bottom-color: #6e3ff3;
        background: linear-gradient(180deg, rgba(110, 63, 243, 0.06) 0%, rgba(110, 63, 243, 0) 100%);
    }

    :deep([role="tablist"] button:hover) {
        color: #4713a3;
    }

    :deep([data-amplify-error]) {
        color: #c41e3a;
        font-family: "Montserrat", sans-serif;
        font-size: 0.9rem;
    }

    :deep(a) {
        color: #4713a3;
        font-family: "Montserrat", sans-serif;
        text-decoration: none;
        font-weight: 500;
    }

    :deep(a:hover) {
        color: #6e3ff3;
        text-decoration: underline;
    }

    @media (max-width: 640px) {
        :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group) {
            align-items: stretch;
        }

        :deep(.amplify-field:has(> .amplify-field-group select) .amplify-field-group input) {
            flex: 1;
        }
    }
}
</style>