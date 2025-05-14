<template>
  <div class="container-lista">
    <h1 class="titulo" v-if="query">{{ $t("home.resultadosBusqueda") }}</h1>
    <h1 class="titulo" v-else>{{ $t("home.edicionesDestacadas") }}</h1>

    <ul>
      <li
        class="container-libro"
        v-for="(ed, index) in edicionesFiltradas"
        :key="ed.id"
        :style="getCardStyle(index)"
      >
        <img
          :src="ed.data.image || 'https://placehold.co/400x600'"
          alt="imagen"
          width="200"
          height="280"
        />
        <h2>{{ ed.data.book_title || $t("home.tituloNoDisponible") }}</h2>
        <p class="autor">{{ ed.author || $t("home.autorDesconocido") }}</p>
        <p class="editorial">
          {{ ed.data.editorial || $t("home.editorialDesconocida") }}
        </p>

        <router-link :to="'/infoEdicion/' + ed.id">
          <button class="ver">{{ $t("home.verMas") }}</button>
        </router-link>
      </li>
    </ul>

    <div v-if="edicionesFiltradas.length === 0" class="no-resultados">
      <p>{{ $t("home.sinResultadosPara") }} "{{ query }}".</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { useEditionStore } from "@/stores/edition_store";
import { useWantsStore } from "@/stores/wants_store";
import { useBookStore } from "@/stores/book_store";
import { useI18n } from "vue-i18n";

const route = useRoute();
const query = computed(() => route.query.q?.toLowerCase().trim() || "");

const bookStore = useBookStore();
const editionStore = useEditionStore();
const wants = useWantsStore();
const { t } = useI18n();

const obtenerAutor = (bookId) => {
  const book = bookStore.books.find((b) => b.id === bookId);
  return book ? book.data.author : t("home.autorDesconocido");
};

// 🔍 Ediciones filtradas por título o autor
const edicionesFiltradas = computed(() => {
  const todas = editionStore.editions
    .filter(
      (edition) =>
        !query.value ||
        edition.data.title?.toLowerCase().includes(query.value) ||
        obtenerAutor(edition.data.book_id)?.toLowerCase().includes(query.value)
    )
    .map((ed) => ({
      ...ed,
      author: obtenerAutor(ed.data.book_id),
    }));

  return todas.slice(0, 12); // Mostrar solo los primeros 12
});

const getCardStyle = (index) => {
  const total = edicionesFiltradas.value.length;
  if (total <= 1) return {}; // no hay degradado si solo hay 1

  // Valor entre 0 y 1, proporcional al índice
  const ratio = index / (total - 1);

  // Blanco a azul (#ffffff → #2c3e50)
  const r = Math.round(255 - (255 - 44) * ratio);
  const g = Math.round(255 - (255 - 62) * ratio);
  const b = Math.round(255 - (255 - 80) * ratio);

  return {
    backgroundColor: `rgb(${r}, ${g}, ${b})`,
    color: ratio > 0.5 ? "white" : "#222",
    "--autor-color": ratio > 0.5 ? "rgba(255,255,255,0.85)" : "#222222",
    "--editorial-color": ratio > 0.5 ? "rgba(255,255,255,0.7)" : "#444444",
    "--btn-color": ratio > 0.5 ? "white" : "#3498db",
    "--btn-bg": ratio > 0.5 ? "#3498db" : "transparent",
    "--btn-border": "#3498db",
    "--btn-hover-bg": ratio > 0.5 ? "white" : "#3498db",
    "--btn-hover-color": ratio > 0.5 ? "#3498db" : "white",
  };
};

onMounted(async () => {
  await editionStore.fetchEditions();
  await bookStore.fetchBooks();
  wants.init();
});
</script>

<style scoped>
.titulo {
  color: var(--color-heading);
  margin-top: 0.1%;
  transition: color 0.3s ease;
}

.container-lista {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin-top: 4%;
  background-color: transparent;
}

h1 {
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* ⬇️ Estilo original de la lista */
ul {
  list-style: none;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0;
  margin: 0;
}

/* 🔄 Tarjetas con fondo transparente para dejar ver el degradado */
.container-libro {
  background-color: rgba(255, 255, 255, 0.15);
  /* semitransparente */
  backdrop-filter: blur(4px);
  border-radius: 10px;
  padding: 16px;
  width: 280px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.container-libro:hover {
  transform: translateY(-5px);
}

/* Estilo refinado para textos */
.container-libro h2 {
  font-size: 16px;
  margin: 10px 0 4px;
  text-align: center;
  font-weight: 600;
}

.container-libro .autor {
  font-size: 15px;
  font-weight: 500;
  color: var(--autor-color);
  margin: 2px 0;
  text-align: center;
}

.container-libro .editorial {
  font-size: 13px;
  font-weight: 400;
  color: var(--editorial-color);
  text-align: center;
}

.ver {
  color: var(--btn-color);
  font-weight: 500;
  margin-top: 10px;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.ver:hover {
  background-color: var(--btn-hover-bg);
  color: var(--btn-hover-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.no-resultados {
  color: white;
  margin-top: 40px;
  font-size: 16px;
}
</style>
