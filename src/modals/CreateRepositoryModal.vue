<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Criar Novo Repositório</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="repositoryName" class="form-label">Nome do Repositório</label>
            <input type="text" class="form-control" id="repositoryName" v-model="name"
              placeholder="Nome do Repositório" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Fechar</button>
          <button type="button" class="btn btn-primary" @click="createRepository">Criar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  props: ['show', 'closeModal', 'fetchRepositories'],
  data() {
    return {
      name: ''
    };
  },
  methods: {
    async createRepository() {
      if (!this.name) {
        alert('Por favor, preencha o nome do repositório.');
        return;
      }

      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/digitalSignature/repository`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: this.name })
        });
        if (response.status === 401) {
        toast("É necessário logar novamente", { autoClose: 2000 });
          localStorage.removeItem('jwt');
          this.$router.push('/');
          return;
        }
        await this.fetchRepositories();
        this.closeModal();
        toast("Repositório criado com sucesso", { autoClose: 2000 });
      } catch (error) {
        toast("Erro ao criar repositório", { autoClose: 2000 });
        console.error('Erro ao criar repositório:', error);
      }
    }
  }
};
</script>

<style scoped>
.modal.show.d-block {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
