<script setup>
import { onMounted, onUnmounted } from "vue";
import { AuthorizationSuccessDialog, Navbar, PageFooter } from "./components";
import { RouterView, useRoute } from "vue-router";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";

const route = useRoute();
const toast = useToast();

function showNavbarAndFooter() {
  return route.path !== "/login" && route.path !== "/auth/callback" && route.path !== "/user-signup";
}

const handleSessionExpired = () => {
  toast.add({ severity: 'warn', summary: 'Session Expired', detail: 'Please log in again.', life: 3000 });
};

onMounted(() => window.addEventListener('session-expired', handleSessionExpired));
onUnmounted(() => window.removeEventListener('session-expired', handleSessionExpired));
</script>

<template>
  <Toast />
  <div id="app-wrapper">
    <Navbar v-if="showNavbarAndFooter()"></Navbar>
    <AuthorizationSuccessDialog />
    <div id="page-container">
      <router-view/>
    </div>
    <PageFooter v-if="showNavbarAndFooter()"></PageFooter>
  </div>
</template>

<style scoped>
#app-wrapper {
  min-height: 100vh;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
#page-container {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 3.5rem 0 3.5rem 0;
  box-sizing: border-box;

}
</style>
