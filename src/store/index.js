import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(localStorage.getItem('jwt') !== null);

  const login = (token) => {
    localStorage.setItem('jwt', token);
    isAuthenticated.value = true;
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    isAuthenticated.value = false;
  };

  return { isAuthenticated, login, logout };
});
