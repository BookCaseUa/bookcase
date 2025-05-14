<template>
  <v-container class="contenedor-ofertas">
    <!-- Tabs -->
    <v-tabs v-model="tab" background-color="primary" dark>
      <v-tab>{{ $t("misOfertas.pestañaActivas") }}</v-tab>
      <v-tab>{{ $t("misOfertas.pestañaInactivas") }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <!-- TAB 1: ACTIVAS -->
      <v-window-item :value="0">
        <v-row class="align-center my-4" justify="space-between">
          <v-col cols="12" md="3">
            <Busqueda
              :mostrarSelector="false"
              :placeholder="$t('home.buscarPorTituloComentario')"
              @buscar="manejarBusquedaActivas"
            />
          </v-col>

          <v-col cols="12" md="3" class="d-flex justify-end align-end">
            <v-btn
              class="boton-link-oferta"
              variant="text"
              prepend-icon="mdi-plus"
              @click="$router.push('/addOffer')"
            >
              {{ $t("misOfertas.añadirOferta") }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row class="align-center my-4" justify="space-between">
          <v-col cols="12" md="3">
            <v-select
              v-model="orden"
              :items="opcionesOrden"
              :label="$t('misOfertas.ordenarPor')"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filtroCondicion"
              :items="opcionesCondicion"
              :label="$t('misOfertas.filtrarCondicion')"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filtroIdioma"
              :items="opcionesIdioma"
              :label="$t('misOfertas.filtrarIdioma')"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <v-data-table
          class="solo-encabezado"
          :headers="headersActivas"
          :items="ofertasActivasFiltradas"
          :items-per-page="7"
        >
          <template v-slot:item.acciones="{ item }">
            <v-icon class="icono-accion" @click="editarOferta(item)"
              >mdi-pencil</v-icon
            >
            <v-icon class="icono-accion-eliminar" @click="eliminarOferta(item)"
              >mdi-delete</v-icon
            >
          </template>
          <template v-slot:no-data>{{
            $t("misOfertas.sinOfertasActivas")
          }}</template>
        </v-data-table>
      </v-window-item>

      <!-- TAB 2: INACTIVAS -->
      <v-window-item :value="1">
        <v-row class="align-center my-4" justify="space-between">
          <v-col cols="12" md="3">
            <Busqueda
              :mostrarSelector="false"
              :placeholder="$t('home.buscarPorTituloComentario')"
              @buscar="manejarBusquedaInactivas"
            />
          </v-col>
        </v-row>

        <v-row class="align-center my-4" justify="space-between">
          <v-col cols="12" md="3">
            <v-select
              v-model="ordenInactivas"
              :items="opcionesOrden"
              :label="$t('misOfertas.ordenarPor')"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filtroCondicionInactivas"
              :items="opcionesCondicion"
              :label="$t('misOfertas.filtrarCondicion')"
              outlined
              dense
            />
          </v-col>

          <v-col cols="12" md="3">
            <v-select
              v-model="filtroIdiomaInactivas"
              :items="opcionesIdioma"
              :label="$t('misOfertas.filtrarIdioma')"
              outlined
              dense
            />
          </v-col>
        </v-row>

        <v-data-table
          class="solo-encabezado"
          :headers="headersInactivas"
          :items="ofertasInactivasFiltradas"
          :items-per-page="7"
        >
      
          <template v-slot:no-data>{{
            $t("misOfertas.sinOfertasInactivas")
          }}</template>
        </v-data-table>
      </v-window-item>
    </v-window>
    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="dialogEliminar" width="450" persistent>
      <v-card class="dialogo-eliminar">
        <v-card-title class="titulo-dialogo text-wrap text-center">
          ¿ {{ $t("misOfertas.eliminarOferta") }} "<strong>{{
            ofertaSeleccionada?.edition_book_name
          }}</strong
          >"?
        </v-card-title>

        <v-card-text class="texto-dialogo text-center">
          {{ $t("misOfertas.textoDialogo1") }}
          <strong>{{ $t("misOfertas.textoDialogo2") }}</strong
          >.
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="grey" variant="text" @click="dialogEliminar = false">
            {{ $t("misOfertas.cancelar") }}
          </v-btn>
          <v-btn
            color="red-darken-1"
            variant="flat"
            @click="confirmarEliminacion"
          >
            {{ $t("misOfertas.eliminar") }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useOfferStore } from "@/stores/offer_store";
import { useUserStore } from "@/stores/user_store";
import Busqueda from "@/components/Busqueda.vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const offerStore = useOfferStore();
const userStore = useUserStore();
const ofertas = ref([]);
const { t } = useI18n();

const tab = ref(0);

const orden = ref("reciente");
const ordenInactivas = ref("reciente");

const filtroCondicion = ref("");
const filtroCondicionInactivas = ref("");

const filtroIdioma = ref("");
const filtroIdiomaInactivas = ref("");

const ofertaSeleccionada = ref(null);
const dialogEliminar = ref(false);

