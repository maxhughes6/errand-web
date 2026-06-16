# ErrandAI — Hallmark Design System

**Genre:** Playful  
**Macrostructure:** Split Studio (Login) · Workbench family (all app pages)  
**Nav:** N1b Canonical SaaS three-section  
**Footer:** Ft2 Inline single line (app) · Ft5 minimal (login showcase footer)

---

## Color Palette (OKLCH)

| Token | Value | Role |
|---|---|---|
| `--color-paper` | `oklch(97% 0.012 85)` | Page background — warm cream |
| `--color-paper-2` | `oklch(93% 0.018 88)` | Elevated surface (login left panel, empty states, image wrappers) |
| `--color-ink` | `oklch(20% 0.012 50)` | Body text |
| `--color-ink-2` | `oklch(48% 0.010 60)` | Secondary / muted text |
| `--color-rule` | `oklch(86% 0.012 85)` | Borders, dividers |
| `--color-accent` | `oklch(62% 0.22 42)` | Coral/terracotta — primary CTA, active states, brand "ai" highlight |
| `--color-accent-dim` | `oklch(62% 0.22 42 / 0.12)` | Coral at 12% — focus rings, icon bg, hover glows |
| `--color-accent-ink` | `oklch(98% 0.005 85)` | Text on coral buttons |
| `--color-accent-2` | `oklch(0.408 0.13 148);` | Sage green — dietary tags, Kroger note, secondary success |
| `--color-accent-2-bg` | `oklch(92% 0.06 148)` | Sage green surface |
| `--color-accent-2-border` | `oklch(80% 0.10 148)` | Sage green border |
| `--color-focus` | `oklch(55% 0.19 285)` | Focus ring (accessible blue) |
| `--color-error` | `oklch(55% 0.22 15)` | Validation errors |
| `--color-error-bg` | `oklch(96% 0.04 15)` | Error surface |

---

## Typography

| Token | Value | Use |
|---|---|---|
| `--font-display` | `"Fraunces", Georgia, serif` | H1–H3, brand name, cycling headlines |
| `--font-body` | `"Montserrat", system-ui, sans-serif` | All body copy, labels, buttons, tags |

**Type scale (1.25 major-third):**  
`--text-xs` 0.64rem · `--text-sm` 0.8rem · `--text-base` 1rem · `--text-md` 1.25rem · `--text-lg` 1.563rem · `--text-xl` 1.953rem · `--text-2xl` 2.441rem · `--text-display` 3.052rem

---

## Spacing (4-pt base)

`--space-3xs` 4px · `--space-2xs` 8px · `--space-xs` 12px · `--space-sm` 16px · `--space-md` 24px · `--space-lg` 32px · `--space-xl` 48px · `--space-2xl` 64px

---

## Motion

All animation uses `transform` + `opacity` only (no layout properties).

| Token | Value |
|---|---|
| `--dur-micro` | 120ms |
| `--dur-short` | 220ms |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` |
| `--ease-in-out` | `cubic-bezier(0.45, 0, 0.55, 1)` |

Hover lift pattern: `translateY(-2px)` on cards, `translateY(-1px)` on buttons.  
Fade-swap pattern: opacity 0 → wait 280–400ms → swap content → opacity 1.

---

## Component Patterns

### Cards (RecipeTile, RecipeCard, home tiles)
- `background: var(--color-paper)` + `border: 1px solid var(--color-rule)` + `border-radius: var(--radius-card)`
- Hover: `translateY(-2px)` + `border-color: var(--color-accent)` + ink shadow at 7–8% opacity

### Tags (RecipeTile, RecipeCard, DietaryPreferenceTab)
- Sage green: `background: var(--color-accent-2-bg)` + `border: 1px solid var(--color-accent-2-border)` + `color: var(--color-accent-2)`

### Button rules (applies to all text-label buttons)
- **No `transform` on hover** — buttons never lift or jump. Hover effect is background-color darkening only.
- **`cursor: pointer`** on all buttons.
- **Standard shape**: `border-radius: var(--radius-btn)` (16px) · `padding: 0.95rem 1.4rem` · `font-weight: 700` · `box-shadow: 0 4px 14px oklch(20% 0.012 50 / 0.10)`
- **Exception — search circle buttons only** (Recipes generate + Browse search): `border-radius: var(--radius-pill)`, 2.4rem × 2.4rem, no text label. These are the only round buttons.

### Primary buttons
- `background: var(--color-accent)` + `color: var(--color-accent-ink)` + `border: none`
- Hover: `background: oklch(54% 0.22 42)` (darkened coral, no transform)

### Secondary buttons
- `background: var(--color-paper-2)` + `border: 1px solid var(--color-rule)` + `color: var(--color-ink)`
- Hover: `background: oklch(88% 0.018 88)` (darkened paper-2, no transform)

### "See instructions" / confirmation buttons (sage green)
- `background: var(--color-accent-2-bg)` + `border: 1px solid var(--color-accent-2-border)` + `color: var(--color-accent-2)`
- Hover: `background: oklch(87% 0.09 148)` (darkened sage bg, no transform)

### Pill search inputs
- `border-radius: var(--radius-pill)` + circular coral search button (2.4rem) anchored inside right
- Focus: `border-color: var(--color-accent)` + `box-shadow: 0 0 0 3px var(--color-accent-dim)`

### Focus rings (global)
- `outline: 2px solid var(--color-focus); outline-offset: 3px` on all interactive elements

---

## Page Layout

### Login (Split Studio 15)
- Left 55%: `background: var(--color-paper-2)` · `border-right: 1px solid var(--color-rule)`
  - Eyebrow "Welcome to" (coral uppercase) → Fraunces title "errand**ai**" → tagline → feature cycling card → dot nav → sage green Kroger note
- Right 45%: `background: var(--color-paper)` · centered LoginForm

### App pages (Workbench family)
- `max-width: 1100px` centered, `padding: var(--space-2xl) var(--space-lg) var(--space-xl)`
- Fraunces heading + Montserrat sub at top; tool (search/input) below; results grid fills remainder

### Navbar (N1b)
- `height: var(--nav-height)` (72px) · `background: var(--color-paper)` · `border-bottom: 1px solid var(--color-rule)`
- Three-column CSS grid: `1fr auto 1fr` — brand left, nav links center, profile right
- Brand: `pi-shopping-cart` icon + "errand**ai**" wordmark (ai in coral)
- Active link: `color: var(--color-accent)` + `background: var(--color-accent-dim)` pill

### Footer (Ft2)
- `border-top: 1px solid var(--color-rule)` · single flex row · copyright + credit
