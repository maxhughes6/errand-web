import { createRouter, createWebHistory } from 'vue-router'
import { Home, Browse, Recipes, Product, Login, MyRecipes, Settings, UserSignup, AuthCallback } from '../src/pages';
import { amplifyAuthService } from '../src/amplify/amplifyAuthService';
import { sessionState } from '../src/state';

const PUBLIC_ROUTES = ['/login', '/user-signup', '/auth/callback'];

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: Home },
  { path: '/browse', component: Browse },
  { path: '/browse/:productId', component: Product},
  { path: '/recipes', component: Recipes },
  { path: '/my-recipes', component: MyRecipes },
  { path: '/settings', component: Settings },
  { path: '/auth/callback', component: AuthCallback },
  { path: '/user-signup', component: UserSignup },
  { path: '/login', component: Login },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, _, next) => {
  if (to.query.code && to.path !== '/auth/callback') {
    next({ path: '/auth/callback', query: to.query });
    return;
  }

  if (PUBLIC_ROUTES.includes(to.path)) {
    next();
    return;
  }

  const authenticated = await amplifyAuthService.isAuthenticated();
  if (!authenticated) {
    next('/login');
    return;
  }

  if (to.path.startsWith('/browse/') && !sessionState.getIsKrogerAccountConnected()) {
    next('/browse');
    return;
  }

  next();
});

export default router