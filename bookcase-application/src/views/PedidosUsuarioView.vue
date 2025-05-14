<template>
  <v-container class="pa-5">
    <h2 class="titulo">{{ $t("pedidos.titulo") }}</h2>

    <v-tabs v-model="tab" density="comfortable" class="mb-2">
      <v-tab>{{ $t("pedidos.activos") }}</v-tab>
      <v-tab>{{ $t("pedidos.completados") }}</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="activos">
        <div v-if="pedidosActivos.length === 0" class="sin-pedidos">
          {{ $t("pedidos.sinPedidosActivos") }}
        </div>
        <v-data-table
          :headers="headersActivos"
          :items="pedidosActivos"
          :items-per-page="5"
          :items-per-page-options="[5, 10, 20, 50, -1]"
          v-if="pedidosActivos.length > 0"
          class="mt-4"
        >
          <template v-slot:item="{ item, index }">
            <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
              <!-- Aquí renderizas tus celdas manualmente -->
              <td>{{ item.id }}</td>
              <td>{{ item.seller_name }}</td>
              <td>{{ item.fecha.toLocaleDateString() }}</td>
              <td>
                {{
                  isNaN(item.total_price)
                    ? $t("pedidos.noDisponible")
                    : item.total_price + " €"
                }}
              </td>
              <td>{{ $t(`pedidos.estados.${item.status}`) }}</td>
              <td>
                <v-icon
                  v-if="item.status === 'SHIPPED'"
                  color="success"
                  class="mr-2"
                  :title="$t('pedidos.marcarRecibido')"
                  @click.stop="marcarRecibido(item)"
                >
                  mdi-check-circle
                </v-icon>
                <v-icon
                  color="primary"
                  :title="$t('pedidos.verDetalles')"
                  @click="$router.push(`/perfil/VerPedido/${item.id}`)"
                >
                  mdi-magnify
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>

      <v-window-item value="completados">
        <div v-if="pedidosCompletados.length === 0" class="sin-pedidos">
          {{ $t("pedidos.sinPedidosCompletados") }}
        </div>
        <v-data-table
          :headers="headersInactivos"
          :items="pedidosCompletados"
          :items-per-page="5"
          :items-per-page-options="[5, 10, 20, 50, -1]"
          v-if="pedidosCompletados.length > 0"
          class="mt-4"
        >
          <template v-slot:item="{ item, index }">
            <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
              <td>{{ item.id }}</td>
              <td>{{ item.seller_name }}</td>
              <td>{{ item.fecha.toLocaleDateString() }}</td>
              <td>
                {{
                  isNaN(item.total_price)
                    ? $t("pedidos.noDisponible")
                    : item.total_price + " €"
                }}
              </td>
              <td>
                <v-icon
                  color="primary"
                  :title="$t('pedidos.verDetalles')"
                  @click="$router.push(`/perfil/VerPedido/${item.id}`)"
                >
                  mdi-magnify
                </v-icon>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-window-item>
    </v-window>
  </v-container>
  <ValoracionPedido
    v-if="pedidoSeleccionado"
    v-model="mostrarModal"
    :pedido-id="pedidoSeleccionado.id"
    :producto-nombre="$t('pedidos.valoraciones.productoMultiple')"
    :vendedor-nombre="pedidoSeleccionado.seller_name"
  />
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useUserStore } from "@/stores/user_store";
import { useOrderStore } from "@/stores/order_store";
import { useOfferStore } from "@/stores/offer_store";
import { useBookStore } from "@/stores/book_store";
import { useEditionStore } from "@/stores/edition_store";
import { useI18n } from "vue-i18n";
import ValoracionPedido from "@/components/ValoracionPedido.vue";

const userStore = useUserStore();
const orderStore = useOrderStore();
const offerStore = useOfferStore();
const bookStore = useBookStore();
const editionStore = useEditionStore();
const { t } = useI18n();

const tab = ref(0);
const pedidos = ref([]);
const ofertasPorPedido = ref({});

let intervaloRefresco = null;

const mostrarModal = ref(false);
const pedidoSeleccionado = ref(null);

const headersActivos = computed(() => [
  { title: t("pedidos.pedido"), value: "id", align: "center", sortable: true },
  {
    title: t("pedidos.vendedor"),
    value: "seller_name",
    align: "center",
    sortable: true,
  },
  {
    title: t("pedidos.fecha"),
    value: "fecha",
    align: "center",
    sortable: true,
  },
  { title: "Total", value: "total", align: "center", sortable: true },
  {
    title: t("pedidos.estado"),
    value: "status",
    align: "center",
    sortable: true,
  },
  {
    title: t("pedidos.acciones"),
    value: "acciones",
    align: "center",
    sortable: false,
  },
]);

const headersInactivos = computed(() => [
  { title: t("pedidos.pedido"), value: "id", align: "center", sortable: true },
  {
    title: t("pedidos.vendedor"),
    value: "seller_name",
    align: "center",
    sortable: true,
  },
  {
    title: t("pedidos.fecha"),
    value: "fecha",
    align: "center",
    sortable: true,
  },
  { title: "Total", value: "total", align: "center", sortable: true },
  {
    title: t("pedidos.acciones"),
    value: "acciones",
    align: "center",
    sortable: false,
  },
]);

const pedidosActivos = computed(() =>
  pedidos.value
    .filter((p) => p.status === "PAID" || p.status === "SHIPPED")
    .map((p) => ({
      ...p,
      fecha: new Date(p.buying_date.seconds * 1000),
    }))
);

const pedidosCompletados = computed(() =>
  pedidos.value
    .filter((p) => p.status === "ARRIVED")
    .map((p) => ({
      ...p,
      fecha: new Date(p.buying_date.seconds * 1000),
    }))
);

