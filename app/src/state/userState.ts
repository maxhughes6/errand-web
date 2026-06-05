import { ErrandUser } from "../models";

interface User {
    email: string;
    phoneNumber: string;
    preferredName: string;
    sub: string;
    refreshToken: string;
    errandUserData?: ErrandUser;
}

const USER_STORAGE_KEY = "errand.userState";

class UserState {
    private user: User | null = this.loadUser();

    private loadUser(): User | null {
        if (typeof window === "undefined") {
            return null;
        }

        const storedUser = window.sessionStorage.getItem(USER_STORAGE_KEY);
        if (!storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as User;
        } catch (error) {
            window.sessionStorage.removeItem(USER_STORAGE_KEY);
            return null;
        }
    }

    private persistUser() {
        if (typeof window === "undefined") {
            return;
        }

        if (this.user) {
            window.sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.user));
            return;
        }

        window.sessionStorage.removeItem(USER_STORAGE_KEY);
    }

    setUser(user: User) {
        this.user = user;
        this.persistUser();
    }

    setRefreshToken(refreshToken: string) {
        if (this.user) {
            this.user.refreshToken = refreshToken;
            this.persistUser();
        }
    }

    getRefreshToken(): string {
        return this.user?.refreshToken || "";
    }

    getUser(): User | null {
        return this.user;
    }

    getErrandUserData(): ErrandUser | undefined {
        return this.user?.errandUserData;
    }

    setErrandUserData(errandUserData: ErrandUser) {
        if (this.user) {
            this.user.errandUserData = errandUserData;
            this.persistUser();
        }
    }

    /**
     * Returns true if the user has an active Kroger connection.
     * Checks both errandUserData.refreshToken (set on sign-in from backend)
     * and the top-level refreshToken (updated after reauthorization).
     */
    hasKrogerConnection(): boolean {
        return !!(this.user?.errandUserData?.refreshToken || this.user?.refreshToken);
    }

    clearUser() {
        this.user = null;
        this.persistUser();
    }
}

export const userState: UserState = new UserState();