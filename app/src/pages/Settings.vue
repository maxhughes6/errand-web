<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { userState } from "../state";

const user = ref({}) as any;

onMounted(async () => {
  user.value = userState.getUser();
});
</script>

<template>
  <div class="page-container">
    <div class="page-content">
      <h1>Settings</h1>
      <p class="page-description">Hey, {{ user.preferredName }}. These are your settings and preferences.</p>
      <div class="empty-state">
        <p>This page is under construction. Account settings will be available here soon.</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 2rem;
  font-family: "Montserrat", sans-serif;
}

.page-content {
  width: 100%;
  max-width: 1100px;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  padding: 2.5rem;

  h1 {
    color: #4713a3;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    font-family: "Montserrat", sans-serif;
  }

  .page-description {
    color: #5d4a7a;
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
  }
}

.empty-state {
  padding: 3rem 2rem;
  text-align: center;
  border: 2px dashed #e0d4f7;
  border-radius: 12px;
  background: #f9f7ff;

  p {
    color: #5d4a7a;
    font-size: 1rem;
    margin: 0;
  }
}
</style>
