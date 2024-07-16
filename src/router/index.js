import { createRouter, createWebHistory } from 'vue-router';
import AuthComponent from '../components/AuthComponent.vue';
import RepositoryList from '../components/RepositoryList.vue';
import DigitalSignatureEnvelopes from '../components/EnvelopeList.vue';

const routes = [
  { path: '/', component: AuthComponent },
  { path: '/digital-signature/repositories', component: RepositoryList, meta: { requiresAuth: true } },
  { path: '/digital-signature/repositories/:id', component: DigitalSignatureEnvelopes, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('jwt') !== null;
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next('/');
  } else {
    next();
  }
});

export default router;
