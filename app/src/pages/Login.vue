<script setup lang="ts">
import LoginForm from "../components/LoginForm.vue";
import { LoadingSpinner } from "../components";
import { ref, onMounted, onUnmounted } from "vue";

let signingIn = ref(false);

const features = [
  {
    icon: "pi pi-sparkles",
    title: "AI Recipe Generation",
    description:
      "Tell Errand what you're craving. Get smart, personalized recipe suggestions in seconds.",
  },
  {
    icon: "pi pi-sliders-h",
    title: "Respects Your Diet",
    description:
      "Set your dietary preferences once and every recommendation will match.",
  },
  {
    icon: "pi pi-cart-arrow-down",
    title: "Add to Cart in One Click",
    description:
      "Add all recipe ingredients to your Kroger cart with a single click.",
  },
  {
    icon: "pi pi-search",
    title: "Grocery Product Search",
    description:
      "Browse real Kroger products and get recipe ideas built around what you find.",
  },
  {
    icon: "pi pi-bookmark",
    title: "Save Your Favorites",
    description:
      "Bookmark the recipes you love and revisit them anytime from My Recipes.",
  },
];

const currentFeatureIndex = ref(0);
const isFeatureVisible = ref(true);
let intervalId: ReturnType<typeof setInterval> | null = null;

function goToFeature(index: number) {
  if (index === currentFeatureIndex.value) return;
  isFeatureVisible.value = false;
  setTimeout(() => {
    currentFeatureIndex.value = index;
    isFeatureVisible.value = true;
  }, 280);
}

function cycleFeature() {
  isFeatureVisible.value = false;
  setTimeout(() => {
    currentFeatureIndex.value =
      (currentFeatureIndex.value + 1) % features.length;
    isFeatureVisible.value = true;
  }, 280);
}

onMounted(() => { intervalId = setInterval(cycleFeature, 5000); });
onUnmounted(() => { if (intervalId) clearInterval(intervalId); });
</script>

<template>
  <div class="login-page">
    <!-- Left: showcase -->
    <div class="login-showcase">
      <div class="showcase-brand">
        <h1 class="showcase-title">
          errand<span class="showcase-ai">ai</span>
        </h1>
        <p class="showcase-tagline">
          Not sure what to make for dinner? We'll provide the recipe <strong class="showcase-inline-emphasis-text">and</strong> fill your cart.
        </p>
      </div>

      <div
        class="feature-card"
        :class="{
          'feature-card--out': !isFeatureVisible,
          'feature-card--in':   isFeatureVisible,
        }"
      >
        <div class="feature-icon">
          <i :class="features[currentFeatureIndex].icon" aria-hidden="true"></i>
        </div>
        <div class="feature-body">
          <h3 class="feature-title">{{ features[currentFeatureIndex].title }}</h3>
          <p class="feature-desc">{{ features[currentFeatureIndex].description }}</p>
        </div>
      </div>

      <div class="feature-dots" role="tablist" aria-label="Feature highlights">
        <button
          v-for="(feature, i) in features"
          :key="i"
          class="feature-dot"
          :class="{ 'feature-dot--active': i === currentFeatureIndex }"
          :aria-label="feature.title"
          :aria-selected="i === currentFeatureIndex"
          role="tab"
          @click="goToFeature(i)"
        />
      </div>

      <p class="kroger-note">
        <i class="pi pi-info-circle" aria-hidden="true"></i>
        Connecting a Kroger account is optional — sign up and generate recipes right away.
        Connect Kroger later to search products and add ingredients to your cart.
      </p>

      <footer class="showcase-footer">
        © 2026 ErrandAI · Built by Max Hughes
      </footer>
    </div>

    <!-- Right: form -->
    <div class="login-form-panel">
      <LoginForm v-if="!signingIn" @signing-in="signingIn = true" />
      <LoadingSpinner v-else message="Logging you in! Just a sec…" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ─── Layout ─────────────────────────────────────────────── */
.login-page {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
  gap: 25px;
}

/* ─── Showcase (left 55 %) ───────────────────────────────── */
.login-showcase {
  // flex: 0 0 55%;
  max-width: 40%;
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: var(--space-2xl) var(--space-xl);
  gap: var(--space-lg);
  max-height: 80vh;
  border-radius: var(--radius-card);
  margin-left: 32px;
}

/* Brand */
.showcase-title {
  margin: 0 0 var(--space-xs);
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 4vw + 0.5rem, 4rem);
  font-weight: 700;
  font-style: normal;
  color: var(--color-ink);
  line-height: 1.05;
  letter-spacing: -0.02em;
}

.showcase-ai {
  color: var(--color-accent);
}

.showcase-tagline {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-ink-2);
  font-weight: 400;
  line-height: 1.55;
  max-width: 42ch;
}

.showcase-inline-emphasis-text {
  margin: 2px;
  text-decoration: underline;
}

/* Feature card */
.feature-card {
  width: 100%;
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  padding: var(--space-md) var(--space-lg);
  min-height: 110px;
  transition: opacity var(--dur-short) var(--ease-in-out);

  &.feature-card--out { opacity: 0; }
  &.feature-card--in  { opacity: 1; }
}

.feature-icon {
  flex-shrink: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: var(--color-accent-dim);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.15rem;
    color: var(--color-accent);
  }
}

.feature-body { flex: 1; min-width: 0; }

.feature-title {
  margin: 0 0 var(--space-2xs);
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: 700;
  color: var(--color-ink);
}

.feature-desc {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.6;
  overflow-wrap: break-word;
}

/* Dots */
.feature-dots {
  display: flex;
  gap: var(--space-2xs);
  align-items: center;
}

.feature-dot {
  padding: 0;
  height: 8px;
  width: 8px;
  border-radius: var(--radius-pill);
  border: none;
  background: var(--color-rule);
  cursor: pointer;
  transition:
    background var(--dur-micro) var(--ease-out),
    width var(--dur-short) var(--ease-out);

  &.feature-dot--active {
    background: var(--color-accent);
    width: 24px;
  }

  &:hover:not(.feature-dot--active) {
    background: var(--color-ink-2);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 3px;
  }
}

/* Kroger note */
.kroger-note {
  margin: 0;
  padding: var(--space-sm) var(--space-md);
  width: 100%;
  border-radius: var(--radius-card);
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  color: var(--color-ink);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.6;

  i {
    color: var(--color-accent-2);
    margin-right: var(--space-2xs);
    vertical-align: middle;
  }
}

/* Footer */
.showcase-footer {
  margin-top: auto;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}

/* ─── Form panel (right 45 %) ─────────────────────────────── */
.login-form-panel {
  // padding: var(--space-xl) var(--space-lg);
  background: var(--color-paper);
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 860px) {
  .login-page { flex-direction: column; }

  .login-showcase {
    flex: none;
    max-width: 100%;
    padding: var(--space-xl) var(--space-lg);
    gap: var(--space-md);
  }

  .login-form-panel {
    padding: var(--space-lg) var(--space-md);
  }
}

@media (max-width: 480px) {
  .login-showcase {
    padding: var(--space-lg) var(--space-md);
  }

  .feature-card {
    gap: var(--space-sm);
    padding: var(--space-sm) var(--space-md);
    min-height: auto;
  }
}
</style>
