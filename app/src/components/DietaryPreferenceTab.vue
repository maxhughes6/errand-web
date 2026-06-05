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
  <div class="dietary-preference-tab">
    <span class="label">{{ formatLabel(label) }}</span>
    <button
      class="dismiss-button"
      type="button"
      aria-label="Remove dietary preference"
      @click="emit('close', label)"
    >
      <span aria-hidden="true" class="dismiss-button-icon">&times;</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.dietary-preference-tab {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 14px;
  border-radius: 999px;
  background: #efe8ff;
  border: 1px solid #d7c6ff;
  color: #4713a3;
}

.label {
  font-size: 0.95rem;
  line-height: 1;
  text-transform: capitalize;
}

.dismiss-button {
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;
  padding: 0;
  background: #efe8ff;
}

.dismiss-button-icon {
  font-size: 32px;
}
</style>