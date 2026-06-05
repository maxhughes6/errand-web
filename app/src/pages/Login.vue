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
      "Set your dietary preferences once and every recommendation will match — vegetarian, keto, gluten-free, and more.",
  },
  {
    icon: "pi pi-cart-arrow-down",
    title: "Add to Cart in One Click",
    description:
      "Add all recipe ingredients to your Kroger cart with a single click. Connecting Kroger is optional and can be done after signing up.",
  },
  {
    icon: "pi pi-search",
    title: "Grocery Product Search",
    description:
      "Browse real Kroger products and get recipe ideas using around what you find.",
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
  }, 380);
}

function cycleFeature() {
  isFeatureVisible.value = false;
  setTimeout(() => {
    currentFeatureIndex.value =
      (currentFeatureIndex.value + 1) % features.length;
    isFeatureVisible.value = true;
  }, 380);
}

onMounted(() => {
  intervalId = setInterval(cycleFeature, 5000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div class="login-page">
    <!-- Feature Showcase Panel -->
    <div class="login-showcase">
      <div class="showcase-brand">
        <p class="showcase-eyebrow">Welcome to</p>
        <h1 class="showcase-title">ErrandAI</h1>
        <p class="showcase-tagline">Your AI-powered grocery companion</p>
      </div>

      <div
        class="feature-card"
        :class="{
          'feature-fade-out': !isFeatureVisible,
          'feature-fade-in': isFeatureVisible,
        }"
      >
        <div class="feature-icon">
          <i :class="features[currentFeatureIndex].icon"></i>
        </div>
        <div class="feature-body">
          <h3 class="feature-title">
            {{ features[currentFeatureIndex].title }}
          </h3>
          <p class="feature-description">
            {{ features[currentFeatureIndex].description }}
          </p>
        </div>
      </div>

      <div class="feature-dots" role="tablist" aria-label="Feature highlights">
        <button
          v-for="(feature, i) in features"
          :key="i"
          class="feature-dot"
          :class="{ active: i === currentFeatureIndex }"
          :aria-label="feature.title"
          :aria-selected="i === currentFeatureIndex"
          role="tab"
          @click="goToFeature(i)"
        />
      </div>

      <p class="kroger-note">
        <i class="pi pi-info-circle"></i>
        Connecting a Kroger account is optional — sign up and generate recipes
        right away. Connect Kroger later to search products and add ingredients
        to your cart.
      </p>
    </div>

    <!-- Login / Sign-up Panel -->
    <div class="login-form-panel">
      <LoginForm v-if="!signingIn" @signing-in="signingIn = true" />
      <LoadingSpinner v-else message="Logging you in! Just a sec..." />
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ─── Layout ─────────────────────────────────────────────────── */
.login-page {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  max-width: 1120px;
  width: calc(100% - 4rem);
  margin: 2.5rem auto;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

/* ─── Showcase (left) ─────────────────────────────────────────── */
.login-showcase {
  flex: 0 0 50%;
  max-width: 50%;
  background: linear-gradient(160deg, #2a0c6e 0%, #4713a3 52%, #6e3ff3 100%);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3.5rem 2.5rem;
  gap: 2rem;
  position: relative;
  overflow: hidden;
  font-family: "Montserrat", sans-serif;
}

/* Brand */
.showcase-brand {
  text-align: center;
  z-index: 1;
}

.showcase-eyebrow {
  margin: 0 0 0.4rem;
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.showcase-title {
  margin: 0 0 0.5rem;
  font-size: clamp(2.6rem, 4.5vw, 3.8rem);
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.03em;
  font-family: "Montserrat", sans-serif;
}

.showcase-tagline {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.05rem;
  font-weight: 400;
}

/* Feature card */
.feature-card {
  z-index: 1;
  width: 100%;
  max-width: 460px;
  display: flex;
  gap: 1.25rem;
  align-items: flex-start;
  background: rgba(255, 255, 255, 0.11);
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 20px;
  padding: 1.75rem;
  transition: opacity 0.38s ease;
  min-height: 168px;

  &.feature-fade-out {
    opacity: 0;
  }

  &.feature-fade-in {
    opacity: 1;
  }
}

.feature-icon {
  flex-shrink: 0;
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 1.4rem;
    color: #fff;
  }
}

.feature-body {
  flex: 1;
  min-width: 0;
}

.feature-title {
  margin: 0 0 0.45rem;
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  font-family: "Montserrat", sans-serif;
}

.feature-description {
  margin: 0;
  font-size: 0.93rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.65;
  font-family: "Montserrat", sans-serif;
}

/* Dot nav */
.feature-dots {
  z-index: 1;
  display: flex;
  gap: 0.55rem;
  align-items: center;
}

.feature-dot {
  padding: 0;
  height: 8px;
  width: 8px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.38);
  cursor: pointer;
  transition: background 0.22s ease, width 0.22s ease;

  &.active {
    background: #fff;
    width: 26px;
  }

  &:hover:not(.active) {
    background: rgba(255, 255, 255, 0.62);
  }

  &:focus-visible {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 3px;
  }
}

/* Kroger note */
.kroger-note {
  z-index: 1;
  margin: 0;
  padding: 0.9rem 1.1rem;
  max-width: 460px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.09);
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.85rem;
  line-height: 1.6;
  text-align: center;
  font-family: "Montserrat", sans-serif;

  i {
    margin-right: 0.35rem;
    vertical-align: middle;
    color: rgba(255, 255, 255, 0.85);
  }
}

/* ─── Form panel (right) ──────────────────────────────────────── */
.login-form-panel {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2.5rem;
  background: #f8f5ff;
}

/* ─── Responsive ─────────────────────────────────────────────── */
@media (max-width: 860px) {
  .login-page {
    flex-direction: column;
  }

  .login-showcase {
    flex: none;
    max-width: 100%;
    padding: 2.5rem 1.75rem;
    gap: 1.5rem;
  }

  .login-form-panel {
    padding: 2rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .login-showcase {
    padding: 2rem 1.25rem;
    gap: 1.25rem;
  }

  .login-form-panel {
    padding: 1.5rem 1rem;
  }

  .feature-card {
    padding: 1.25rem;
    gap: 1rem;
    min-height: 120px;
  }
}
</style>
