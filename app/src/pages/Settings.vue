<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userState } from "../state";

const user = ref({}) as any;

onMounted(async () => {
  user.value = userState.getUser();
});
</script>

<template>
  <div class="settings-page">
    <header class="page-header">
      <h1 class="page-heading">Settings</h1>
      <p class="page-sub">Hey, {{ user.preferredName }}. Your preferences and account settings live here.</p>
    </header>

    <div class="empty-state">
      <i class="pi pi-wrench empty-icon" aria-hidden="true"></i>
      <p class="empty-text">This page is under construction. Account settings will be available here soon.</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  width: 100%;
  max-width: 1100px;
  padding: var(--space-2xl) var(--space-lg) var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

/* ─── Header ─────────────────────────────────────────────── */
.page-heading {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 600;
  font-style: normal;
  color: var(--color-ink);
  letter-spacing: -0.02em;
  margin: 0 0 var(--space-2xs);
}

.page-sub {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
}

/* ─── Empty state ────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-2xl) var(--space-xl);
  text-align: center;
  border: 2px dashed var(--color-rule);
  border-radius: var(--radius-card);
  background: var(--color-paper-2);
}

.empty-icon {
  font-size: 2rem;
  color: var(--color-ink-2);
  opacity: 0.5;
}

.empty-text {
  font-family: var(--font-body);
  font-size: var(--text-base);
  color: var(--color-ink-2);
  margin: 0;
  max-width: 48ch;
}

@media (max-width: 600px) {
  .settings-page { padding: var(--space-xl) var(--space-md) var(--space-lg); }
}
</style>
