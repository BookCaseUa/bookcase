<template>
  <section class="carrusel-wrapper" v-if="isReady">
    <h1 class="titulo-novedades">{{ $t("home.novedades") }}</h1>
    <swiper
      :modules="[Autoplay, Navigation]"
      :slides-per-view="5"
      :space-between="20"
      :loop="true"
      :autoplay="{ delay: 3000 }"
      :navigation="true"
      :breakpoints="{
        0: { slidesPerView: 1 },
        600: { slidesPerView: 2 },
        960: { slidesPerView: 3 },
        1264: { slidesPerView: 5 }
      }"
      class="swiper-container"
    >
      <swiper-slide
        v-for="edition in selectedEditions"
        :key="edition.id"
        class="slide-card"
      >
        <div class="card-wrapper" @click="goToEdition(edition.id)">
          <img
            :src="edition.data.image || 'https://placehold.co/400x600'"
            class="cover-image"
          />
          <div class="hover-info">
            <strong>{{ getBookData(edition.data.book_id).title || "Sin título" }}</strong><br />
            <span>{{ getBookData(edition.data.book_id).author || "Autor desconocido" }}</span><br />
            <span>{{ edition.data.editorial }}</span><br />
            <span>{{ $t(`wishlist.tipos.${edition.data.type || 'Otro'}`) }}</span><br />
            <span>{{ $t("home.publicado") }}: {{ edition.data.year || "?" }}</span>
          </div>
        </div>
      </swiper-slide>
    </swiper>

    <div class="text-center" style="margin: 0.5rem 0">
      <v-btn variant="text" color="blue lighten-1" dark @click="goToNews">
        {{ $t("home.verTodosNuevos") }}
      </v-btn>
    </div>
  </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from "swiper/vue";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { ref, onMounted, computed } from "vue";
import { useBookStore } from "@/stores/book_store";
import { useRouter } from "vue-router";
import { useEditionStore } from "@/stores/edition_store";
import { useI18n } from "vue-i18n";

const bookStore = useBookStore();
const editionStore = useEditionStore();
const books = ref([]);
const editions = ref([]);
const isReady = ref(false);
const { t } = useI18n();
const router = useRouter();

onMounted(async () => {
  const resultBooks = await bookStore.getBooks();
  const resultEditions = await editionStore.getEditions();

  if (resultBooks.result === "SUCCESS") {
    books.value = resultBooks.data;
  }

  if (resultEditions.result === "SUCCESS") {
    editions.value = resultEditions.data;
  }

  isReady.value = true;
});

const selectedEditions = computed(() => {
  return editions.value
    .filter((ed) => ed.data.image)
    .slice(0, 12);
});

function getBookData(bookId) {
  return books.value.find((b) => b.id === bookId)?.data || {};
}

function goToEdition(editionId) {
  router.push(`/infoEdicion/${editionId}`);
}

function goToNews() {
  router.push("/novedades");
}
</script>

<style scoped>
.carrusel-wrapper {
  padding: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.swiper-container {
  padding: 1%;
}

.titulo-novedades {
  color: var(--color-heading);
  font-size: 2em;
  text-align: center;
  margin-bottom: 1rem;
}

.slide-card {
  display: flex;
  justify-content: center;
  align-items: center;
}

.card-wrapper {
  width: 220px;
  height: 330px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.card-wrapper:hover {
  transform: scale(1.05);
}

.uniform-card {
  width: 100%;
  aspect-ratio: 2 / 3.2;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  background-color: transparent;
  box-shadow: none;
  transition: transform 0.3s ease;
}

.uniform-card:hover {
  transform: scale(1.05);
}

.portada-card {
  width: 100%;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
  border-radius: 12px;
  aspect-ratio: 2 / 3.2;
}

.portada-card:hover {
  transform: scale(1.05);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hover-info {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  font-size: 0.8rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-wrapper:hover .hover-info {
  opacity: 1;
}

.portada-card:hover .hover-info {
  opacity: 1;
}

.clickable-card {
  cursor: pointer;
}
</style>
