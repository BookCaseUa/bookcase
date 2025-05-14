<template>
  <v-container class="add-offer-container">
    <v-card elevation="6" class="pa-6 offer-card">
      <h2 class="text-center mb-6">{{ $t("nuevaOferta.titulo") }}</h2>

      <v-form @submit.prevent="handleSubmit" v-model="valid">
        <v-row>
          <v-col cols="12" md="12">
            <v-autocomplete
              v-model="selectedEditionId"
              :items="editionOptions"
              item-value="id"
              item-title="book_title"
              :label="$t('nuevaOferta.seleccionaEdicion')"
              :rules="[rules.required]"
              clearable
              outlined
              hide-details="auto"
              :no-data-text="$t('nuevaOferta.sinEdiciones')"
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props" class="mb-3">
                  <v-row no-gutters align="center">
                    <v-col cols="auto">
                      <v-img
                        :src="
                          item.raw.image ||
                          'https://via.placeholder.com/60x90.png'
                        "
                        width="60"
                        height="90"
                        style="border-radius: 4px"
                        cover
                        class="mr-2 mt-1"
                      />
                    </v-col>

                    <v-col>
                      <div v-if="item.raw.author">
                        {{ $t("nuevaOferta.autor") }} {{ item.raw.author }}
                      </div>
                      <div v-if="item.raw.genre">
                        {{ $t("nuevaOferta.genero") }}
                        {{ $t(`nuevaOferta.generosLista.${item.raw.genre}`) }}
                      </div>
                      <div v-if="item.raw.type">
                        {{ $t("nuevaOferta.tipo") }}
                        {{ $t(`nuevaOferta.tipos.${item.raw.type}`) }}
                      </div>
                    </v-col>
                  </v-row>
                </v-list-item>
              </template>
            </v-autocomplete>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="form.language"
              :label="$t('nuevaOferta.idioma')"
              :items="languages"
              item-title="text"
              item-value="value"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-select
              v-model="form.condition"
              :label="$t('nuevaOferta.condicion')"
              :items="conditions"
              item-title="text"
              item-value="value"
              :rules="[rules.required]"
            ></v-select>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="form.price"
              :label="$t('nuevaOferta.precio')"
              type="number"
              :rules="[rules.required, rules.price]"
              required
              solo
              dense
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="form.comment"
              :label="$t('nuevaOferta.comentario')"
              rows="3"
            ></v-textarea>
          </v-col>

          <v-col cols="12" class="text-center">
            <v-btn type="submit" class="button-publicar" block>{{
              $t("nuevaOferta.publicar")
            }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-snackbar
      v-model="showSuccessSnackbar"
      location="top"
      color="green"
      timeout="3000"
    >
      {{ $t("nuevaOferta.publicada") }}
    </v-snackbar>

    <v-snackbar
      v-model="showErrorSnackbar"
      location="top"
      color="red"
      timeout="3000"
    >
      {{ $t("nuevaOferta.noPublicada") }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useOfferStore } from "../stores/offer_store";
import { useUserStore } from "../stores/user_store";
import { useBookStore } from "@/stores/book_store";
import { useEditionStore } from "@/stores/edition_store";
import { useI18n } from "vue-i18n";

const offerStore = useOfferStore();
const userStore = useUserStore();
const bookStore = useBookStore();
const editionStore = useEditionStore();
const { t } = useI18n();

const valid = ref(false);
const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);

const selectedEditionId = ref(null);
const editionOptions = ref([]);

const form = ref({
  language: null,
  condition: null,
  price: null,
  comment: "",
});

const rules = {
  required: (v) => !!v || t("nuevaOferta.reglaCampo"),
  price: (v) => v > 0 || t("nuevaOferta.reglaPrecio"),
};

const languages = computed(() => [
  { text: t("nuevaOferta.espanol"), value: "ES" },
  { text: t("nuevaOferta.ingles"), value: "EN" },
  { text: t("nuevaOferta.frances"), value: "FR" },
  { text: t("nuevaOferta.aleman"), value: "DE" },
  { text: t("nuevaOferta.italiano"), value: "IT" },
]);

const conditions = computed(() => [
  { text: t("nuevaOferta.nuevo"), value: "NEW" },
  { text: t("nuevaOferta.seminuevo"), value: "LIKE NEW" },
  { text: t("nuevaOferta.bueno"), value: "GOOD" },
  { text: t("nuevaOferta.aceptable"), value: "ACCEPTABLE" },
  { text: t("nuevaOferta.malo"), value: "BAD" },
]);

const handleSubmit = async () => {
  if (!valid.value) return;

  try {
    const edition_id = selectedEditionId.value;
    const seller_id = userStore.id;

    await offerStore.createOffer(
      edition_id,
      seller_id,
      form.value.language,
      form.value.condition,
      parseFloat(form.value.price),
      form.value.comment
    );

    showSuccessSnackbar.value = true;
    selectedEditionId.value = null;
    form.value = {
      language: null,
      condition: null,
      price: null,
      comment: "",
    };
    valid.value = false;
    // router.push("/mis-ofertas");
  } catch (error) {
    console.error("Error al crear la oferta:", error);
    alert($t("nuevaOferta.alertaError"));
  }
};

onMounted(async () => {
  // Cargar ediciones y libros desde los stores
  await editionStore.getEditions();
  await bookStore.getBooks();

  const editions = editionStore.editions;
  const books = bookStore.books;

  editionOptions.value = editions.map((edition) => {
    const book = books.find((b) => b.id === edition.data.book_id);
    return {
      id: edition.id,
      book_title: edition.data.book_title,
      author: book ? book.data.author : t("nuevaOferta.autorDesconocido"),
      genre: book ? book.data.genre : t("nuevaOferta.generoDesconocido"),
      type: edition.data.type,
      image: edition.data.image || "default_image_url",
    };
  });
  console.log("Ediciones cargadas: ", editionOptions.value);
});
</script>

<style scoped>
.add-offer-container {
  width: 65%;
  margin: auto;
  padding-top: 30px;
}

/* Adaptamos la card */
.offer-card {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

/* Título */
.offer-title {
  color: var(--color-heading);
}

/* Botón */
.button-publicar {
  background-color: #1867c0;
  color: white;
}
.button-publicar:hover {
  background-color: #2c3e50;
}

/* Campos de input */
.v-field {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

/* Texto dentro de los inputs */
.v-input__control input,
.v-input__control textarea {
  color: var(--color-text) !important;
}

/* 🎯 SOLO los menús de esta página */
:deep(.v-overlay__content .v-list) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

:deep(.v-overlay__content .v-list-item-title) {
  color: var(--color-text) !important;
}

.imagen-expandida {
  width: 100%;
  height: 100%;
  object-position: top;
  object-fit: cover;
}
</style>

<style>
/* SOLO aplicamos fondo oscuro al overlay en modo dark */
html[data-theme="dark"] .v-overlay__content .v-list {
  background-color: #1e1e1e !important;
  color: #f0f0f0 !important;
}

/* Aseguramos también los títulos de los ítems */
html[data-theme="dark"] .v-overlay__content .v-list-item-title {
  color: #f0f0f0 !important;
}
</style>
