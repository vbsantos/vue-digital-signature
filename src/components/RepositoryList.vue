<template>
  <div class="container mt-5">
    <button class="btn btn-warning float-end" @click="logout">Logoff</button>
    <h1 class="my-5">Repositórios</h1>
    <button class="btn btn-primary mb-3" @click="showCreateRepositoryModal">Criar Novo Repositório</button>

    <div v-if="loading">Carregando...</div>

    <div v-else-if="repositories.length === 0" class="my-2">Nenhum dado disponível</div>

    <div v-else>
      <ul class="my-2 list-group" style="cursor: pointer;">
        <li v-for="repository in repositories" :title="formatTitle(repository)" :key="repository.id" class="list-group-item" @click="navigateToRepository(repository.id)">
          {{ repository.name }}
        </li>
      </ul>
    </div>

    <CreateRepositoryModal
      v-if="showCreateRepository"
      :show="showCreateRepository"
      :closeModal="closeCreateRepositoryModal"
      :fetchRepositories="fetchRepositories"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store';
import { formatDate, formatTitle } from '../common/auxiliar';

import CreateRepositoryModal from '../modals/CreateRepositoryModal.vue';

export default {
  name: 'RepositoryList',
  components: {
    CreateRepositoryModal
  },
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const repositories = ref([]);
    const loading = ref(true);
    const showCreateRepository = ref(false);
    const apiUrl = import.meta.env.VITE_API_URL;

    const logout = () => {
      authStore.logout();
      router.push('/');
    };

    const fetchRepositories = async () => {
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${apiUrl}/api/digitalSignature/repository`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        toast("É necessário logar novamente", { autoClose: 2000 });
        authStore.logout();
        router.push('/');
        return;
      }
      const data = await response.json();
      repositories.value = data.repositories || [];
    };

    const navigateToRepository = (id) => {
      router.push(`/digital-signature/repositories/${id}`);
    };

    const loadRepositories = async () => {
      try {
        await fetchRepositories();
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        loading.value = false;
      }
    };

    const showCreateRepositoryModal = () => {
      showCreateRepository.value = true;
    };

    const closeCreateRepositoryModal = () => {
      showCreateRepository.value = false;
    };

    onMounted(loadRepositories);

    return {
      repositories,
      loading,
      formatDate,
      formatTitle,
      showCreateRepository,
      showCreateRepositoryModal,
      closeCreateRepositoryModal,
      fetchRepositories,
      navigateToRepository,
      logout
    };
  }
};
</script>
