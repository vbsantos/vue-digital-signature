<script setup>
import { useAuthStore } from './store';
import { useRouter } from 'vue-router';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

const authStore = useAuthStore();
const router = useRouter();

if (authStore.isAuthenticated) {
  router.push('/digital-signature/repositories');
}
</script>

<template>
  <router-view />
</template>
