<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Desafio AVMB</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <span class="nav-link">{{ user.email }}</span>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-danger" @click="logout">Logoff</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { computed } from 'vue';
import { useAuthStore } from '../store';

export default {
  name: 'Navbar',
  setup() {
    const authStore = useAuthStore();
    const user = computed(() => authStore.user);

    const logout = () => {
      authStore.logout();
    };

    return {
      user,
      logout
    };
  }
};
</script>

<style scoped>
.nav-link {
  cursor: default;
}
</style>
