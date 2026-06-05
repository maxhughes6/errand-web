# Welcome to Errand!

This is a Vue 3 single-page application which is now a full-stack product with the addition of the Errand API (not public). Errand uses Anthropic's Claude AI models to generate personalized recipes based on dietary preferences and integrates with the Kroger API to search for grocery products and add them directly to your cart.

## Features

- **AI Recipe Generation** — Claude suggests recipes tailored to your dietary tags and preferences based on your prompt
- **Grocery Product Search** — Search Kroger's catalog for products, and obtain recipe ideas that utilize them
- **Cart Management** — Add products to your Kroger cart without leaving the app
- **User Profiles** — Save dietary preferences, re-add items from previously generated recipes, generate recipe instructions, and more
- **Full Management of Kroger JWTs** - Kroger JWTs are stored to your account, and new access tokens are generated on sign-in. If you need to reauthenticate, you'll be prompted. But as long as you continue signing in once every 24 hours, the tokens rotate automatically

## Tech Stack

- **Frontend:** Vue 3, Vue Router, TypeScript, Vite
- **UI:** PrimeVue, PrimeIcons, SCSS
- **Auth:** AWS Amplify/Cognito (user auth) + Kroger OAuth (grocery access)
- **AI:** Anthropic Claude, via AWS Bedrock. Recipe generation uses Haiku 4.5 and instructions generation uses Sonnet 4.6

## Getting Started
- You will need a Kroger account in order to sign up for an Errand account

### Prerequisites

- Node.js (v18+)
- npm

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run app
```

Or from the `app/` directory:

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
errand-web/
├── app/                  # Vite frontend application
│   └── src/
│       ├── amplify/      # AWS Amplify/Cognito auth config
│       ├── components/   # Reusable Vue components
│       ├── models/       # TypeScript domain models
│       ├── pages/        # Route-level views
│       ├── services/     # API and auth services
│       └── state/        # Session-based state management
├── package.json          # Root config with shared dependencies
└── CLAUDE.md             # AI assistant instructions
```
