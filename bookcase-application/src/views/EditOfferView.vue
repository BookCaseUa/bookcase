<template>
  <v-container>
    <v-card class="pa-6 mx-auto my-8" max-width="900">
      <v-row justify="center">
        <h2 class="titulo-editar">{{ $t("editarOferta.tituloVista") }}</h2>
      </v-row>

      <v-row class="mt-4" justify="center">
        <v-col cols="12" md="4" class="d-flex justify-center align-center">
          <v-img :src="imagenLibro" class="imagen-libro" />
        </v-col>

        <v-col cols="12" md="8">
          <v-text-field
            v-model="ofertaEditable.edition_book_name"
            :label="$t('editarOferta.titulo')"
            readonly
          />

          <v-text-field
            v-model="ofertaEditable.condition"
            :label="$t('editarOferta.condicion')"
            readonly
          />

          <v-text-field
            v-model="ofertaEditable.language"
            :label="$t('editarOferta.idioma')"
            readonly
          />

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="ofertaEditable.price"
                :label="$t('editarOferta.precio')"
                type="number"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="ofertaEditable.status"
                :label="$t('editarOferta.estado')"
                readonly
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="ofertaEditable.comment"
            :label="$t('editarOferta.comentario')"
          />
        </v-col>
      </v-row>

      <v-row class="botones">
        <v-btn
          class="boton-cancelar"
          variant="text"
          @click="router.push('/mis-ofertas')"
          >{{ $t("editarOferta.cancelar") }}</v-btn
        >
        <v-btn class="boton-guardar" variant="text" @click="guardarCambios">{{
          $t("editarOferta.guardar")
        }}</v-btn>
      </v-row>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOfferStore } from "@/stores/offer_store";
import { useEditionStore } from "@/stores/edition_store";

const route = useRoute();
const router = useRouter();

const offerStore = useOfferStore();
const editionStore = useEditionStore();

const ofertaEditable = ref({
  id: "",
  edition_book_name: "",
  condition: "",
  language: "",
  status: "",
  price: 0,
  comment: "",
});

const imagenLibro = ref("");
const originalOferta = ref({});

onMounted(async () => {
  const id = route.params.id;
  const result = await offerStore.getOffers();
  const oferta = result.data.find((o) => o.id === id);
  if (!oferta) return router.push("/mis-ofertas");

  // Asignar valores a editable y original
  const values = {
    id: oferta.id,
    edition_book_name: oferta.data.edition_book_name,
    condition: traducirCondicion(oferta.data.condition),
    language: oferta.data.language,
    status: traducirEstado(oferta.data.status),
    price: oferta.data.price,
    comment: oferta.data.comment,
  };
  ofertaEditable.value = { ...values };
  originalOferta.value = { ...values };

  // Imagen de la edición
  const edicion = (await editionStore.getEditions()).data.find(
    (e) => e.id === oferta.data.edition_id
  );
  if (edicion?.data?.image) {
    imagenLibro.value = edicion.data.image;
  }
});

const guardarCambios = async () => {
  const { id, price, comment, language, condition } = ofertaEditable.value;
  const cambios = {};

  if (price !== originalOferta.value.price) {
    cambios.price = price;
  }

  if (comment !== originalOferta.value.comment) {
    cambios.comment = comment;
  }

  // Solo enviamos los cambios, el resto null
  await offerStore.updateOffer(
    id,
    null, // status
    cambios.price != null || cambios.comment != null ? language : null,
    cambios.price != null || cambios.comment != null
      ? traducirCondicionInverso(condition)
      : null,
    cambios.price != null ? price : null,
    cambios.comment != null ? comment : null
  );

  router.push("/mis-ofertas");
};

const traducirCondicion = (c) =>
  ({
    NEW: "Nuevo",
    "LIKE NEW": "Seminuevo",
    GOOD: "Bueno",
    ACCEPTABLE: "Aceptable",
    BAD: "Malo",
  }[c] || c);

const traducirCondicionInverso = (c) =>
  ({
    Nuevo: "NEW",
    Seminuevo: "LIKE NEW",
    Bueno: "GOOD",
    Aceptable: "ACCEPTABLE",
    Malo: "BAD",
  }[c] || c);

const traducirEstado = (s) =>
  ({
    ACTIVE: "Activa",
    "IN CART": "En carrito",
    SOLD: "Vendida",
  }[s] || s);
</script>

<style scoped>
/* 🎯 Contenedor de la página */
.v-container {
  padding-top: 1px;
  padding-bottom: 1px;
}

/* 🎯 Tarjeta principal */
.v-card {
  background-color: var(--color-background);
  color: var(--color-text);
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: background-color 0.3s, color 0.3s;
}

/* 🎯 Título */
.titulo-editar {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin: 2% 2%;
  color: var(--color-heading);
}

/* 🎯 Imagen */
.imagen-libro {
  width: 100%;
  max-width: 200px;
  height: auto;
  object-fit: contain;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
}

/* 🎯 Inputs */
.v-text-field,
.v-textarea {
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

/* 🎯 Labels */
.v-text-field .v-label,
.v-textarea .v-label {
  color: var(--color-heading) !important;
}

/* 🎯 Botones */
.botones {
  justify-content: space-between;
  margin-top: 24px;
}

.boton-guardar {
  color: #1565c0;
  font-weight: bold;
}

.boton-cancelar {
  color: #e53935;
  font-weight: bold;
}
</style>
