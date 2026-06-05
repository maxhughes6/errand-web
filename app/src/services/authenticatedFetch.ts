import { amplifyAuthService } from '../amplify/amplifyAuthService';
import { sessionState } from '../state';
import router from '../../plugins/router';

let sessionExpiredFired = false;

export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await amplifyAuthService.getAccessToken();
    const headers = new Headers(options.headers);

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    headers.set("Session-Id", sessionState.getSessionId());

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401 && !sessionExpiredFired) {
        sessionExpiredFired = true;
        window.sessionStorage.clear();
        window.dispatchEvent(new CustomEvent('session-expired'));
        setTimeout(() => {
            router.push('/login');
            sessionExpiredFired = false;
        }, 1500);
        throw new Error('Session expired');
    }

    return response;
}
