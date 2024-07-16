<script setup>
import { useAuthStore } from './store';
import { useRouter } from 'vue-router';
import "bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"
import 'vue3-toastify/dist/index.css';

const authStore = useAuthStore();
const router = useRouter();

if (authStore.isAuthenticated) {
  router.push('/digital-signature/repositories');
}
</script>

<template>
  <router-view />
</template>

<style>
body {
  background-color: #dce3f8a4;
}
</style>