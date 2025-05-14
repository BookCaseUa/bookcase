<template>
  <v-navigation-drawer
    location="right"
    :permanent="!mdAndDown"
    :temporary="mdAndDown"
    width="300"
    class="pa-4 resumen-carrito"
    :style="{ top: '100px', height: 'calc(100vh - 100px - 64px)' }"
    v-if="offers.length > 0"
  >
    <h3 class="titulo">
      🛒 {{ $t("resumenCarrito.titulo") }} ({{ offers.length }})
    </h3>

    <v-list density="compact">
      <v-list-item
        v-for="item in offers"
        :key="item.id"
        class="mb-2 pa-2"
        style="border-bottom: 1px solid #ccc"
      >
        <div class="w-100 d-flex justify-space-between">
          <div class="info-carrito">
            <v-list-item-title class="text-truncate font-weight-medium">
              {{ item.data.edition_book_name }}
            </v-list-item-title>
            <v-list-item-subtitle class="text-caption detalle-oferta">
              {{ $t(`resumenCarrito.${item.data.condition}`) }} ·
              {{ item.data.language }} · {{ item.data.price }} €
            </v-list-item-subtitle>

            <div class="vendedor">
              {{ $t("resumenCarrito.vendedor") }}:
              {{ usuariosMapeados[item.data.seller_id] || "Usuario" }}
            </div>
          </div>

          <v-btn
            icon
            color="red"
            size="small"
            variant="text"
            class="ms-2 mt-1"
            @click="eliminarOferta(item.id)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </div>
      </v-list-item>
    </v-list>

    <div class="mt-4 d-flex justify-space-between align-center">
      <strong>Total:</strong>
      <span>{{ totalPrice.toFixed(2) }} €</span>
    </div>

    <v-btn
      block
      class="mt-4"
      color="primary"
      @click="estaLogueado ? $router.push('/carrito') : $router.push('/login')"
    >
      {{ $t("resumenCarrito.irCarrito") }}
    </v-btn>
  </v-navigation-drawer>
</template>

<script setup>
import { computed, onMounted, ref, watch, nextTick } from "vue";
import { useDisplay } from "vuetify";
import { useCartStore } from "@/stores/cart_store";
import { useUserStore } from "@/stores/user_store";

const { mdAndDown } = useDisplay();
const usuariosMapeados = ref({});
const userStore = useUserStore();
const estaLogueado = computed(() => userStore.logged);

const traducirCondicion = (c) =>
  ({
    NEW: "Nuevo",
    "LIKE NEW": "Seminuevo",
    GOOD: "Bueno",
    ACCEPTABLE: "Aceptable",
    BAD: "Malo",
  }[c] || c);

const cartStore = useCartStore();

const offers = ref([]);

const loadCartOffers = async () => {
  offers.value = await cartStore.getCartItems();
  /* console.log("📦 Contenido del carrito:", offers.value); */
  for (const item of offers.value) {
    const sellerId = item.data?.seller_id;
    if (sellerId && !usuariosMapeados.value[sellerId]) {
      const usuario = await userStore.fetchUserById(sellerId);
      usuariosMapeados.value[sellerId] = usuario?.data?.nickname || "Usuario";
    }
  }
  // Eliminar IDs inválidos del carrito (sin tocar el backend ni el store)
  cartStore.cart = cartStore.cart.filter((id) =>
    offers.value.some((oferta) => oferta.id === id)
  );
};

onMounted(loadCartOffers);

// Recargar si cambia el número de items (por ejemplo al eliminar)
watch(
  () => cartStore.number_of_items,
  async () => {
    await loadCartOffers();
  }
);

const totalPrice = computed(() =>
  offers.value.reduce((sum, item) => sum + (item.data.price || 0), 0)
);

const emit = defineEmits(["eliminar-oferta"]);

const eliminarOferta = async (id) => {
  emit("eliminar-oferta", id);

  // Esperamos a que Pinia actualice
  await nextTick();

  // Si el carrito está vacío tras eliminar, limpiamos persistencia manualmente
  if (cartStore.cart.length === 0) {
    localStorage.setItem("cart", JSON.stringify({ cart: [] }));
  }
};
</script>

<style scoped>
.resumen-carrito {
  top: 190px;
  height: calc(100vh - 190px - 64px);
  /* evita tapar el footer */
  overflow-y: auto;
  z-index: 999 !important;
  position: fixed;
  display: flex;
  flex-direction: column;
}

:deep(.resumen-carrito .v-navigation-drawer__content) {
  padding-top: 100px;
}

.titulo {
  text-align: center;
}

.info-carrito {
  display: flex;
  flex-direction: column;
  max-width: 80%;
}

.detalle-oferta {
  white-space: normal;
  overflow: visible;
  font-size: 0.85rem;
  color: #333;
}

.vendedor {
  font-weight: 500;
  color: #666;
  font-size: 0.8rem;
  font-style: italic;
  margin-top: 4px;
  margin-left: 4px;
}
</style>

<style>
/* 🌙 MODO OSCURO PARA RESUMEN CARRITO */
html[data-theme="dark"] .resumen-carrito {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
  border-left: 1px solid var(--color-border, #444);
}

html[data-theme="dark"] .resumen-carrito .titulo {
  color: var(--color-heading) !important;
}

html[data-theme="dark"] .resumen-carrito .detalle-oferta {
  color: var(--color-text) !important;
}

html[data-theme="dark"] .resumen-carrito .vendedor {
  color: var(--color-text-muted, #bbb) !important;
}

/* 🔹 Bordes de las líneas de los items */
html[data-theme="dark"] .resumen-carrito .v-list-item {
  border-bottom: 1px solid var(--color-border, #555) !important;
}

/* 🔹 Botón "Ir al carrito" */
html[data-theme="dark"] .resumen-carrito .v-btn {
  color: white !important;
}

/* 🔹 Icono de borrar */
html[data-theme="dark"] .resumen-carrito .v-icon {
  color: red !important;
}
</style>
