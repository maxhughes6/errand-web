# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Run dev server (from repo root)
npm run app

# Run dev server (from app/ directory)
npm run dev

# Build for production (from repo root)
npm run build
```

There is no test framework or linter configured in this project.

## Architecture

This is a Vue 3 SPA (Vite). It uses Claude to generate recipes and integrates with the Kroger API for grocery product search and cart management. It is being hosted on Vercel as an SPA.

### Two-level package structure

- Root `package.json`: holds shared dependencies (Anthropic SDK, AWS Amplify, Zod) and scripts that delegate into `app/`
- `app/package.json`: the actual Vite frontend app with Vue, PrimeVue, and vue-router

### Authentication (dual-layer)

1. **AWS Amplify/Cognito** (`app/src/amplify/amplifyAuthService.ts`): user sign-up/sign-in, provides JWT tokens sent as `Authorization` headers to the backend
2. **Kroger OAuth** (`app/src/services/authService.ts`): separate OAuth flow for grocery store access; tokens are exchanged via the backend and stored per-user; requires periodic reauthorization

The router (`app/plugins/router.js`) guards all routes except `/login`, `/user-signup`, and `/auth/callback` behind Amplify authentication.

### Backend

All API calls go to a single AWS API Gateway endpoint (`ERRAND_API_BASE_URL` in services). Recipe generation, product search, and cart operations are all server-side. Requests include an Amplify JWT and a `Session-Id` header. `Session-Id` is used by the backend to determine which Kroger JWTs to use for the add to cart feature, and determines the account to save recipes to.

### State Management

All app state uses `sessionStorage` for full tab isolation — each browser tab is independent and requires its own login. No `localStorage` usage.

Custom class-based singletons persisted to `sessionStorage` (not Vuex/Pinia):
- `sessionState`: session ID, recipes page data, products page data, reauthorization flag
- `userState`: user profile, Kroger refresh token, Errand user data

AWS Amplify's Cognito token storage is also configured to use `sessionStorage` via `cognitoUserPoolsTokenProvider.setKeyValueStorage(sessionStorage)` in `app/src/main.js`.

### UI

- PrimeVue component library with PrimeIcons
- Global styles in `app/src/style.scss` (SCSS)
- No CSS framework (Tailwind, Bootstrap, etc.)

### Key Domain Models (`app/src/models/models.ts`)

- `Recipe`: name, tags (dietary), ingredients list, optional instructions
- `KrogerAuthorizationResponse`: access/refresh tokens from Kroger OAuth
- `ErrandUser`: the persisted user profile with dietary preferences and store selection
