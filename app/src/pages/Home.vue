<script setup lang="ts">
import { userState } from "../state";
import { onMounted, ref } from 'vue';
import { ReauthorizationAlert } from "../components";
import { sessionState } from "../state";

let userName = ref("there");
let mustReauthorize = ref(true);

onMounted(async () => {
  const user = userState.getUser();
  userName.value = user.preferredName || "there";
  mustReauthorize.value = sessionState.getMustReauthorize();
});
</script>

<template>
  <div class="home-page">
    <ReauthorizationAlert v-if="mustReauthorize" redirect-page="home" />

    <header class="home-header">
      <h1 class="home-heading">Hey, {{ userName }}.</h1>
      <p class="home-sub">What do you feel like making tonight?</p>
    </header>

    <div class="home-tiles">
      <router-link class="home-tile" to="/recipes">
        <div class="tile-icon">
          <i class="pi pi-sparkles" aria-hidden="true"></i>
        </div>
        <div class="tile-body">
          <h2 class="tile-title">Recipes</h2>
          <p class="tile-desc">Tell the AI what you're craving and get personalized recipe ideas — then add ingredients straight to your cart.</p>
        </div>
        <span class="tile-arrow" aria-hidden="true">→</span>
      </router-link>

      <router-link class="home-tile" to="/browse">
        <div class="tile-icon">
          <i class="pi pi-search" aria-hidden="true"></i>
        </div>
        <div class="tile-body">
          <h2 class="tile-title">Browse</h2>
          <p class="tile-desc">Search Kroger's catalog for products, then get AI recipe ideas built around what you find.</p>
        </div>
        <span class="tile-arrow" aria-hidden="true">→</span>
      </router-link>
    </div>

    <p class="home-credit">
      Built by Max Hughes ·
      <a href="https://www.linkedin.com/in/maxwell-hughes-998449207" target="_blank" rel="noopener" aria-label="LinkedIn">
        <i class="pi pi-linkedin" aria-hidden="true"></i>
      </a>
      <a href="https://github.com/maxhughes6" target="_blank" rel="noopener" aria-label="GitHub">
        <i class="pi pi-github" aria-hidden="true"></i>
      </a>
    </p>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  width: 100%;
  max-width: 900px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

/* ─── Header ─────────────────────────────────────────────── */
.home-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.home-heading {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 700;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  line-height: 1.05;
  margin: 0;
}

.home-sub {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  color: var(--color-ink-2);
  font-weight: 400;
  margin: 0;
}

/* ─── Nav tiles ──────────────────────────────────────────── */
.home-tiles {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md);
}

.home-tile {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  text-decoration: none;
  color: var(--color-ink);
  transition:
    transform var(--dur-short) var(--ease-out),
    box-shadow var(--dur-short) var(--ease-out),
    border-color var(--dur-short) var(--ease-out);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px oklch(20% 0.012 50 / 0.08);
    border-color: var(--color-accent);

    .tile-arrow { color: var(--color-accent); transform: translateX(3px); }
    .tile-icon i { color: var(--color-accent); }
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

.tile-icon {
  flex-shrink: 0;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 8px;
  background: var(--color-accent-dim);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.25rem;
    color: var(--color-ink-2);
    transition: color var(--dur-micro) var(--ease-out);
  }
}

.tile-body { flex: 1; min-width: 0; }

.tile-title {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-ink);
  margin: 0 0 var(--space-2xs);
}

.tile-desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.6;
  margin: 0;
}

.tile-arrow {
  flex-shrink: 0;
  font-size: var(--text-lg);
  color: var(--color-rule);
  transition:
    color var(--dur-micro) var(--ease-out),
    transform var(--dur-short) var(--ease-out);
}

/* ─── Credit ─────────────────────────────────────────────── */
.home-credit {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  margin: 0;

  a {
    color: var(--color-ink-2);
    text-decoration: none;
    transition: color var(--dur-micro) var(--ease-out);

    &:hover { color: var(--color-accent); }
    &:focus-visible { outline: 2px solid var(--color-focus); outline-offset: 2px; }
  }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 640px) {
  .home-tiles { grid-template-columns: 1fr; }
  .home-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}
</style>
