<template>
  <div class="container mt-5">
    <h1 class="my-5">Envelopes do Repositório</h1>
    <button class="btn btn-primary mb-3" @click="showCreateEnvelopeModal">Criar Novo Envelope</button>
    <div v-if="loading">Carregando...</div>

    <div v-else-if="envelopes.length === 0">Nenhum envelope disponível</div>

    <div v-else>
      <ul class="my-2 list-group">
        <li v-for="envelope in envelopes" :key="envelope.id"
          class="list-group-item d-flex justify-content-between align-items-center">
          <span :title="formatTitle(envelope)">
            [{{ envelope.statusDescription }}] {{ envelope.description }} ({{ envelope.pageCount }} Páginas)
          </span>
          <div>
            <button class="btn btn-secondary btn-sm me-2" :disabled="envelope.status !== 1"
              @click="showAddSignerModal(envelope.id)">Adicionar Signatário</button>
            <button class="btn btn-success btn-sm me-2" :disabled="envelope.status !== 1"
              @click="sendEnvelope(envelope.id)">Enviar</button>
            <button class="btn btn-info btn-sm" @click="downloadEnvelope(envelope.id)">Download</button>
          </div>
        </li>
      </ul>
    </div>

    <CreateEnvelopeModal v-if="showCreateEnvelope" :show="showCreateEnvelope" :closeModal="closeCreateEnvelopeModal"
      :repositoryId="repositoryId" :fetchEnvelopes="fetchEnvelopes" />

    <AddSignerModal v-if="showAddSigner" :show="showAddSigner" :closeModal="closeAddSignerModal"
      :repositoryId="repositoryId" :envelopeId="currentEnvelopeId" :fetchEnvelopes="fetchEnvelopes" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../store';
import CreateEnvelopeModal from '../modals/CreateEnvelopeModal.vue';
import AddSignerModal from '../modals/AddSignerModal.vue';
import { formatDate, formatTitle } from '../common/auxiliar';

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
          authStore.logout();
          router.push('/');
          return;
        }
        console.log('Envelope enviado com sucesso');
        await fetchEnvelopes();
      } catch (error) {
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
          authStore.logout();
          router.push('/');
          return;
        }
        const data = await response.json();
        const { envelopeContent, nomeArquivo, mimeType } = data.response;

        const link = document.createElement('a');
        link.href = `data:${mimeType};base64,${envelopeContent}`;
        link.download = nomeArquivo;
        link.click();
      } catch (error) {
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
