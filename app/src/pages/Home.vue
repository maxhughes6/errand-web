<script setup lang="ts">
import { userState } from "../state";
import { onMounted, ref } from 'vue';
import { Button } from 'primevue';
import { ReauthorizationAlert } from "../components";
import { sessionState } from "../state";

let user = ref({}) as any;
let userName = ref("there");
let mustReauthorize = ref(true);

onMounted(async () => {
  user.value = userState.getUser();
  userName.value = user.value.preferredName || "there";
  mustReauthorize.value = sessionState.getMustReauthorize();
});
</script>


<template>
  <div id="homepage-container">
    <ReauthorizationAlert v-if="mustReauthorize" redirect-page="home" />
    <div id="homepage-header-tile">
      <h1>Hey {{ userName }}! Welcome to Errand!</h1>
      <p>
        Errand is a grocery shopping app that uses AI to help you come up with recipe ideas and
        add ingredients to your cart. It is built using the Kroger API, Anthropic Claude and Vue.
      </p>
      <p>
        To get started, click on one of the buttons below, or use the navigation bar at the top to explore the app!
      </p>
      <span class="dev-credit">
        Built by Max Hughes
        <Button icon="pi pi-linkedin" aria-label="LinkedIn" as="a" href="https://www.linkedin.com/in/maxwell-hughes-998449207" target="_blank" rel="noopener"></Button>
        <Button icon="pi pi-github" aria-label="GitHub" as="a" href="https://https://github.com/maxhughes6" target="_blank" rel="noopener"></Button>
      </span>
    </div>

    <div id="homepage-tile">
      <h2>Explore new ways to do your grocery shopping with Errand!</h2>
      <hr class="heading-underline" />

      <div class="button-group">
        <router-link class="tile-btn" to="/recipes">
          <div class="tile-header">
            <span class="icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="14" height="12" rx="2" stroke="#4713a3" stroke-width="2" />
                <path d="M7 4V16" stroke="#4713a3" stroke-width="2" />
              </svg>
            </span>
            <span class="tile-title">Recipes</span>
          </div>
          <div class="tile-desc">Use AI to generate recipe ideas, and add their ingredients directly to your cart!</div>
        </router-link>
        <router-link class="tile-btn" to="/browse">
          <div class="tile-header">
            <span class="icon" aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="#4713a3" stroke-width="2" />
                <line x1="14.2929" y1="14.7071" x2="18" y2="18.4142" stroke="#4713a3" stroke-width="2" />
              </svg>
            </span>
            <span class="tile-title">Browse</span>
          </div>
          <div class="tile-desc">Search for groceries, produce, snacks and more from the Kroger catalog, and get AI
            suggested recipes using them!</div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#homepage-header-tile {
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  padding: 1.5rem;
  width: 100%;
}

#homepage-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-block: 10vh;
  max-width: 1100px;
  a {
    text-decoration: none;
  }
}

#homepage-tile {
  font-family: "Montserrat", sans-serif;
  display: block;
  border-radius: 18px;
  box-shadow: 0 4px 24px 0 rgba(71, 19, 163, 0.10), 0 1.5px 6px 0 rgba(71, 19, 163, 0.08);
  padding: 2.5rem 2rem 2rem 2rem;
  margin: 3rem auto 0 auto;
  min-height: 40vh;
  width: 100%;
}

h1 {
  color: #4713a3;
  font-size: 40px;
}

h2 {
  text-align: center;
  margin-top: 0;
}

.heading-underline {
  border: none;
  border-bottom: 2.5px solid #4713a3;
  width: 60%;
  margin: 0.5rem auto 1.5rem auto;
  opacity: 0.7;
  border-radius: 2px;
}

.button-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.tile-btn {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 360px;
  max-width: 95vw;
  padding: 1.3rem 1.5rem 1.1rem 1.5rem;
  border: 2px solid #4713a3;
  border-radius: 16px;
  background: #fff;
  color: #4713a3;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.2s, color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 12px 0 rgba(71, 19, 163, 0.07);
  gap: 0.5rem;
}

.tile-btn:hover {
  background: #cbb1fd;
  color: #4713a3;
  box-shadow: 0 4px 18px 0 rgba(71, 19, 163, 0.13);
}

.tile-btn:hover .icon svg {
  fill: #fff;
}

.tile-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.tile-title {
  font-size: 1.25rem;
  font-weight: 600;
  font-family: "Montserrat", sans-serif;
}

.tile-desc {
  font-size: 0.98rem;
  color: #5d4a7a;
  font-family: "Montserrat", sans-serif;
  text-align: left;
  text-decoration: none;
}

.icon {
  display: flex;
  align-items: center;
}

.dev-credit {
  display: flex;
  flex-direction: row;
  gap: 8px;
}
</style>