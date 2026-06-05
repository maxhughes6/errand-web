import { AuthUser, fetchAuthSession, getCurrentUser, fetchUserAttributes, signOut } from 'aws-amplify/auth';

export const amplifyAuthService = {
    async isAuthenticated(): Promise<boolean> {
        try {
            const session = await fetchAuthSession();
            // Check if we have valid tokens
            return !!(session.tokens?.accessToken && session.tokens?.idToken);
        } catch (err) {
            return false;
        }
    },

    async getCurrentUser(): Promise<any | null> {
        try {
            return await fetchUserAttributes();
        } catch (err) {
            return null;
        }
    },

    async getAccessToken(): Promise<string | null> {
        try {
            const session = await fetchAuthSession();
            return session.tokens?.idToken?.toString() || null;
        } catch (err) {
            return null;
        }
    },

    async logout(): Promise<void> {
        try {
            await signOut();
        } catch (err) {
            throw err;
        }
    }
}