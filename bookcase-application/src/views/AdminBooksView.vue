<template>
  <v-container class="book-list-container">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="book-list-vcard" elevation="6">
          <h2 class="text-h5 font-weight-bold text-center mb-6 color-proyecto">
            <v-icon class="mr-2">mdi-book-open-variant</v-icon>
            {{ $t("libros.titulo") }}
          </h2>

          <v-row justify="center" align="center">
            <v-col cols="12" md="12">
              <v-text-field
                v-model="searchQuery"
                :placeholder="$t('libros.buscar')"
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
            </v-col>
          </v-row>

          <v-data-table
            v-if="filteredBooks.length > 0"
            :headers="headers"
            :items="filteredBooks"
            :items-per-page="5"
            :page.sync="currentPage"
            :items-per-page-options="[5, 10, 20, 50, -1]"
            :items-per-page-text="$t('tabla.elementosPorPagina')"
            :items-per-page-all-text="$t('tabla.todos')"
            class="mt-4"
          >
            <template #item="{ item, index }">
              <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
                <td>{{ item.title || "-" }}</td>
                <td>{{ item.author || "-" }}</td>
                <td>{{ translatedGenre(item.genre) || "-" }}</td>
                <td>{{ item.year || "-" }}</td>
              </tr>
            </template>

            <template #no-data>
              <div class="no-datos">{{ $t("libros.sinResultados") }}</div>
            </template>
          </v-data-table>

          <p v-else class="no-books">{{ $t("libros.sinLibros") }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useBookStore } from "@/stores/book_store";
import { useI18n } from "vue-i18n";

const bookStore = useBookStore();
const searchQuery = ref("");
const currentPage = ref(1);
const { t } = useI18n();

const headers = computed(() => [
  { title: t("libros.titulo"), key: "title", align: "center", sortable: true },
  { title: t("libros.autor"), key: "author", align: "center", sortable: true },
  { title: t("libros.genero"), key: "genre", align: "center", sortable: true },
  { title: t("libros.anio"), key: "year", align: "center", sortable: true },
]);

const translatedGenre = (genre) => {
  return t(`libros.generos.${genre}`) || genre;
};

const filteredBooks = computed(() => {
  const search = searchQuery.value.toLowerCase().trim();
  return bookStore.books
    .map((book) => ({
      title: book.data?.title || "",
      author: book.data?.author || "",
      genre: book.data?.genre || "-",
      year: book.data?.primera_publicacion || "-",
    }))
    .filter((book) => {
      return (
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search)
      );
    });
});

onMounted(async () => {
  await bookStore.fetchBooks();
});
</script>

<style scoped>
.book-list-container {
  padding: 1.5rem auto;
}

/* 🎯 Card contenedor con fondo dinámico */
.book-list-vcard {
  padding: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

/* 🎯 Título */
.color-proyecto {
  color: #2c3e50;
}

html[data-theme="dark"] .color-proyecto {
  color: var(--color-heading) !important;
}

/* 🎯 Cabecera de tabla */
::v-deep(.v-data-table thead th) {
  background-color: #2c3e50 !important;
  color: white !important;
  font-size: 1.1rem;
  text-align: center;
}

/* 🎯 Icono de orden */
::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.6rem;
}

/* 🎯 Celdas del cuerpo */
.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
  color: var(--color-text) !important;
  background-color: var(--color-background-soft) !important;
  text-align: center;
}

/* 🎯 Alternancia de filas */
.fila-par {
  background-color: var(--color-background-soft);
}

.fila-impar {
  background-color: var(--color-background-mute);
}

/* 🎯 No resultados */
.no-datos,
.no-books {
  text-align: center;
  font-size: 1rem;
  color: var(--color-text);
  padding: 1rem 0;
}

/* 🎯 Footer de tabla */
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
