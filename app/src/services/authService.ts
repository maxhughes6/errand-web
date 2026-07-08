import { KrogerAuthorizationResponse, SignInResponse } from '../models';
import { UserSignUpFormData } from "../models";
import { userState } from '../state';
import { authenticatedFetch } from './authenticatedFetch';

const redirectUri = `${location.origin}/`;
const ERRAND_API_BASE_URL = import.meta.env.VITE_ERRAND_API_BASE_URL;
const KROGER_CLIENT_ID = import.meta.env.VITE_KROGER_CLIENT_ID;

export const authService = {
    async redirectToGrocererAuthorization(grocerer: string, returnTo: string = "user-signup"): Promise<void> {
        const params = new URLSearchParams({
            scope: "product.compact cart.basic:write",
            response_type: "code",
            client_id: KROGER_CLIENT_ID,
            redirect_uri: redirectUri,
            state: returnTo, // State used to store returnTo value
            banner: grocerer
        });

        window.location.href = `https://api.kroger.com/v1/connect/oauth2/authorize?${params.toString()}`;
    },

    async exchangeCodeForAuthToken(code: string): Promise<KrogerAuthorizationResponse> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/auth/authorize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, redirectUri })
        });

        const responseAsJson = await response.json();
        return {
            accessToken: responseAsJson.access_token,
            refreshToken: responseAsJson.refresh_token,
            expiresIn: responseAsJson.expires_in
        };
    },

    async signIn(sub: string): Promise<SignInResponse> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sub })
        });

        return await response.json();
    },

    async createUserAndSignIn(formData: UserSignUpFormData, authResponse: KrogerAuthorizationResponse | null): Promise<SignInResponse> {
        const user = userState.getUser();
        const nowInSeconds = Math.floor(Date.now() / 1000);

        if (!user) {
            throw new Error("No user found, data needed to create new user");
        }

        let requestBody;

        // Signup w/o Kroger account connection
        if (!authResponse) {
            requestBody = {
                sub: user.sub,
                dietaryPreferences: formData.dietaryPreferences
            };
        }

        // Signup with Kroger account connection
        else {
            requestBody = {
                ...formData,
                sub: user.sub,
                refreshToken: authResponse?.refreshToken ?? "",
                tokenCreatedAt: authResponse ? nowInSeconds : 0,
                accessToken: authResponse?.accessToken ?? "",
                accessTokenExpiresAt: authResponse ? nowInSeconds + authResponse.expiresIn : 0
            };
        }

        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });

        return await response.json();
    },

    async reauthorize(krogerAuthResponse: KrogerAuthorizationResponse, userSub: string, preferredStore: string): Promise<void> {
        const response = await authenticatedFetch(`${ERRAND_API_BASE_URL}/auth/reauthorize`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...krogerAuthResponse,
                userSub: userSub,
                preferredStore: preferredStore
            })
        });

        if (!response.ok) {
            throw new Error(`Error reauthorizing user: ${response.statusText}`);
        }
    }
}