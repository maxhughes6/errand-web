<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { Button, Menu } from 'primevue';
import { amplifyAuthService } from '../amplify/amplifyAuthService';
import { userState } from '../state/userState';
import { krogerStores } from '../constants';


const router = useRouter();

function handleBrandClick() {
    router.push('/home');
}

const isLoggedIn = ref(false);

const menu = ref();

const handleCartClick = () => {
    const userPreferredStore = userState.getUser().errandUserData.preferredStore;
    const cartUrl = krogerStores[userPreferredStore].cartUrl;
    window.open(cartUrl, '_blank');
};

const handleMyRecipes = () => {
    router.push('/my-recipes');
};

const handleLogout = async () => {
    try {
        await amplifyAuthService.logout();
        userState.clearUser();
        window.sessionStorage.clear();
        router.push('/login');
    } catch (error) {
        userState.clearUser();
        window.sessionStorage.clear();
        router.push('/login');
    }
};

const items = ref([
    {
        items: [
            {
                label: 'My Cart',
                icon: 'pi pi-shopping-cart',
                command: handleCartClick
            },
            {
                label: 'My recipes',
                icon: 'pi pi-bookmark-fill',
                command: handleMyRecipes
            },
            {
                label: 'Log out',
                icon: 'pi pi-sign-out',
                command: handleLogout
            },
        ]
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};

onMounted(() => {
    const krogerAuthCode = window.sessionStorage.getItem('authenticatedAccessToken');
    isLoggedIn.value = !!krogerAuthCode;
})
</script>

<template>
    <nav id="header">
        <div id="brand" @click="handleBrandClick()">
            <svg class="brand-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                <path d="M16 10a4 4 0 01-8 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <h1>ErrandAI</h1>
        </div>
        <div class="nav-center">
            <router-link class="navigation-link" to="/home">Home</router-link>
            <router-link class="navigation-link" to="/recipes">Recipes</router-link>
            <router-link class="navigation-link" to="/browse">Browse</router-link>
        </div>
        <div class="nav-profile">
            <Button type="button" icon="pi pi-user" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu" label="My profile" style="font-size: 1.1rem" />
            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
        </div>
    </nav>
</template>

<style scoped lang="scss">
#header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 80px;
    background: linear-gradient(90deg, #4713a3 60%, #6e3ff3 100%);
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    border-radius: 0 0 18px 18px;
    padding: 0 10px;
    box-shadow: 0 2px 16px 0 rgba(71, 19, 163, 0.10);
    z-index: 100;
    font-family: "Montserrat", sans-serif;
}

#brand {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
    margin: 0;
    cursor: pointer;
    user-select: none;
    letter-spacing: 3px;

    h1 {
        font-size: 2rem;
        font-family: "Montserrat", sans-serif;
        font-weight: 800;
        letter-spacing: 2px;
        margin: 0;
        color: #ffffff;
        transition: color 0.2s;
    }

    .brand-icon {
        width: 1.75rem;
        height: 1.75rem;
        color: #c9b8ff;
        flex-shrink: 0;
        transition: color 0.2s, transform 0.2s;
    }

    &:hover {
        h1 {
            color: #c9b8ff;
        }

        .brand-icon {
            color: #ffffff;
            transform: rotate(-8deg) scale(1.1);
        }
    }
}

.nav-center {
    display: flex;
    flex: 1;
    justify-content: center;
    align-items: center;
    gap: 2.5rem;
}

.navigation-link {
    color: white;
    text-decoration: none;
    font-size: 1.15rem;
    font-weight: 500;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    transition: background 0.18s, color 0.18s, box-shadow 0.18s;
    position: relative;
    font-family: "Montserrat", sans-serif;
}

.navigation-link:hover,
.navigation-link.router-link-exact-active {
    background: rgba(255, 255, 255, 0.13);
    color: #fff;
    box-shadow: 0 2px 8px 0 rgba(71, 19, 163, 0.10);
    text-decoration: none;
}

.nav-profile {
    font-size: 1.1rem;
    font-weight: 500;
    background: rgba(255, 255, 255, 0.10);
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.18s;
    user-select: none;
    font-family: "Montserrat", sans-serif;
    margin-right: 20px;
}

.nav-profile:hover {
    background: rgba(255, 255, 255, 0.18);
}

.nav-profile .p-button {
    gap: 10px;
}

</style>

<style lang="scss">
/* Global styles for overlay menu (renders outside component scope) */
#overlay_menu {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(71, 19, 163, 0.15);
    border: 1px solid rgba(71, 19, 163, 0.08);
    padding: 5px;
    min-width: 200px;
    margin-top: 0.5rem;

    #overlay_menu_list {
        margin-bottom: 10px;
    }

    .p-menu-item-link {
        padding: 0.75rem 1rem;
        border-radius: 8px;
        transition: background 0.18s, color 0.18s;
        color: #333;
        font-family: "Montserrat", sans-serif;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .p-menu-item-link:hover {
        background: rgba(71, 19, 163, 0.08);
        color: #4713a3;

        .p-menu-item-text {
            color: #4713a3;
        }
    }

    .p-menu-item-icon {
        color: #4713a3;
        font-size: 1.1rem;
    }

    .p-menu-item-text {
        color: #333;
        font-weight: 500;
    }

    // Red icon for logout (last item)
    .p-menu-item:last-child .p-menu-item-icon {
        color: #d32f2f;
    }

    .p-menu-item:last-child .p-menu-item-link:hover .p-menu-item-icon {
        color: #c62828;
    }
}
</style>