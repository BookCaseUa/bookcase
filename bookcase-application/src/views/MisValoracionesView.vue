<template>
  <v-container class="py-6">
    <h1 class="titulo">{{ $t("valoraciones.titulo") }}</h1>

    <v-alert
      v-if="valoraciones.length === 0"
      class="custom-alert"
      border="start"
      density="comfortable"
      variant="flat"
    >
      {{ $t("valoraciones.sinValoraciones") }}
    </v-alert>

    <v-row v-else>
      <v-col
        cols="12"
        sm="6"
        md="4"
        v-for="order in valoraciones"
        :key="order.id"
      >
        <v-card class="mb-4 flip-card texto">
          <div class="flip-card-inner">
            <!-- Parte delantera -->
            <div class="flip-card-front">
              <v-card-title class="text-h6"
                >{{ $t("valoraciones.pedido") }}: {{ order.id }}</v-card-title
              >
              <v-card-subtitle>
                {{ $t("valoraciones.fecha") }}:
                {{
                  formatDate(order.delivery_date || order.buying_date) ||
                  "Sin fecha"
                }}
              </v-card-subtitle>
              <v-card-text>
                <div class="info-line">
                  <strong>{{ $t("valoraciones.vendedor") }}:</strong>
                  {{ order.seller_name }}
                </div>

                <div class="info-line">
                  <strong>{{ $t("valoraciones.valoracionVendedor") }}:</strong
                  ><br />
                  <v-rating
                    :model-value="order.user_rating || 0"
                    color="amber"
                    readonly
                    density="compact"
                    half-increments
                  />
                </div>

                <div class="info-line">
                  <strong>{{ $t("valoraciones.valoracionLibro") }}:</strong
                  ><br />
                  <v-rating
                    :model-value="order.book_rating || 0"
                    color="amber"
                    readonly
                    density="compact"
                    half-increments
                  />
                </div>

                <div class="info-line">
                  <strong>{{ $t("valoraciones.comentario") }}:</strong>
                  {{ order.comment || "Sin comentario" }}
                </div>
              </v-card-text>
            </div>

            <!-- Parte trasera -->
            <div class="flip-card-back">
              <v-btn
                variant="text"
                color="primary"
                class="mb-2"
                @click="verPerfil(order)"
                >{{ $t("valoraciones.verPerfilVendedor") }}</v-btn
              >
              <v-btn
                variant="text"
                color="secondary"
                @click="verPedido(order)"
                >{{ $t("valoraciones.verDetallesPedido") }}</v-btn
              >
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
    <v-pagination
      v-model="page"
      :length="Math.ceil(valoraciones.length / itemsPerPage)"
      rounded
      class="mt-4 pagination"
    ></v-pagination>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useOrderStore } from "@/stores/order_store";
import { useUserStore } from "@/stores/user_store";
import { useRouter } from "vue-router";

const orderStore = useOrderStore();
const userStore = useUserStore();
const valoraciones = ref([]);
const router = useRouter();

const page = ref(1);
const itemsPerPage = 6;

const paginatedValoraciones = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  console.log("Mostrando desde", start, "hasta", end);
  return valoraciones.value.slice(start, end);
});

onMounted(async () => {
  const userId = userStore.id;
  if (!userId) {
    console.warn("No hay usuario logueado.");
    return;
  }

  const result = await orderStore.getPurchasesFromUser(userId);
  console.log("Pedidos por usuario actual: ", result);
  if (result.result === "SUCCESS") {
    valoraciones.value = result.data.filter(
      (order) =>
        (typeof order.user_rating === "number" && order.user_rating > 0) ||
        (typeof order.book_rating === "number" && order.book_rating > 0)
    );
    page.value = 1;

    console.log("Valoraciones filtradas:", valoraciones.value);
  }
});

function formatDate(fecha) {
  if (!fecha) return null;
  if (fecha.seconds) return new Date(fecha.seconds * 1000).toLocaleDateString();
  return new Date(fecha).toLocaleDateString();
}

function verPerfil(order) {
  router.push(`/perfil/${order.seller_id}`);
}

function verPedido(order) {
  console.log("Ver pedido:", order.id);
  // Aquí tu compañero conectará a la vista de pedido
}
</script>

<style scoped>
.titulo {
  text-align: center;
  margin-top: 2%;
  margin-bottom: 1%;
  color: var(--color-heading);
}

.custom-alert {
  background-color: #354b61;
  color: white;
}

.info-line {
  margin-bottom: 12px;
  color: var(--color-text);
}

.texto {
  text-align: center;
  color: var(--color-text);
}

.pagination {
  margin-top: 2rem;
  justify-content: center;
  color: var(--color-text);
}

/* 🎯 Flip Card Effect */
.flip-card {
  background-color: transparent;
  perspective: 1000px;
  min-height: 300px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card:hover .flip-card-inner {
  transform: rotateY(-180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  min-height: 300px;
  border-radius: 8px;
  background-color: var(--color-background);
  color: var(--color-text);
}

.flip-card-back {
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Modo oscuro */
:deep(.dark) .flip-card-back,
:deep(.dark) .flip-card-front {
  background-color: #222 !important;
  color: #eee !important;
}

:deep(.dark) .v-pagination__item {
  background-color: #333 !important;
  color: #ccc !important;
  box-shadow: 0 0 0 1px #555 inset;
}

:deep(.dark) .v-pagination__item--is-active {
  background-color: var(--color-primary) !important;
  color: white !important;
  font-weight: bold;
  box-shadow: 0 0 0 1px var(--color-primary) inset;
}
</style>