const marcarRecibido = async (pedido) => {
  const result = await orderStore.confirmArrival(pedido.id);

  if (result.result === "SUCCESS") {
    console.log("Pedido marcado como recibido...");
    pedidoSeleccionado.value = pedido;
    mostrarModal.value = true;
    await cargarPedidos();
  } else {
    console.warn("Error al marcar como recibido:", result.message);
  }
};

const cargarPedidos = async () => {
  await orderStore.fetchOrders();

  const result = await orderStore.getPurchasesFromUser(userStore.id);
  await editionStore.getEditions();
  await bookStore.getBooks();

  if (result?.result === "SUCCESS") {
    pedidos.value = result.data;
    console.log("Pedidos obtenidos: ", pedidos.value);

    for (const pedido of pedidos.value) {
      const ofertas = [];
      for (const offerId of pedido.offer_ids) {
        const res = await offerStore.getOffer(offerId);
        if (res.result === "SUCCESS") {
          const offer = res.data;

          const edition = editionStore.editions.find(
            (e) => e.id === offer.data.edition_id
          );

          const book = edition
            ? bookStore.books.find((b) => b.id === edition.data.book_id)
            : null;

          ofertas.push({ offer, edition, book });
        }
      }
      ofertasPorPedido.value[pedido.id] = ofertas;
      console.log(`Detalles del pedido ${pedido.id}: `, ofertasPorPedido.value);
    }
  }
};

onMounted(() => {
  cargarPedidos();
  intervaloRefresco = setInterval(cargarPedidos, 5000);
});

onBeforeUnmount(() => {
  clearInterval(intervaloRefresco);
});
</script>

<style scoped>
.titulo {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
  font-weight: 600;
  color: var(--color-heading);
}

.v-container {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.v-expansion-panel {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.v-expansion-panel-title {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 1rem;
}

.v-expansion-panel-text {
  background-color: var(--color-background);
  color: var(--color-text);
  padding: 1rem;
}

.no-datos {
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1rem;
}

.panel-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.pedido-info {
  font-size: 14px;
  line-height: 1.6;
}

.sin-pedidos,
.sin-ofertas {
  text-align: center;
  margin: 2rem 0;
  font-style: italic;
  font-size: 1.2rem;
  color: var(--color-text-soft);
}

.boton-recibir {
  background-color: var(--color-primary);
  color: var(--color-text);
  margin-right: 1rem;
}

.offer-image-wrapper {
  min-width: 60px;
  min-height: 90px;
  background-color: var(--color-background);
  border-radius: 4px;
}

.v-list-item-content {
  color: var(--color-text);
}

/* Fondo y texto de los items dentro del listado */
.v-list {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

.v-list-item {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}

/* También el contenedor del expansion-panel-text */
.v-expansion-panel-text {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
}
.v-expansion-panel-text {
  background-color: var(--color-panel);
}

/* 🧿 Cabecera tabla */
::v-deep(.v-data-table thead th) {
  font-size: 1.1rem;
  background-color: #2c3e50;
  color: white;
}

/* Íconos de orden */
::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.4rem;
}

/* Cuerpo tabla */
::v-deep(.v-data-table tbody td) {
  text-align: center;
  color: var(--color-text);
}

/* Fila impar (blanca modo claro, oscura modo oscuro) */
.fila-impar {
  background-color: white;
}

/* Tamaño celdas */
.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
}

.fila-impar {
  background-color: white;
}

html[data-theme="dark"] {
  .fila-impar {
    background-color: var(--color-background-mute) !important;
  }

  ::v-deep(.v-data-table tbody tr:hover) {
    background-color: rgba(21, 101, 192, 0.15) !important;
  }

  /* 🗓 Date Picker dentro del diálogo */
  ::v-deep(.v-picker) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-date-picker-header),
  ::v-deep(.v-date-picker-controls),
  ::v-deep(.v-date-picker-table) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-btn--variant-outlined) {
    border-color: var(--color-border) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-slider-thumb__label) {
    background-color: #2c3e50 !important;
    color: white !important;
  }
}

/* 🌙 Correcciones completas para v-dialog y v-card en modo oscuro */
html[data-theme="dark"] {
  /* Contenedor del diálogo */
  ::v-deep(.v-overlay__content .v-card) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Fondo interior del v-card-text */
  ::v-deep(.v-card-text) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Botones del diálogo */
  ::v-deep(.v-card-actions .v-btn) {
    color: var(--color-heading) !important;
  }

  /* Título del diálogo */
  ::v-deep(.v-card-title) {
    color: var(--color-heading) !important;
  }
}

html[data-theme="dark"] {
  /* Fondo uniforme en modo oscuro para todas las filas */
  ::v-deep(.v-data-table tbody tr) {
    background-color: var(--color-background-soft) !important;
  }

  /* ✅ Elimina cualquier efecto hover en filas */
  ::v-deep(.v-data-table tbody tr:hover) {
    background-color: var(--color-background-soft) !important;
  }

  /* 🧿 Footer (elementos por página, paginación) */
  ::v-deep(.v-data-table-footer) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* 🧿 Select en footer */
  ::v-deep(.v-data-table-footer .v-select),
  ::v-deep(.v-data-table-footer .v-field) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Botones paginación en footer */
  ::v-deep(.v-data-table-footer .v-btn) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
    transition: none !important;
  }

  /* Texto resumen totales */
  .resumen-totales-p {
    color: var(--color-heading) !important;
  }

  /* Estilo uniforme para celdas */
  ::v-deep(.v-data-table tbody td) {
    color: var(--color-text) !important;
    background-color: var(--color-background-soft) !important;
  }
}
</style>
