<template>
  <v-container class="py-10 novedades-container">
    <h1 class="text-h4 mb-6 text-center">
      <v-icon class="novedades-icon mr-2">mdi-book-open-page-variant</v-icon>
      {{ $t("home.librosAnadidosRecientemente") }}
    </h1>

    <!-- Filtros -->
    <v-row class="mb-8" justify="center">
      <v-col cols="12" md="3">
        <v-text-field v-model="filtros.title" :label="$t('home.titulo')" clearable />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtros.author" :label="$t('home.autor')" clearable />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model="filtros.genre" :label="$t('home.genero')" clearable />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field v-model.number="filtros.year" :label="$t('home.anoPublicacion')" type="number" clearable />
      </v-col>
    </v-row>

    <!-- Tarjetas -->
    <v-row>
      <v-col
        v-for="edition in filteredEditions"
        :key="edition.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <div class="card-wrapper" @click="goToEdition(edition.id)">
          <img
            :src="edition.data.image || 'https://placehold.co/400x600'"
            class="cover-image"
          />
          <div class="overlay">
            <p class="title">{{ getBookData(edition.data.book_id).title || 'Sin título' }}</p>
            <p class="subtitle">
              {{ getBookData(edition.data.book_id).author || $t("home.autorDesconocido") }}
            </p>
            <p class="subtitle">
              {{ edition.data.editorial || $t("wishlist.editorialDesconocida") }}
            </p>
            <p class="subtitle">
              {{ $t(`wishlist.tipos.${edition.data.type || 'Otro'}`) }}
            </p>
            <p class="year">
              {{ $t("home.publicado") }}: {{ edition.data.year || $t("wishlist.añoDesconocido") }}
            </p>
          </div>
        </div>
      </v-col>
    </v-row>

    <div
      v-if="filteredEditions.length === 0"
      class="text-center mt-10 no-books-message"
    >
      <v-icon color="red" class="mb-2">mdi-alert-circle-outline</v-icon><br />
      {{ $t("home.noLibrosConFiltros") }}
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useBookStore } from "@/stores/book_store";
import { useEditionStore } from "@/stores/edition_store";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const router = useRouter();
const bookStore = useBookStore();
const editionStore = useEditionStore();
const { t } = useI18n();
const books = ref([]);
const editions = ref([]);

const filtros = ref({
  title: "",
  author: "",
  genre: "",
  year: null,
});

onMounted(async () => {
  const resultBooks = await bookStore.getBooks();
  const resultEditions = await editionStore.getEditions();
  if (resultBooks.result === "SUCCESS") books.value = resultBooks.data;
  if (resultEditions.result === "SUCCESS") editions.value = resultEditions.data;
});

function goToEdition(editionId) {
  router.push(`/infoEdicion/${editionId}`);
}

function getBookData(bookId) {
  return books.value.find((b) => b.id === bookId)?.data || {};
}

const filteredEditions = computed(() => {
  return editions.value
    .filter((edition) => {
      const book = getBookData(edition.data.book_id);
      const titleOk =
        !filtros.value.title ||
        book.title?.toLowerCase().includes(filtros.value.title.toLowerCase());
      const authorOk =
        !filtros.value.author ||
        book.author?.toLowerCase().includes(filtros.value.author.toLowerCase());
      const genreOk =
        !filtros.value.genre ||
        book.genre?.toLowerCase().includes(filtros.value.genre.toLowerCase());
      const yearOk =
        !filtros.value.year || edition.data.year == filtros.value.year;
      return edition.data.image && titleOk && authorOk && genreOk && yearOk;
    })
    .slice(0, 12);
});
</script>

<style scoped>
.novedades-container {
  background-color: var(--color-background);
  color: var(--color-text);
}

.novedades-icon {
  color: var(--color-heading);
}

h1 {
  color: var(--color-heading);
}

.card-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 10px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-wrapper:hover {
  transform: scale(1.03);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 10px;
}

/* Overlay */
.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(20, 20, 20, 0.8);
  color: white;
  padding: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.card-wrapper:hover .overlay {
  opacity: 1;
}

.title {
  font-weight: bold;
  font-size: 1.1em;
}

.subtitle {
  font-size: 0.9em;
  margin-top: 4px;
}

.year {
  font-size: 0.8em;
  margin-top: 6px;
  opacity: 0.8;
}

.no-books-message {
  color: var(--color-text);
}
</style>