const opcionesCondicion = computed(() => [
  { title: t("misOfertas.todas"), value: "" },
  { title: t("misOfertas.nuevo"), value: "NEW" },
  { title: t("misOfertas.seminuevo"), value: "LIKE NEW" },
  { title: t("misOfertas.bueno"), value: "GOOD" },
  { title: t("misOfertas.aceptable"), value: "ACCEPTABLE" },
  { title: t("misOfertas.malo"), value: "BAD" },
]);

const opcionesIdioma = computed(() => [
  { title: t("misOfertas.todos"), value: "" },
  { title: "ES", value: "ES" },
  { title: "EN", value: "EN" },
  { title: "FR", value: "FR" },
  { title: "DE", value: "DE" },
  { title: "IT", value: "IT" },
]);

const opcionesOrden = computed(() => [
  { title: t("misOfertas.masReciente"), value: "reciente" },
  { title: t("misOfertas.precioAsc"), value: "precio-asc" },
  { title: t("misOfertas.precioDesc"), value: "precio-desc" },
  { title: t("misOfertas.titulo") + " (A-Z)", value: "titulo-az" },
  { title: t("misOfertas.titulo") + " (Z-A)", value: "titulo-za" },
]);

const headersActivas = computed(() => [
  {
    title: t("misOfertas.titulo"),
    value: "edition_book_name",
    align: "center",
  },
  { title: t("misOfertas.precio"), value: "price", align: "center" },
  { title: t("misOfertas.condicion"), value: "condition", align: "center" },
  { title: t("misOfertas.idioma"), value: "language", align: "center" },
  { title: t("misOfertas.fecha"), value: "fecha", align: "center" },
  { title: t("misOfertas.comentario"), value: "comment", align: "center" },
  {
    title: t("misOfertas.acciones"),
    value: "acciones",
    align: "center",
    sortable: false,
  },
]);

const headersInactivas = computed(() => [
  {
    title: t("misOfertas.titulo"),
    value: "edition_book_name",
    align: "center",
  },
  { title: t("misOfertas.precio"), value: "price", align: "center" },
  { title: t("misOfertas.condicion"), value: "condition", align: "center" },
  { title: t("misOfertas.estado"), value: "status", align: "center" },
  { title: t("misOfertas.idioma"), value: "language", align: "center" },
  { title: t("misOfertas.fecha"), value: "fecha", align: "center" },
  { title: t("misOfertas.comentario"), value: "comment", align: "center" },
]);

let intervalo = ref(null);

const textoBusquedaActivas = ref("");
const textoBusquedaInactivas = ref("");

const manejarBusquedaActivas = ({ texto }) => {
  textoBusquedaActivas.value = texto;
};

const manejarBusquedaInactivas = ({ texto }) => {
  textoBusquedaInactivas.value = texto;
};

onMounted(async () => {
  const userId = userStore.id;

  const cargarOfertas = async () => {
    await offerStore.fetchOffers();
    const result = await offerStore.getOffersForUserFiltered(userId);
    if (result.result === "SUCCESS") {
      ofertas.value = result.data;
    }
  };

  cargarOfertas();

  intervalo = setInterval(cargarOfertas, 600000);
});

onUnmounted(() => {
  clearInterval(intervalo);
});

