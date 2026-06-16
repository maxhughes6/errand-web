<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const formatLabel = (value) => value.replaceAll('-', ' ');
</script>

<template>
  <div class="pref-tag">
    <span class="pref-label">{{ formatLabel(label) }}</span>
    <button
      class="pref-dismiss"
      type="button"
      aria-label="Remove dietary preference"
      @click="emit('close', label)"
    >
      <i class="pi pi-times" aria-hidden="true"></i>
    </button>
  </div>
</template>

<style scoped lang="scss">
.pref-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-2xs) var(--space-2xs) var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-pill);
  background: var(--color-accent-2-bg);
  border: 1px solid var(--color-accent-2-border);
  color: var(--color-accent-2);
  font-family: var(--font-body);
}

.pref-label {
  font-size: var(--text-sm);
  font-weight: 600;
  line-height: 1;
  text-transform: capitalize;
}

.pref-dismiss {
  width: 22px;
  height: 22px;
  border: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: oklch(64% 0.13 148 / 0.15);
  color: var(--color-accent-2);
  cursor: pointer;
  padding: 0;
  font-size: 0.65rem;
  transition:
    background var(--dur-micro) var(--ease-out),
    color var(--dur-micro) var(--ease-out);

  &:hover {
    background: var(--color-accent-2);
    color: #fff;
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
}
</style>
