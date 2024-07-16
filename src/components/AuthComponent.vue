<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <h1 class="text-center mb-5">Desafio AVMB</h1>
      <div class="col-md-6">
        <h3 class="text-center">{{ isLogin ? 'Login' : 'Registro' }}</h3>
        <form @submit.prevent="authenticate" class="mt-4">
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" class="form-control" id="email" v-model="email" required>
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Senha:</label>
            <input type="password" class="form-control" id="password" v-model="password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100">{{ isLogin ? 'Login' : 'Registrar' }}</button>
          <button type="button" class="btn btn-link w-100 mt-2" @click="toggleAuthMode">
            {{ isLogin ? 'Criar Conta' : 'Já tenho uma conta' }}
          </button>
        </form>
        <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const email = ref('');
const password = ref('');
const error = ref('');
const isLogin = ref(true);
const apiUrl = import.meta.env.VITE_API_URL;
const authStore = useAuthStore();
const router = useRouter();

const authenticate = async () => {
  error.value = '';
  const endpoint = isLogin.value ? '/api/account/login' : '/api/account/register';
  try {
    const response = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    });
    console.log({response});
    if (!response.ok) {
      toast("Falha na autenticação", { autoClose: 2000 });
      throw new Error('Falha na autenticação');
    }
    if (!isLogin.value) {
      toast("Registro efetuado com sucesso", { autoClose: 2000 });
      isLogin.value = true;
      return;
    }
    const data = await response.json();
    authStore.login(data.accessToken);
    toast("Login efetuado com sucesso", { autoClose: 2000 });
    router.push('/digital-signature/repositories');
  } catch (err) {
    toast("Erro ao fazer login", { autoClose: 2000 });
    console.error('Erro ao autenticar:', err);
    error.value = err.message;
  }
};

const toggleAuthMode = () => {
  isLogin.value = !isLogin.value;
  email.value = '';
  password.value = '';
  error.value = '';
};
</script>

<style scoped>
.error {
  color: red;
}
</style>
