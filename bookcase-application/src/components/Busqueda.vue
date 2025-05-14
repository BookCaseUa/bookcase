<template>
  <div class="d-flex align-center">
    <v-select
      v-if="mostrarSelector"
      v-model="opcion"
      :items="opciones"
      item-title="text"
      item-value="value"
      :label="$t('home.buscarPor')"
      dense
      variant="outlined"
      density="compact"
      style="max-width: 150px; margin-right: 20px"
    />
    <v-text-field
      v-model="textoBusqueda"
      :placeholder="
        placeholder ||
        $t('home.buscarBusqueda', { tipo: mostrarSelector ? tipoOpcion : '' })
      "
      @click:clear="limpiarBusqueda"
      @input="emit('buscar', { opcion, texto: textoBusqueda })"
      dense
      variant="outlined"
      prepend-inner-icon="mdi-magnify"
      clearable
      rounded
      density="compact"
      ref="inputBusqueda"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps({
  mostrarSelector: { type: Boolean, default: true },
  placeholder: { type: String, default: "" },
});

const opciones = computed(() => [
  { value: "libros", text: t("home.libros") },
  { value: "usuarios", text: t("home.usuarios") },
]);

const emit = defineEmits(["buscar"]);

const opcion = ref("");
const textoBusqueda = ref("");
const inputBusqueda = ref(null);

const tipoOpcion = computed(() => {
  const item = opciones.value.find((o) => o.value === opcion.value);
  return item ? item.text : "";
});

watch(opcion, () => {
  textoBusqueda.value = "";
  emit("buscar", { opcion: opcion.value, texto: "" });
});

const limpiarBusqueda = () => {
  textoBusqueda.value = "";
  emit("buscar", { opcion: opcion.value, texto: "" });
};

onMounted(() => {
  opcion.value = opciones.value[0].value;
});
</script>
