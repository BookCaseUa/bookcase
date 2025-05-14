<!-- src/components/ValoracionPedido.vue -->
<template>
  <v-dialog v-model="visible" max-width="700" persistent>
    <v-card class="valoracion-card">
      <v-card-title class="titulo">
        {{ $t("pedidos.valoraciones.titulo") }}
      </v-card-title>

      <v-card-text>
        <div class="mb-6">
          <div class="nombre-edicion">
            <span>{{ productoNombre }}</span>
          </div>
          <v-rating
            class="rating"
            v-model="puntuacionProducto"
            length="5"
            color="amber"
            background-color="grey lighten-2"
            half-increments
            hover
          />
          <span
            v-if="errorProducto"
            class="text-error text-caption text-center d-block"
          >
            {{ $t("pedidos.valoraciones.errorProducto") }}
          </span>
        </div>

        <div>
          <div class="nombre-usuario">
            <span>{{ vendedorNombre }}</span>
          </div>
          <v-rating
            class="rating"
            v-model="puntuacionVendedor"
            length="5"
            color="amber"
            background-color="grey lighten-2"
            half-increments
            hover
          />

          <span
            v-if="errorVendedor"
            class="text-error text-caption text-center d-block"
          >
            {{ $t("pedidos.valoraciones.errorVendedor") }}
          </span>

          <v-textarea
            v-model="comentario"
            :label="$t('pedidos.valoraciones.comentarioPlaceholder')"
            :hint="$t('pedidos.valoraciones.comentarioAyuda')"
            persistent-hint
            rows="2"
            auto-grow
            density="comfortable"
            class="comentario"
          />
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn class="boton-enviar" variant="text" @click="enviarValoracion">
          {{ $t("pedidos.valoraciones.enviar") }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar
    v-model="snackbar"
    color="#2c3e50"
    timeout="2000"
    location="center"
    rounded="pill"
  >
    {{ snackbarMessage }}
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";
import { useOrderStore } from "@/stores/order_store";

const puntuacionProducto = ref(0);
const puntuacionVendedor = ref(0);
const comentario = ref("");

const errorProducto = ref(false);
const errorVendedor = ref(false);

const snackbar = ref(false);
const snackbarMessage = ref("Gracias por tu valoración.");

const orderStore = useOrderStore();

const props = defineProps({
  modelValue: Boolean,
  pedidoId: String,
  productoNombre: String,
  vendedorNombre: String,
});

const emit = defineEmits(["update:modelValue", "valoracionEnviada"]);

const visible = ref(props.modelValue);

watch(
  () => props.modelValue,
  (val) => {
    visible.value = val;
  }
);

watch(visible, (val) => {
  emit("update:modelValue", val);
});

const cerrar = () => {
  visible.value = false;
};

const enviarValoracion = async () => {
  errorProducto.value = puntuacionProducto.value === 0;
  errorVendedor.value = puntuacionVendedor.value === 0;

  if (errorProducto.value || errorVendedor.value) return;

  const result = await orderStore.rateArrivedOrder(
    props.pedidoId,
    puntuacionVendedor.value,
    puntuacionProducto.value,
    comentario.value.trim()
  );

  if (result.result === "SUCCESS") {
    snackbarMessage.value = "Gracias por tu valoración.";
    snackbar.value = true;
    cerrar();
  } else {
    snackbarMessage.value = "Error al guardar la valoración.";
    snackbar.value = true;
  }
};
</script>

<style scoped>
.valoracion-card {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
}

.valoracion-card .v-card-title,
.valoracion-card .v-card-text,
.valoracion-card .v-card-actions {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.v-textarea,
.v-textarea textarea {
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.v-textarea .v-field__field {
  background-color: transparent;
}

.titulo {
  font-size: x-large;
  font-weight: bold;
  text-align: center;
  margin-top: 2%;
}

.nombre-edicion,
.nombre-usuario {
  font-weight: normal;
  text-align: center;
}

.rating {
  justify-content: center;
  display: flex;
  margin-bottom: 1%;
}

.comentario {
  margin-bottom: 2%;
}

.boton-enviar {
  background-color: var(--color-primary);
  color: var(--color-text);
}
</style>
