import { Recipe } from "../models";

interface RecipesPageData {
    prompt: string;
    recipes: Recipe[];
}

interface ProductsPageData {
    query: string;
    products: any[];
}

interface Session {
    sessionId: string;
    recipesPageData: RecipesPageData;
    productsPageData: ProductsPageData;
    mustReauthorize: boolean;
    isKrogerAccountConnected: boolean;
    pendingKrogerStore: string;
}

const defaultRecipesPageData: RecipesPageData = { prompt: "", recipes: [] };
const defaultProductsPageData: ProductsPageData = { query: "", products: [] };
const SESSION_STORAGE_KEY = "errand.sessionState";

class SessionState {
    private session: Session | null = this.loadSession();

    private createDefaultSession(sessionId: string = ""): Session {
        return {
            sessionId,
            recipesPageData: { ...defaultRecipesPageData },
            productsPageData: { ...defaultProductsPageData },
            mustReauthorize: true,
            isKrogerAccountConnected: false,
            pendingKrogerStore: ''
        };
    }

    private loadSession(): Session | null {
        if (typeof window === "undefined") {
            return null;
        }

        const storedSession = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (!storedSession) {
            return null;
        }

        try {
            const parsedSession = JSON.parse(storedSession) as Partial<Session>;
            return {
                ...this.createDefaultSession(parsedSession.sessionId || ""),
                ...parsedSession,
                recipesPageData: {
                    ...defaultRecipesPageData,
                    ...parsedSession.recipesPageData,
                },
                productsPageData: {
                    ...defaultProductsPageData,
                    ...parsedSession.productsPageData,
                },
            };
        } catch (error) {
            window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
            return null;
        }
    }

    private persistSession() {
        if (typeof window === "undefined") {
            return;
        }

        if (this.session) {
            window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(this.session));
            return;
        }

        window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }

    getSessionId(): string {
        return this.session?.sessionId || "";
    }

    setSessionId(sessionId: string) {
        if (this.session) {
            this.session.sessionId = sessionId;
        } else {
            this.session = this.createDefaultSession(sessionId);
        }

        this.persistSession();
    }

    getRecipesPageData(): RecipesPageData {
        return this.session?.recipesPageData || { ...defaultRecipesPageData };
    }

    setRecipesPageData(data: RecipesPageData) {
        if (this.session) {
            this.session.recipesPageData = data;
            this.persistSession();
        }
    }

    getProductsPageData(): ProductsPageData {
        return this.session?.productsPageData || { ...defaultProductsPageData };
    }

    setProductsPageData(data: ProductsPageData) {
        if (this.session) {
            this.session.productsPageData = data;
            this.persistSession();
        }
    }

    clearSession() {
        this.session = null;
        this.persistSession();
    }

    setMustReauthorize(mustReauthorize: boolean) {
        if (this.session) {
            this.session.mustReauthorize = mustReauthorize;
        } else {
            this.session = this.createDefaultSession();
            this.session.mustReauthorize = mustReauthorize;
        }

        this.persistSession();
    }
    
    getMustReauthorize(): boolean {
        if (this.session) {
            return this.session.mustReauthorize;
        }
        return true;
    }

    setIsKrogerAccountConnected(isKrogerAccountConnected: boolean) {
        if (this.session) {
            this.session.isKrogerAccountConnected = isKrogerAccountConnected;
        } else {
            this.session = this.createDefaultSession();
            this.session.isKrogerAccountConnected = isKrogerAccountConnected;
        }

        this.persistSession();
    }

    getIsKrogerAccountConnected(): boolean {
        return this.session?.isKrogerAccountConnected ?? false;
    }

    setPendingKrogerStore(store: string) {
        if (this.session) {
            this.session.pendingKrogerStore = store;
        } else {
            this.session = this.createDefaultSession();
            this.session.pendingKrogerStore = store;
        }

        this.persistSession();
    }

    getPendingKrogerStore(): string {
        return this.session?.pendingKrogerStore ?? '';
    }

    clearPendingKrogerStore() {
        if (this.session) {
            this.session.pendingKrogerStore = '';
            this.persistSession();
        }
    }
}

export { RecipesPageData, ProductsPageData };
export const sessionState: SessionState = new SessionState();
