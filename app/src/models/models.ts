export interface Recipe {
    recipeName: string,
    recipeId?: string,
    instructions?: string,
    tags: Tags[],
    ingredients: {
        name: string,
        quantity: number,
        unit: string
    }[]
}

export enum Tags {
    HEALTHY = 'healthy',
    VEGETARIAN = 'vegetarian',
    VEGAN = 'vegan',
    GLUTEN_FREE = 'gluten-free',
    LACTOSE_FREE = 'lactose-free',
    LOW_CALORIE = 'low-calorie'
}

export interface KrogerAddToCartRequestObject {
    upc: string,
    quantity: number,
    modality?: "PICKUP" | "DELIVERY",
    allowSubstitutes?: boolean,
    specialInstructions?: string
}

export interface KrogerAuthorizationResponse {
    accessToken: string,
    refreshToken: string,
    expiresIn: number
}

export interface ErrandUser {
    sub: string,
    dietaryPreferences: Tags[],
    preferredStore?: string,
    refreshToken?: string,
    tokenCreatedAt: number,
    isKrogerAccountConnected?: boolean
}

export interface UserSignUpFormData {
    dietaryPreferences: string[],
}

export interface SignInResponse {
    user: ErrandUser, 
    sessionId: string, 
    mustReauthorize: boolean,
    isKrogerAccountConnected: boolean
}