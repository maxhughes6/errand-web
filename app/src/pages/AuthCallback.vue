<script setup>
import { useRoute, useRouter } from 'vue-router';
import { onMounted } from 'vue';
import { LoadingSpinner } from "../components";
import { authService } from '../services';
import { userState, sessionState } from '../state';
import { amplifyAuthService } from '../amplify/amplifyAuthService';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
    const code = route.query.code?.toString() || '';
    let returnTo = 'user-signup';

    if (route.query.returnTo != undefined) {
        returnTo = route.query.returnTo.toString();
    }

    if (!code) {
        router.push({ path: `/${returnTo}`, query: { auth: 'error' } });
        return;
    }

    const authResponse = await authService.exchangeCodeForAuthToken(code);
    const isNewUser = (returnTo === 'user-signup');

    if (isNewUser) {
        sessionStorage.setItem('krogerAuthResponse', JSON.stringify(authResponse));
        router.push({ path: '/user-signup', query: { auth: 'success' } });
        return;
    }

    const currentUser = userState.getUser();
    const pendingStore = sessionState.getPendingKrogerStore()
        || userState.getErrandUserData()?.preferredStore
        || '';
    await authService.reauthorize(authResponse, currentUser.sub, pendingStore);
    sessionState.clearPendingKrogerStore();

    userState.setRefreshToken(authResponse.refreshToken);
    sessionState.setMustReauthorize(false);
    sessionState.setIsKrogerAccountConnected(true);
    router.push({ path: `/${returnTo}`, query: { auth: 'success' } });
})
</script>

<template>
    <loading-spinner message="Taking you back to Errand..."></loading-spinner>
</template>