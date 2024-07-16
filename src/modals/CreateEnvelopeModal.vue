<template>
  <div class="modal show d-block" tabindex="-1">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Criar Envelope</h5>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="envelopeDescription" class="form-label">Descrição</label>
            <input type="text" class="form-control" id="envelopeDescription" v-model="description"
              placeholder="Descrição" />
          </div>
          <div class="mb-3">
            <label for="envelopeFiles" class="form-label">Arquivos</label>
            <input type="file" class="form-control" id="envelopeFiles" multiple @change="handleFileUpload" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Fechar</button>
          <button type="button" class="btn btn-primary" @click="createEnvelope">Criar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { toast } from 'vue3-toastify';
export default {
  props: ['show', 'closeModal', 'repositoryId', 'fetchEnvelopes'],
  data() {
    return {
      description: '',
      files: []
    };
  },
  methods: {
    handleFileUpload(event) {
      this.files = event.target.files;
    },
    async createEnvelope() {
      if (!this.description || this.files.length === 0) {
        alert('Por favor, preencha a descrição e selecione pelo menos um arquivo.');
        return;
      }

      try {
        const token = localStorage.getItem('jwt');
        const documents = await Promise.all([...this.files].map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                name: file.name,
                mimeType: file.type,
                base64Content: reader.result.split(',')[1]
              });
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        }));

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/digitalSignature/repository/${this.repositoryId}/envelope`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ description: this.description, documents })
        });
        if (response.status === 401) {
          toast("É necessário logar novamente", { autoClose: 2000 });
          localStorage.removeItem('jwt');
          this.$router.push('/');
          return;
        }
        await this.fetchEnvelopes();
        this.closeModal();
        toast("Envelope criada com sucesso", { autoClose: 2000 });
      } catch (error) {
        toast("Erro ao criar envelope", { autoClose: 2000 });
        console.error('Erro ao criar envelope:', error);
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
