<template>
  <v-container class="order-list-container">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="order-list-vcard" elevation="6">
          <h2 class="text-h5 font-weight-bold text-center mb-6 color-proyecto">
            <v-icon class="mr-2">mdi-package-variant-closed</v-icon>
            {{ $t("adminPedidos.titulo") }}
          </h2>

          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('adminPedidos.buscar')"
            outlined
            clearable
            hide-details
            prepend-inner-icon="mdi-magnify"
            @click:clear="
              () => {
                searchQuery = '';
                currentPage = 1;
              }
            "
          />

          <v-data-table
            v-if="filteredOrders.length > 0"
            :headers="headers"
            :items="filteredOrders"
            :items-per-page="5"
            :page.sync="currentPage"
            :items-per-page-options="[5, 10, 20, 50, -1]"
            :items-per-page-text="$t('tabla.elementosPorPagina')"
            :items-per-page-all-text="$t('tabla.todos')"
            class="mt-4"
          >
            <template #item="{ item, index }">
              <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
                <td>{{ item.id }}</td>
                <td>{{ item.user }}</td>
                <td>{{ item.translatedStatus }}</td>
                <td>{{ item.date }}</td>
              </tr>
            </template>
          </v-data-table>

          <p v-else class="no-orders">{{ $t("adminPedidos.sinPedidos") }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from "vue";
import { useOrderStore } from "@/stores/order_store";
import { useUserStore } from "@/stores/user_store";
import { useI18n } from "vue-i18n";

const orderStore = useOrderStore();
const userStore = useUserStore();
const { t } = useI18n();

const searchQuery = ref("");
const usuariosMapeados = reactive({});

const headers = computed(() => [
  { title: t("adminPedidos.id"), key: "id", align: "center", sortable: true },
  {
    title: t("adminPedidos.usuario"),
    key: "user",
    align: "center",
    sortable: true,
  },
  {
    title: t("adminPedidos.estado"),
    key: "status",
    align: "center",
    sortable: true,
  },
  {
    title: t("adminPedidos.fecha"),
    key: "rawDate",
    align: "center",
    sortable: true,
  },
]);

const filteredOrders = computed(() => {
  const search = searchQuery.value.toLowerCase().trim();
  const orders = orderStore.orders || [];

  return orders
    .map((order) => {
      const user = usuariosMapeados[order.buyer_id] || "Usuario";

      let date;
      if (order.status === "PAID") date = order.buying_date;
      else if (order.status === "SHIPPED") date = order.shipment_date;
      else if (order.status === "ARRIVED") date = order.delivery_date;

      const rawDate = date ? date.seconds : 0;
      const formattedDate = date
        ? new Date(date.seconds * 1000).toLocaleDateString("es-ES")
        : "-";

      const translatedStatus =
        t(`adminPedidos.estados.${order.status}`) || order.status;

      return {
        ...order,
        user,
        date: formattedDate,
        rawDate,
        translatedStatus,
      };
    })
    .filter((order) => {
      const user = order.user?.toLowerCase() || "";
      const status = order.status?.toLowerCase() || "";
      return user.includes(search) || status.includes(search);
    });
});

onMounted(async () => {
  await orderStore.fetchOrders();
  for (const order of orderStore.orders) {
    const buyerId = order.buyer_id;
    if (buyerId && !usuariosMapeados[buyerId]) {
      const user = await userStore.fetchUserById(buyerId);
      usuariosMapeados[buyerId] = user?.data?.nickname || "Usuario";
    }
  }
});
</script>

<style scoped>
.order-list-container {
  padding: 1.5rem auto;
}

.order-list-vcard {
  padding: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.color-proyecto {
  color: #2c3e50;
}

html[data-theme="dark"] .color-proyecto {
  color: var(--color-heading) !important;
}

::v-deep(.v-data-table thead th) {
  background-color: #2c3e50 !important;
  color: white !important;
  font-size: 1.1rem;
  text-align: center;
}

::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.7rem;
}

.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
  color: var(--color-text) !important;
  background-color: var(--color-background-soft) !important;
  text-align: center;
}

.fila-impar {
  background-color: var(--color-background-soft);
}

.fila-par {
  background-color: var(--color-background-mute);
}

.no-orders {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  color: var(--color-text);
}

/* Footer paginación */
::v-deep(.v-data-table-footer) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

::v-deep(.v-data-table-footer .v-select),
::v-deep(.v-data-table-footer .v-field) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}
</style>
