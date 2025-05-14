<template>
  <v-container class="wishlist-container py-6">
    <h1 class="wishlist-title text-h4 font-weight-bold mb-6">
      {{ $t("wishlist.titulo") }}
    </h1>

    <v-select
      v-model="ordenSeleccionada"
      :items="opcionesOrden"
      :label="$t('wishlist.ordenarPor')"
      v-if="edicionesPaginadas.length > 0"
      outlined
      dense
      class="mb-4 wishlist-selector"
    ></v-select>

    <v-progress-linear
      indeterminate
      color="primary"
      v-if="isLoading"
      class="mb-4"
    />

    <v-container class="wishlist-grid-container">
      <v-row v-if="edicionesPaginadas.length > 0" dense justify="start">
        <v-col
          v-for="edicion in edicionesPaginadas"
          :key="edicion.id"
          cols="12"
          sm="6"
          md="4"
          lg="4"
          class="wishlist-card-col"
        >
          <v-card class="wishlist-card" elevation="4">
            <img
              :src="edicion.data.image"
              class="wishlist-image dark-img-bg"
              :alt="$t('wishlist.portadaLibro')"
            />
            <v-card-title>
              <v-row align="center" justify="space-between" class="w-100">
                <v-col cols="auto" class="wishlist-book-title">
                  {{ edicion.data.book_title }}
                </v-col>
                <v-col cols="auto">
                  <v-icon
                    @click="toggleDeseado(edicion.id)"
                    :color="wants.is_wanted(edicion.id) ? 'red' : 'red'"
                    size="28"
                    class="cursor-pointer"
                  >
                    {{
                      wants.is_wanted(edicion.id)
                        ? "mdi-heart"
                        : "mdi-heart-outline"
                    }}
                  </v-icon>
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-subtitle>{{ edicion.data.editorial }}</v-card-subtitle>
            <v-card-text
              >{{ edicion.data.year }} ·
              {{ $t(`wishlist.tipos.${edicion.data.type}`) }}</v-card-text
            >

            <v-card-actions>
              <router-link :to="'/infoEdicion/' + edicion.id">
                <v-btn color="primary" variant="text" size="small">{{
                  $t("wishlist.verMas")
                }}</v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-alert
        v-else-if="!isLoading"
        type="info"
        border="start"
        variant="tonal"
        color="primary"
        class="mt-6"
      >
        {{ $t("wishlist.listaVacia") }}
      </v-alert>
    </v-container>

    <v-pagination
      class="wishlist-pagination"
      v-model="paginaActual"
      :length="totalPaginas"
      color="primary"
    ></v-pagination>

    <ShoppingAssistant
      v-if="mostrarAsistente && edicionesDeseadas.length > 0"
      @close="mostrarAsistente = false"
    />

    <v-btn
      v-if="!mostrarAsistente && edicionesDeseadas.length > 0"
      variant="outlined"
      color="primary"
      class="assistant-fab"
      @click="mostrarAsistente = true"
    >
      {{ $t("wishlist.abrirAsistente") }}
    </v-btn>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useEditionStore } from "@/stores/edition_store";
import { useWantsStore } from "@/stores/wants_store";
import { useOfferStore } from "@/stores/offer_store";
import ShoppingAssistant from "@/components/shoppingAssistant.vue";
import { useI18n } from "vue-i18n";

const editionStore = useEditionStore();
const offerStore = useOfferStore();
const { t } = useI18n();
const mostrarAsistente = ref(false);
const wants = useWantsStore();
const paginaActual = ref(1);
const edicionesPorPagina = 6;
const isLoading = ref(true);
const isProcessing = ref(false);
const ordenSeleccionada = ref(t("wishlist.tituloAZ"));
const opcionesOrden = computed(() => [
  t("wishlist.tituloAZ"),
  t("wishlist.editorialAZ"),
  t("wishlist.anoAscendente"),
]);
const emit = defineEmits(["show-assistant-with-warning"]);

onMounted(async () => {
  isLoading.value = true;

  await editionStore.getEditions();
  await wants.init();

  // === BLOQUE NUEVO PARA DETECTAR POCAS UNIDADES ===
  const wantedIds = wants.wants || [];
  let fewUnitsList = [];

  for (const editionId of wantedIds) {
    const res = await offerStore.getOffersForEditionFiltered(editionId);
    if (res.result === "SUCCESS" && res.data.length > 0) {
      const activeOffers = res.data.filter((o) => o.data.status === "ACTIVE");
      if (activeOffers.length < 5) {
        fewUnitsList.push(editionId);
      }
    }
  }

  if (fewUnitsList.length > 0) {
    emit("show-assistant-with-warning", fewUnitsList);
  }

  isLoading.value = false;
});

async function toggleDeseado(id) {
  if (isProcessing.value) return;
  isProcessing.value = true;

  if (wants.is_wanted(id)) {
    await wants.remove_wanted(id);
  } else {
    await wants.add_wanted(id);
  }

  isProcessing.value = false;
}

const edicionesDeseadas = computed(() => {
  const wantedIds = wants.wants || [];
  let deseadas = editionStore.editions.filter((ed) =>
    wantedIds.includes(ed.id)
  );

  switch (ordenSeleccionada.value) {
    case "Título A-Z":
      deseadas.sort((a, b) =>
        a.data.book_title.localeCompare(b.data.book_title)
      );
      break;
    case "Editorial A-Z":
      deseadas.sort((a, b) => a.data.editorial.localeCompare(b.data.editorial));
      break;
    case "Año descendente":
      deseadas.sort((a, b) => b.data.year - a.data.year);
      break;
  }

  return deseadas;
});

const totalPaginas = computed(() =>
  Math.ceil(edicionesDeseadas.value.length / edicionesPorPagina)
);

const edicionesPaginadas = computed(() => {
  const inicio = (paginaActual.value - 1) * edicionesPorPagina;
  return edicionesDeseadas.value.slice(inicio, inicio + edicionesPorPagina);
});
</script>

<style scoped>
.wishlist-selector {
  max-width: 250px;
  margin-left: 0;
}

.wishlist-container {
  position: relative;
}

.wishlist-image {
  width: 100%;
  height: 250px;
  /* antes 250px → ahora un poco más alta */
  object-fit: contain;
  display: block;
  margin: 0 auto;
  margin-top: 1%;
  padding: 0;
  border-radius: 4px 4px 0 0;
}

.assistant-fab {
  position: absolute;
  bottom: 20px;
  right: 20px;
  z-index: 999;
  border-radius: 8px;
  /* suaviza esquinas */
  padding: 10px 16px;
  /* más espacio dentro */
  font-weight: bold;
}

.wishlist-pagination {
  margin-top: 2%;
}

.wishlist-grid-container {
  max-width: 1400px;
  margin-left: 0;
}

.wishlist-card-col {
  padding-left: 12px;
  padding-right: 12px;
}

.wishlist-card {
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 12px;
  overflow: hidden;
  transition: background-color 0.3s, color 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  margin: auto;
}

.wishlist-book-title {
  font-weight: bold;
  color: var(--color-heading);
  padding-left: 16px;
}

.v-card-subtitle,
.v-card-text {
  color: var(--color-text);
  padding: 4px 16px;
  font-size: 0.9rem;
  line-height: 1.2;
}

.v-card-actions {
  padding: 8px 16px;
  justify-content: flex-end;
}

.wishlist-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
</style>
