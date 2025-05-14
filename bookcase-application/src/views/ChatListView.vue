<template>
  <v-container class="py-10">
    <h2 class="text-h5 mb-6 text-center">{{ $t("chats.titulo") }}</h2>

    <v-text-field
      v-model="filtro"
      :label="$t('chats.buscarUsuario')"
      prepend-icon="mdi-magnify"
      class="mb-4"
    />

    <v-switch
      v-model="mostrarArchivados"
      :label="$t('chats.mostrarArchivados')"
      inset
      color="primary"
      class="mb-6"
    />

    <v-card
      v-for="chat in chatsFiltrados"
      :key="chat.id"
      class="mb-4 chat-card"
      :elevation="chat[`archived_by_${userStore.id}`] ? 2 : 6"
      :class="{ 'chat-card-archivado': chat[`archived_by_${userStore.id}`] }"
      @click="abrirChat(chat.id)"
      ><v-card-title class="d-flex justify-space-between align-center">
        <div>
          💬 {{ $t("chats.chatCon") }}
          <strong>{{ getNombreContraparte(chat) }}</strong>
          <v-icon
            v-if="chat[`archived_by_${userStore.id}`]"
            size="16"
            class="ml-1"
          >
            mdi-archive
          </v-icon>
        </div>

        <div class="d-flex align-center">
          <small class="text-grey mr-2">
            {{ formatearFecha(chat.updated_at) }}
          </small>
          <v-menu>
            <template #activator="{ props }">
              <v-btn icon class="menu-movil-btn" v-bind="props" @click.stop>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-if="!chat[`archived_by_${userStore.id}`]"
                @click.stop="archivarChat(chat.id)"
              >
                <v-list-item-title>
                  {{ $t("chats.archivar") }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-else @click.stop="desarchivarChat(chat.id)">
                <v-list-item-title>
                  {{ $t("chats.desarchivar") }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click.stop="confirmarEliminarChat(chat.id)">
                <v-list-item-title class="text-error">
                  {{ $t("chats.eliminar") }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-card-title>

      <v-card-subtitle class="text-truncate px-4">
        {{ $t("chats.ultimoMensaje") + (chat.last_message || "...") }}
      </v-card-subtitle>
    </v-card>

    <div v-if="chatsFiltrados.length === 0" class="text-center mt-10">
      <v-icon color="grey" size="40">mdi-message-off-outline</v-icon>
      <p class="text-grey mt-2">{{ $t("chats.sinConversacionesActivas") }}</p>
    </div>

    <v-snackbar v-model="mostrarSnackbar" timeout="3000" color="success">
      {{ snackbarTexto }}
    </v-snackbar>
    <v-dialog v-model="mostrarDialogoEliminar" width="400" persistent>
      <v-card class="pa-4">
        <div class="text-center mb-4">
          <v-icon size="48" color="error">mdi-trash-can-outline</v-icon>
        </div>
        <v-card-title class="justify-center text-h6 font-weight-bold">
          {{ $t("chats.confirmarEliminarTitulo") }}
        </v-card-title>
        <v-card-text class="text-center text-body-2">
          {{ $t("chats.confirmarEliminarTexto1") }}
          <strong>{{ $t("chats.confirmarEliminarTexto2") }}</strong
          >.<br />
          {{ $t("chats.confirmarEliminarTexto3") }}
          <strong>{{ $t("chats.confirmarEliminarTexto4") }}</strong
          >.
        </v-card-text>
        <v-card-actions class="justify-center mt-4">
          <v-btn text @click="mostrarDialogoEliminar = false" class="mr-2">
            {{ $t("chats.cancelar") }}
          </v-btn>
          <v-btn color="error" variant="flat" @click="eliminarChat">
            {{ $t("chats.eliminar") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/config/firebase_config";
import { useUserStore } from "@/stores/user_store";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const router = useRouter();
const { t } = useI18n();
const mostrarSnackbar = ref(false);
const snackbarTexto = ref("");
const chats = ref([]);
const nombresUsuarios = ref({});
const filtro = ref("");
const mostrarArchivados = ref(false);
const mostrarDialogoEliminar = ref(false);
const chatIdAEliminar = ref(null);

const cargarChats = async () => {
  const chatsRef = collection(db, "chats");
  const q1 = query(chatsRef, where("buyer_id", "==", userStore.id));
  const q2 = query(chatsRef, where("seller_id", "==", userStore.id));

  const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
  const allDocs = [...snap1.docs, ...snap2.docs];

  chats.value = allDocs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .sort((a, b) => b.updated_at?.seconds - a.updated_at?.seconds);

  for (const chat of chats.value) {
    const otroId =
      chat.buyer_id === userStore.id ? chat.seller_id : chat.buyer_id;

    if (!nombresUsuarios.value[otroId]) {
      const userData = await userStore.fetchUserById(otroId);
      nombresUsuarios.value[otroId] =
        userData?.data?.nickname || t("chats.usuario");
    }
  }
};

const chatsFiltrados = computed(() => {
  return chats.value.filter((chat) => {
    if (chat.deletedFor && chat.deletedFor.includes(userStore.id)) {
      return false;
    }

    const otroId =
      chat.buyer_id === userStore.id ? chat.seller_id : chat.buyer_id;
    const nombre = nombresUsuarios.value[otroId]?.toLowerCase() || "";
    const campoArchivado = `archived_by_${userStore.id}`;
    const estaArchivado = chat[campoArchivado] === true;

    return (
      nombre.includes(filtro.value.toLowerCase()) &&
      (mostrarArchivados.value || !estaArchivado)
    );
  });
});

function getNombreContraparte(chat) {
  const otroId =
    chat.buyer_id === userStore.id ? chat.seller_id : chat.buyer_id;
  return nombresUsuarios.value[otroId] || t("chats.usuario");
}

async function archivarChat(chatId) {
  const chatDoc = doc(db, "chats", chatId);
  await updateDoc(chatDoc, {
    [`archived_by_${userStore.id}`]: true,
  });
  snackbarTexto.value = t("chats.chatArchivado");
  mostrarSnackbar.value = true;
  await cargarChats();
}

async function desarchivarChat(chatId) {
  const chatDoc = doc(db, "chats", chatId);
  await updateDoc(chatDoc, {
    [`archived_by_${userStore.id}`]: false,
  });
  snackbarTexto.value = t("chats.chatDesarchivado");
  mostrarSnackbar.value = true;
  await cargarChats();
}

function confirmarEliminarChat(chatId) {
  chatIdAEliminar.value = chatId;
  mostrarDialogoEliminar.value = true;
}

async function eliminarChat() {
  if (!chatIdAEliminar.value) return;

  const chatDocRef = doc(db, "chats", chatIdAEliminar.value);
  const chatData = chats.value.find((c) => c.id === chatIdAEliminar.value);

  const updatedDeletedFor = [...(chatData?.deletedFor || []), userStore.id];

  if (updatedDeletedFor.length >= 2) {
    // Ambos usuarios han eliminado el chat
    await deleteDoc(chatDocRef);
    snackbarTexto.value = t("chats.chatEliminadoDefinitivamente");
  } else {
    await updateDoc(chatDocRef, { deletedFor: updatedDeletedFor });
    snackbarTexto.value = t("chats.chatEliminado");
  }

  mostrarSnackbar.value = true;
  mostrarDialogoEliminar.value = false;
  chatIdAEliminar.value = null;

  await cargarChats();
}

function abrirChat(chatId) {
  router.push(`/chat/${chatId}`);
}

function formatearFecha(timestamp) {
  if (!timestamp) return "?";
  const date = timestamp.toDate();
  return (
    date.toLocaleDateString() +
    " " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

onMounted(cargarChats);
</script>

<style scoped>
.chat-card {
  cursor: pointer;
  transition: box-shadow 0.2s, background-color 0.3s ease, color 0.3s ease;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 8px;
}

.chat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.chat-card-archivado {
  opacity: 0.6;
  filter: grayscale(40%);
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Extra: texto gris claro para la fecha en modo oscuro */
.v-card-title small,
.v-card-subtitle {
  color: var(--color-text);
}

/* Modo claro override específico si quieres que se mantenga blanco en light */
:root[data-theme="light"] .chat-card {
  background-color: white;
  color: #2c3e50;
}

/* 🌙 Estilos del menú desplegable de los tres puntos */
.v-menu .v-list {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 8px;
  min-width: 160px;
}

/* Items del menú */
.v-list-item {
  transition: background-color 0.2s ease;
}

.v-list-item:hover {
  background-color: var(--color-background-mute);
}

/* Ítems en modo oscuro */
:root[data-theme="dark"] .v-list-item-title {
  color: var(--color-text);
}

/* Color especial para la opción "Eliminar" */
.v-list-item-title.text-error {
  color: #e74c3c !important;
}

/* Último mensaje */
.v-card-subtitle,
.text-grey {
  color: var(--color-text) !important;
}

/* Botón de los tres puntos (mdi-dots-vertical) */
.v-btn--icon {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
  border-radius: 50% !important;
  transition: background-color 0.2s ease;
  padding: 8px;
}

/* Hover */
.v-btn--icon:hover {
  background-color: var(--color-background-mute) !important;
}

@media (max-width: 600px) {
  .v-container {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  .chat-card {
    font-size: 0.9rem;
    padding: 8px;
  }

  .v-card-title {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 6px;
  }

  .v-card-subtitle {
    font-size: 0.8rem;
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  .v-text-field,
  .v-switch {
    font-size: 0.9rem;
  }

  .v-btn--icon {
    padding: 6px;
    font-size: 18px;
  }

  .text-grey {
    font-size: 0.75rem !important;
  }

  .v-snackbar {
    font-size: 0.85rem;
  }

  .v-dialog .v-card {
    width: 90vw !important;
  }

  .v-dialog .v-card-title,
  .v-dialog .v-card-text,
  .v-dialog .v-card-actions {
    padding: 10px;
  }
}
/* SOLO para móviles */
@media (max-width: 768px) {
  .menu-movil-btn {
    position: absolute !important;
    top: 8px;
    right: 8px;
    z-index: 10;
  }

  .v-card-title {
    padding-right: 36px !important; /* deja espacio para que no se solape con el botón */
  }
}

</style>
