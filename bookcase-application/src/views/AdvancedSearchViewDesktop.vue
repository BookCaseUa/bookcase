<template>
    <div class="header-skip"></div>
  
    <div class="search-container">
      <h2 class="search-title">{{ $t("busquedaAvanzada.tituloVista") }}</h2>
      <form class="search-form" @submit.prevent="handleSearch">
        <div class="form-group">
          <label for="title">{{ $t("busquedaAvanzada.titulo") }}:</label>
          <input
            type="text"
            id="title"
            v-model="searchQuery.title"
            :placeholder="$t('busquedaAvanzada.placeholderTitulo')"
          />
        </div>
  
        <div class="form-group">
          <label for="author">{{ $t("busquedaAvanzada.autor") }}:</label>
          <input
            type="text"
            id="author"
            v-model="searchQuery.author"
            :placeholder="$t('busquedaAvanzada.placeholderAutor')"
          />
        </div>
  
        <div class="form-group">
          <label for="genre">{{ $t("busquedaAvanzada.genero") }}:</label>
          <select id="genre" v-model="searchQuery.genre">
            <option value="">{{ $t("busquedaAvanzada.cualquiera") }}</option>
            <option v-for="genre in genres" :key="genre" :value="genre">
              {{ genre }}
            </option>
          </select>
        </div>
  
        <div class="form-group">
          <label for="editorial">{{ $t("busquedaAvanzada.editorial") }}:</label>
          <input
            type="text"
            id="editorial"
            v-model="searchQuery.editorial"
            :placeholder="$t('busquedaAvanzada.placeholderEditorial')"
          />
        </div>
  
        <div class="form-group">
          <label for="year">{{ $t("busquedaAvanzada.año") }}:</label>
          <input
            type="number"
            id="year"
            v-model="searchQuery.year"
            :placeholder="$t('busquedaAvanzada.placeholderAño')"
          />
        </div>
  
        <div class="form-group">
          <label for="format">{{ $t("busquedaAvanzada.formato") }}:</label>
          <select id="format" v-model="searchQuery.format">
            <option value="">{{ $t("busquedaAvanzada.cualquiera") }}</option>
            <option v-for="format in formats" :key="format" :value="format">
              {{ format }}
            </option>
          </select>
        </div>
  
        <button type="submit" class="search-btn">
          {{ $t("busquedaAvanzada.buscar") }}
        </button>
      </form>
    </div>
  
  
  
    <div v-if="filteredEditions.length > 0" class="filtered-editions">
      <h3>Resultados:</h3>
      <div v-for="edition in filteredEditions" :key="edition.id" class="edition-item" @click="goToEdition(edition.id)">
        <img :src="edition.data.image" alt="Book image" class="edition-image" />
        <div class="edition-details">
          <div class="info-container">
            <h4>{{ edition.data.book_title }}</h4>
            <p>{{ edition.data.editorial }}</p>
            <p>{{ edition.data.type }}</p>
            <p>{{ edition.data.year }}</p>
          </div>
        </div>
      </div>
    </div>
  
  </template>
  
  <script setup>
  import { ref, computed } from "vue";
  import { useI18n } from "vue-i18n";
  import { useEditionStore } from "@/stores/edition_store";
  import { nextTick } from 'vue';
  import { useRouter } from 'vue-router';
  
  const { t } = useI18n();
  const editionStore = useEditionStore();
  const filteredEditions = ref([]);
  const router = useRouter();
  
  const goToEdition = (id) => {
    router.push(`/infoEdicion/${id}`);
  };
  
  const searchQuery = ref({
    title: "",
    author: "",
    genre: "",
    editorial: "",
    format: "",
    year: "",
  });
  
  const genres = computed(() => [
    t("busquedaAvanzada.cienciaFiccion"),
    t("busquedaAvanzada.fantasia"),
    t("busquedaAvanzada.terror"),
    t("busquedaAvanzada.romance"),
    t("busquedaAvanzada.aventura"),
    t("busquedaAvanzada.misterio"),
    t("busquedaAvanzada.historico"),
    t("busquedaAvanzada.biografico"),
    t("busquedaAvanzada.policiaco"),
    t("busquedaAvanzada.drama"),
    t("busquedaAvanzada.comedia"),
    t("busquedaAvanzada.accion"),
    t("busquedaAvanzada.suspense"),
    t("busquedaAvanzada.otra"),
  ]);
  
  const formats = computed(() => [
    t("busquedaAvanzada.tapaDura"),
    t("busquedaAvanzada.tapaBlanda"),
    t("busquedaAvanzada.bolsillo"),
    "Box Set",
    t("busquedaAvanzada.otro"),
  ]);
  
  const handleSearch = async () => {
    try {
      const response = await editionStore.getEditionsFiltered(
        searchQuery.value.title,
        searchQuery.value.author,
        searchQuery.value.genre,
        searchQuery.value.year,
        searchQuery.value.format,
        searchQuery.value.editorial
      );
  
      filteredEditions.value = response.data;
  
      nextTick(() => {
        const resultSection = document.querySelector('.filtered-editions');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    } catch (error) {
      console.error("Error fetching filtered editions:", error);
    }
  };
  </script>
  
  <style scoped>
  .header-skip {
    height: 40px;
  }
  
  .search-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 30%;
    height: 100%;
    margin: auto;
    padding: 20px;
    background: #ecf0f1;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  .search-title {
    text-align: center;
    margin-bottom: 20px;
    color: #2c3e50;
    font-size: 1.8rem;
  }
  
  .search-form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    font-weight: bold;
    margin-bottom: 5px;
    color: #34495e;
  }
  
  input,
  select {
    width: 100%;
    padding: 10px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  .price-range {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  
  .price-range input {
    width: 45%;
  }
  
  .search-btn {
    width: 100%;
    padding: 10px;
    background: #2c3e50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  .search-btn:hover {
    background: #1a252f;
  }
  
  @media (max-width: 768px) {
    .search-container {
      width: 50%;
      padding: 15px;
    }
  }
  
  /* 🌙 Soporte para modo oscuro */
  html[data-theme="dark"] .search-container {
    background: var(--color-background-soft);
    color: var(--color-text);
  }
  
  html[data-theme="dark"] .search-title {
    color: var(--color-heading);
  }
  
  html[data-theme="dark"] label {
    color: var(--color-text);
  }
  
  html[data-theme="dark"] input,
  html[data-theme="dark"] select {
    background-color: #1f1f1f;
    color: white;
    border: 1px solid #555;
  }
  
  html[data-theme="dark"] .search-btn {
    background: #2980b9;
    color: white;
  }
  
  html[data-theme="dark"] .search-btn:hover {
    background: #1f6399;
  }
  .filtered-editions {
    margin-top: 20px;
    max-height: 500px;
    overflow-y: auto;
    width: 50%;
    margin: 0 auto;
    padding: 10px;
    display: flex;
    flex-direction: column;
  }
  
  .edition-item {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 4px 10px;
    margin-bottom:5px;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    background: #fff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.2s ease;
    font-size: 0.9rem;
  }
  
  .edition-item:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  .edition-image {
    width: 30px;
    height: 40px;
    object-fit: cover;
    border-radius: 5px;
    margin-right: 15px;
  }
  
  .edition-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .edition-details h4 {
    font-size: 0.85rem;
    margin: 0;
    color: #2c3e50;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .edition-details p {
    font-size: 0.85rem;
    margin: 2px 0;
    color: #7f8c8d;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .edition-details .year {
    font-weight: bold;
    color: #2980b9;
  }
  
  .edition-details .info-container {
    display: flex;
    justify-content: flex-start;
    gap: 10px; /* Spacing between the fields */
  }
  
  .edition-details .info-container p {
    font-size: 0.85rem;
    margin: 0;
    color: #7f8c8d;
  }
  
  @media (max-width: 768px) {
    .filtered-editions {
      max-height: 300px;
    }
  
    .edition-item {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  
    .edition-image {
      margin-right: 10px;
    }
  
    .edition-details h4 {
      font-size: 0.9rem;
    }
  
    .edition-details p {
      font-size: 0.8rem;
    }
  }
  
  /* 🌙 Soporte para modo oscuro */
  html[data-theme="dark"] .filtered-editions {
    background: var(--color-background-soft);
    color: var(--color-text);
  }
  
  html[data-theme="dark"] .edition-item {
    background: #333;
    border-color: #555;
  }
  
  html[data-theme="dark"] .edition-details h4 {
    color: var(--color-heading);
  }
  
  html[data-theme="dark"] .edition-details p {
    color: #bdc3c7;
  }
  
  html[data-theme="dark"] .edition-details .year {
    color: #2980b9;
  }
  </style>
  