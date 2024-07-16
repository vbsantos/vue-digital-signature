<template>
  <div class="container mt-5">
    <h1 class="my-5">Envelopes</h1>
    <button class="btn btn-primary mb-3" @click="showCreateEnvelopeModal">Criar Envelope</button>
    <div v-if="loading">Carregando...</div>

    <div v-else-if="envelopes.length === 0">Nenhum envelope disponível</div>

    <div v-else class="my-2 accordion" id="envelopesAccordion">
      <div v-for="envelope in envelopes" :key="envelope.id" class="accordion-item">
        <h2 class="accordion-header" :id="'heading' + envelope.id">
          <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + envelope.id" aria-expanded="false" :aria-controls="'collapse' + envelope.id">
            {{ envelope.description }}
          </button>
        </h2>
        <div :id="'collapse' + envelope.id" class="accordion-collapse collapse" :aria-labelledby="'heading' + envelope.id" data-bs-parent="#envelopesAccordion">
          <div class="accordion-body">
            <span class="my-3 badge bg-secondary">{{ envelope.statusDescription }}</span>
            <h6>Documentos ({{ envelope.pageCount }} Páginas)</h6>
            <ul class="list-group mb-3">
              <li v-for="doc in envelope.documents" :key="doc.name" class="list-group-item">
                {{ doc.name }}
              </li>
            </ul>
            <h6>Signatários</h6>
            <ul class="list-group mb-3">
              <li v-for="signer in envelope.signatories" :key="signer.email" class="list-group-item">
                {{ signer.name }} - {{ signer.email }}
              </li>
            </ul>
            <div>
              <button class="btn btn-secondary btn-sm me-2" :disabled="envelope.status !== 1" @click="showAddSignerModal(envelope.id)">Adicionar Signatário</button>
              <button class="btn btn-success btn-sm me-2" :disabled="envelope.status !== 1" @click="sendEnvelope(envelope.id)">Enviar</button>
              <button class="btn btn-info btn-sm" @click="downloadEnvelope(envelope.id)">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateEnvelopeModal
      v-if="showCreateEnvelope"
      :show="showCreateEnvelope"
      :closeModal="closeCreateEnvelopeModal"
      :repositoryId="repositoryId"
      :fetchEnvelopes="fetchEnvelopes"
    />

    <AddSignerModal
      v-if="showAddSigner"
      :show="showAddSigner"
      :closeModal="closeAddSignerModal"
      :repositoryId="repositoryId"
      :envelopeId="currentEnvelopeId"
      :fetchEnvelopes="fetchEnvelopes"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store';
import CreateEnvelopeModal from '../modals/CreateEnvelopeModal.vue';
import AddSignerModal from '../modals/AddSignerModal.vue';
import { formatDate, formatTitle } from '../common/auxiliar';
import { toast } from 'vue3-toastify';

export default {
  name: 'Envelopes',
  components: {
    CreateEnvelopeModal,
    AddSignerModal
  },
  setup() {
    const authStore = useAuthStore();
    const route = useRoute();
    const router = useRouter();
    const envelopes = ref([]);
    const loading = ref(true);
    const showCreateEnvelope = ref(false);
    const showAddSigner = ref(false);
    const currentEnvelopeId = ref(null);
    const apiUrl = import.meta.env.VITE_API_URL;
    const repositoryId = route.params.id;

    const fetchEnvelopes = async () => {
      loading.value = true;
      const token = localStorage.getItem('jwt');
      const response = await fetch(`${apiUrl}/api/digitalSignature/repository/${repositoryId}/envelope`, {
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
      envelopes.value = data.envelopes || [];
      loading.value = false;
    };

    const showCreateEnvelopeModal = () => {
      showCreateEnvelope.value = true;
    };

    const closeCreateEnvelopeModal = () => {
      showCreateEnvelope.value = false;
    };

    const showAddSignerModal = (envelopeId) => {
      currentEnvelopeId.value = envelopeId;
      showAddSigner.value = true;
    };

    const closeAddSignerModal = () => {
      showAddSigner.value = false;
    };

    const sendEnvelope = async (envelopeId) => {
      try {
        loading.value = true;
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${apiUrl}/api/digitalSignature/repository/${repositoryId}/envelope/${envelopeId}/send`, {
          method: 'POST',
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
        toast("Envelope enviado com sucesso", { autoClose: 2000 });
        await fetchEnvelopes();
      } catch (error) {
        toast("Erro ao enviar envelope", { autoClose: 2000 });
        console.error('Erro ao enviar envelope:', error);
      } finally {
        loading.value = false;
      }
    };

    const downloadEnvelope = async (envelopeId) => {
      try {
        loading.value = true;
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${apiUrl}/api/digitalSignature/repository/${repositoryId}/envelope/${envelopeId}/file`, {
          method: 'GET',
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
        const { content, name, mimeType } = await response.json();

        const link = document.createElement('a');
        link.href = `data:${mimeType};base64,${content}`;
        link.download = name;
        link.click();
        toast("Iniciando download do envelope", { autoClose: 2000 });
      } catch (error) {
        toast("Erro ao baixar envelope", { autoClose: 2000 });
        console.error('Erro ao baixar envelope:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(async () => {
      await fetchEnvelopes();
    });

    return {
      envelopes,
      loading,
      formatDate,
      formatTitle,
      showCreateEnvelope,
      showAddSigner,
      currentEnvelopeId,
      showCreateEnvelopeModal,
      closeCreateEnvelopeModal,
      showAddSignerModal,
      closeAddSignerModal,
      sendEnvelope,
      downloadEnvelope,
      repositoryId,
      fetchEnvelopes
    };
  }
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
.modal.show.d-block {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
