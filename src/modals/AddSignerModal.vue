<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Adicionar Signatário</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="signerName" class="form-label">Nome do Signatário</label>
            <input type="text" class="form-control" id="signerName" v-model="signerName" placeholder="Nome do Signatário" />
          </div>
          <div class="mb-3">
            <label for="signerEmail" class="form-label">Email do Signatário</label>
            <input type="email" class="form-control" id="signerEmail" v-model="signerEmail" placeholder="Email do Signatário" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Fechar</button>
          <button type="button" class="btn btn-primary" @click="addSigner">Adicionar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';

export default {
  props: ['show', 'closeModal', 'repositoryId', 'envelopeId', 'fetchEnvelopes'],
  data() {
    return {
      signerName: '',
      signerEmail: ''
    };
  },
  methods: {
    async addSigner() {
      if (!this.signerName || !this.signerEmail) {
        alert('Por favor, preencha o nome e o email do signatário.');
        return;
      }

      try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/digitalSignature/repository/${this.repositoryId}/envelope/${this.envelopeId}/signatory`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: this.signerName, email: this.signerEmail })
        });
        if (response.status === 401) {
          toast("É necessário logar novamente", { autoClose: 2000 });
          localStorage.removeItem('jwt');
          this.$router.push('/');
          return;
        }
        await this.fetchEnvelopes();
        toast("Signatário adicionado com sucesso", { autoClose: 2000 });
        this.closeModal();
      } catch (error) {
        toast("Erro ao adicionar signatário", { autoClose: 2000 });
        console.error('Erro ao adicionar signatário:', error);
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