const ofertasActivasFiltradas = computed(() => {
  let resultado = ofertas.value.filter((o) => o.data.status === "ACTIVE");

  if (filtroCondicion.value) {
    resultado = resultado.filter(
      (o) => o.data.condition === filtroCondicion.value
    );
  }

  resultado = resultado.map((o) => ({
    id: o.id,
    edition_book_name: o.data.edition_book_name,
    price: o.data.price,
    condition: t(`misOfertas.condiciones.${o.data.condition}`),
    language: o.data.language,
    fecha: formatearFecha(o.data.publication_date),
    comment: o.data.comment,
  }));

  if (filtroIdioma.value) {
    resultado = resultado.filter((o) => o.language === filtroIdioma.value);
  }

  if (textoBusquedaActivas.value.trim()) {
    const termino = textoBusquedaActivas.value.toLowerCase();
    resultado = resultado.filter(
      (o) =>
        o.edition_book_name.toLowerCase().includes(termino) ||
        o.comment.toLowerCase().includes(termino)
    );
  }

  if (orden.value === "precio-asc") {
    resultado.sort((a, b) => a.price - b.price);
  } else if (orden.value === "precio-desc") {
    resultado.sort((a, b) => b.price - a.price);
  } else if (orden.value === "titulo-az") {
    resultado.sort((a, b) =>
      a.edition_book_name.localeCompare(b.edition_book_name)
    );
  } else if (orden.value === "titulo-za") {
    resultado.sort((a, b) =>
      b.edition_book_name.localeCompare(a.edition_book_name)
    );
  } else if (orden.value === "reciente") {
    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  return resultado;
});

const editarOferta = (oferta) => {
  router.push(`/editar-oferta/${oferta.id}`);
};

const eliminarOferta = (oferta) => {
  ofertaSeleccionada.value = oferta;
  dialogEliminar.value = true;
};

const confirmarEliminacion = async () => {
  await offerStore.deleteOffer(ofertaSeleccionada.value.id);
  const userId = userStore.id;
  const result = await offerStore.getOffersForUserFiltered(userId);
  if (result.result === "SUCCESS") {
    ofertas.value = result.data;
  }
  dialogEliminar.value = false;
};

const ofertasInactivasFiltradas = computed(() => {
  let resultado = ofertas.value.filter(
    (o) => o.data.status === "SOLD" || o.data.status === "IN CART"
  );

  if (filtroCondicionInactivas.value) {
    resultado = resultado.filter(
      (o) => o.data.condition === filtroCondicionInactivas.value
    );
  }

  resultado = resultado.map((o) => ({
    id: o.id,
    edition_book_name: o.data.edition_book_name,
    price: o.data.price,
    condition: t(`misOfertas.condiciones.${o.data.condition}`),
    status: t(`misOfertas.estados.${o.data.status}`),
    language: o.data.language,
    fecha: formatearFecha(o.data.publication_date),
    comment: o.data.comment,
  }));

  if (filtroIdiomaInactivas.value) {
    resultado = resultado.filter(
      (o) => o.language === filtroIdiomaInactivas.value
    );
  }

  if (textoBusquedaInactivas.value.trim()) {
    const termino = textoBusquedaInactivas.value.toLowerCase();
    resultado = resultado.filter(
      (o) =>
        o.edition_book_name.toLowerCase().includes(termino) ||
        o.comment.toLowerCase().includes(termino)
    );
  }

  if (ordenInactivas.value === "precio-asc") {
    resultado.sort((a, b) => a.price - b.price);
  } else if (ordenInactivas.value === "precio-desc") {
    resultado.sort((a, b) => b.price - a.price);
  } else if (ordenInactivas.value === "titulo-az") {
    resultado.sort((a, b) =>
      a.edition_book_name.localeCompare(b.edition_book_name)
    );
  } else if (ordenInactivas.value === "titulo-za") {
    resultado.sort((a, b) =>
      b.edition_book_name.localeCompare(a.edition_book_name)
    );
  } else if (ordenInactivas.value === "reciente") {
    resultado.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  return resultado;
});

const traducirCondicion = (c) => {
  return (
    {
      NEW: "Nuevo",
      "LIKE NEW": "Seminuevo",
      GOOD: "Bueno",
      ACCEPTABLE: "Aceptable",
      BAD: "Malo",
    }[c] || c
  );
};

const traducirEstado = (s) => {
  return (
    {
      ACTIVE: "Activa",
      "IN CART": "En carrito",
      SOLD: "Vendida",
    }[s] || s
  );
};

const formatearFecha = (f) => {
  try {
    return new Date(f.seconds * 1000).toLocaleDateString();
  } catch {
    return "";
  }
};
</script>

<style scoped>
.contenedor-ofertas {
  padding-top: 0 !important;
  margin-top: 0 !important;
}

/* 🎯 CABECERA thead */
.solo-encabezado :deep(thead) {
  background-color: #2c3e50 !important;
}
.solo-encabezado :deep(th) {
  color: white !important;
  font-weight: bold;
  text-align: center !important;
}

/* 🎯 CUERPO tbody */
.solo-encabezado :deep(tbody tr) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}
.solo-encabezado :deep(tbody td) {
  text-align: center;
}

/* 🎯 Botones de paginación */
.solo-encabezado :deep(tfoot .v-btn) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
  transition: background-color 0.3s, color 0.3s;
}

/* 🎯 Hover bonito en botones de paginación */
.solo-encabezado :deep(tfoot .v-btn:hover) {
  background-color: rgba(33, 150, 243, 0.2) !important;
  color: var(--color-heading) !important;
}

/* 🎯 Select de elementos por página */
.solo-encabezado :deep(tfoot .v-select),
.solo-encabezado :deep(tfoot .v-field) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

/* 🎯 Botones de acciones */
.icono-accion {
  cursor: pointer;
  font-size: 20px;
  margin: 0 4px;
}

.icono-accion-eliminar {
  color: rgb(238, 100, 100);
  cursor: pointer;
  font-size: 20px;
  margin: 0 4px;
}

/* 🎯 Botón "Añadir oferta" */
.boton-link-oferta {
  font-weight: bold;
  text-transform: none;
  color: var(--color-heading);
  font-size: 15px;
  padding: 6px 8px;
  min-width: 0;
}

.boton-link-oferta:hover {
  background-color: transparent !important;
  color: #1565c0;
}

/* 🎯 Diálogo eliminar */
.dialogo-eliminar {
  padding: 16px;
  border-radius: 12px;
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.titulo-dialogo {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 0 16px;
  line-height: 1.4;
}

.texto-dialogo {
  font-size: 14px;
  text-align: center;
  color: var(--color-text);
  margin-bottom: 8px;
}

/* 🎯 🎯 🎯 — Ajustes seguros solo dentro del contenedor ofertas (menús, overlays, listas) */
.contenedor-ofertas :deep(.v-overlay__content),
.contenedor-ofertas :deep(.v-menu__content),
.contenedor-ofertas :deep(.v-list),
.contenedor-ofertas :deep(.v-data-table-footer) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}
</style>
