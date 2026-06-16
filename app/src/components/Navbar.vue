<script setup>
import { useRouter } from 'vue-router';
import { onMounted, onUnmounted, ref } from 'vue';
import { Button, Menu } from 'primevue';
import { amplifyAuthService } from '../amplify/amplifyAuthService';
import { userState } from '../state/userState';
import { krogerStores } from '../constants';

const router = useRouter();
const menu = ref();
const scrolled = ref(false);

const handleCartClick = () => {
  const userPreferredStore = userState.getUser().errandUserData.preferredStore;
  const cartUrl = krogerStores[userPreferredStore].cartUrl;
  window.open(cartUrl, '_blank');
};

const handleMyRecipes = () => router.push('/my-recipes');

const handleLogout = async () => {
  try {
    await amplifyAuthService.logout();
  } finally {
    userState.clearUser();
    window.sessionStorage.clear();
    router.push('/login');
  }
};

const items = ref([
  {
    items: [
      { label: 'My Cart',    icon: 'pi pi-shopping-cart', command: handleCartClick },
      { label: 'My recipes', icon: 'pi pi-bookmark-fill', command: handleMyRecipes },
      { label: 'Log out',    icon: 'pi pi-sign-out',      command: handleLogout },
    ]
  }
]);

const toggle = (event) => menu.value.toggle(event);

const onScroll = () => { scrolled.value = window.scrollY > 8; };
onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <nav id="nav" :class="{ 'nav--scrolled': scrolled }" aria-label="Main navigation">
    <!-- Brand (left) -->
    <button class="nav-brand" @click="router.push('/home')" aria-label="Go to home">
      <i class="pi pi-shopping-cart nav-brand__icon" aria-hidden="true"></i>
      <span class="nav-brand__text">
        errand<span class="nav-brand__ai">ai</span>
      </span>
    </button>

    <!-- Links (centre) -->
    <div class="nav-links" role="list">
      <router-link class="nav-link" to="/home"    role="listitem">Home</router-link>
      <router-link class="nav-link" to="/recipes" role="listitem">Recipes</router-link>
      <router-link class="nav-link" to="/browse"  role="listitem">Browse</router-link>
    </div>

    <!-- Profile (right) -->
    <div class="nav-actions">
      <Button
        type="button"
        icon="pi pi-user"
        label="My profile"
        class="nav-profile-btn"
        @click="toggle"
        aria-haspopup="true"
        aria-controls="nav_menu"
      />
      <Menu ref="menu" id="nav_menu" :model="items" :popup="true" />
    </div>
  </nav>
</template>

<style scoped lang="scss">
#nav {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: var(--nav-height);
  background: var(--color-paper);
  border-bottom: 1px solid var(--color-rule);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 var(--space-lg);
  z-index: var(--z-nav);
  transition: box-shadow var(--dur-short) var(--ease-out);
}

#nav.nav--scrolled {
  box-shadow: 0 2px 16px oklch(20% 0.012 50 / 0.06);
}

/* ─── Brand ──────────────────────────────────────────────── */
.nav-brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2xs) 0;
  text-decoration: none;
  justify-self: start;
}

.nav-brand__icon {
  font-size: 1.35rem;
  color: var(--color-accent);
  transition: transform var(--dur-short) var(--ease-out);
}

.nav-brand:hover .nav-brand__icon {
  transform: rotate(-8deg) scale(1.1);
}

.nav-brand__text {
  font-family: var(--font-body);
  font-weight: 900;
  font-size: 1.45rem;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  line-height: 1;
}

.nav-brand__ai {
  color: var(--color-accent);
}

/* ─── Links ──────────────────────────────────────────────── */
.nav-links {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  justify-self: center;
}

.nav-link {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--text-base);
  color: var(--color-ink-2);
  text-decoration: none;
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-btn);
  transition:
    color var(--dur-micro) var(--ease-out),
    background-color var(--dur-micro) var(--ease-out);
  white-space: nowrap;

  &:hover {
    color: var(--color-ink);
    background: var(--color-paper-2);
  }

  &.router-link-exact-active {
    color: var(--color-accent);
    background: var(--color-accent-dim);
  }

  &:focus-visible {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
}

/* ─── Actions ────────────────────────────────────────────── */
.nav-actions {
  display: flex;
  align-items: center;
  justify-self: end;
}

/* override global .p-button for the nav profile button */
.nav-profile-btn.p-button {
  background: transparent;
  border: 1px solid var(--color-rule);
  color: var(--color-ink);
  font-size: var(--text-sm);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-btn);
  gap: 5px;

  &:hover {
    background: var(--color-paper-2);
    border-color: var(--color-ink-2);
    box-shadow: none;
    transform: none;
  }
}

/* ─── Responsive ─────────────────────────────────────────── */
@media (max-width: 640px) {
  #nav {
    grid-template-columns: 1fr auto;
    padding: 0 var(--space-md);
  }

  .nav-links { display: none; }
}
</style>

<style lang="scss">
/* Global: overlay menu renders outside component scope */
#nav_menu {
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  box-shadow: 0 8px 24px oklch(20% 0.012 50 / 0.10);
  padding: var(--space-2xs);
  min-width: 200px;
  margin-top: var(--space-2xs);

  #nav_menu_list { margin-bottom: var(--space-2xs); }

  .p-menu-item-link {
    padding: var(--space-xs) var(--space-sm);
    border-radius: var(--radius-btn);
    transition: background-color var(--dur-micro) var(--ease-out);
    color: var(--color-ink);
    font-family: var(--font-body);
    font-size: var(--text-base);
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    text-decoration: none;

    &:hover {
      background: var(--color-paper-2);
      .p-menu-item-text { color: var(--color-ink); }
    }
  }

  .p-menu-item-icon { color: var(--color-accent); font-size: 1rem; }
  .p-menu-item-text { color: var(--color-ink); font-weight: 500; }

  .p-menu-item:last-child .p-menu-item-icon { color: var(--color-error); }
}
</style>
