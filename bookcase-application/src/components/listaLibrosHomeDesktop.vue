<template>
    <div class="container-lista">
      <!-- Maximo 4-->
      <h1 class="title-1">{{ $t("home.descubreMasVendidos") }}</h1>
      <div class="separacion-libros">
        <!-- Podio -->
  
        <div class="podio">
          <div class="puesto puesto-2">
            <div class="ranking-tag" :class="getRankClass(1)">2</div>
            <img :src="top3[1]?.data.image" alt="imagen" class="img-libro" />
            <h2>{{ top3[1]?.data.book_title }}</h2>
            <p class="autor">{{ getAuthorByBookId(top3[1]?.data.book_id) }}</p>
            <p class="editorial">{{ top3[1]?.data.editorial }}</p>
            <router-link :to="'/infoEdicion/' + top3[1]?.id">
              <button class="ver">{{ $t("home.verMas") }}</button>
            </router-link>
          </div>
  
          <div class="puesto puesto-1">
            <div class="ranking-tag" :class="getRankClass(0)">1</div>
            <img :src="top3[0]?.data.image" alt="imagen" class="img-libro" />
            <h2>{{ top3[0]?.data.book_title }}</h2>
            <p class="autor">{{ getAuthorByBookId(top3[0]?.data.book_id) }}</p>
            <p class="editorial">{{ top3[0]?.data.editorial }}</p>
            <router-link :to="'/infoEdicion/' + top3[0]?.id">
              <button class="ver">{{ $t("home.verMas") }}</button>
            </router-link>
          </div>
  
          <div class="puesto puesto-3">
            <div class="ranking-tag" :class="getRankClass(2)">3</div>
            <img :src="top3[2]?.data.image" alt="imagen" class="img-libro" />
            <h2>{{ top3[2]?.data.book_title }}</h2>
            <p class="autor">{{ getAuthorByBookId(top3[2]?.data.book_id) }}</p>
            <p class="editorial">{{ top3[2]?.data.editorial }}</p>
            <router-link :to="'/infoEdicion/' + top3[2]?.id">
              <button class="ver">{{ $t("home.verMas") }}</button>
            </router-link>
          </div>
        </div>
  
  
        <div v-if="bestSellers.length === 0" class="no-resultados">
          <p>{{ $t("home.sinResultadosPara") }} "{{ query }}".</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, computed } from "vue";
  import { useRoute } from "vue-router";
  import { useEditionStore } from "@/stores/edition_store";
  import { useBookStore } from "@/stores/book_store";
  
  const route = useRoute();
  const bookStore = useBookStore();
  const editionStore = useEditionStore();
  
  const top3 = computed(() => bestSellers.value.slice(0, 3));
  const resto = computed(() => bestSellers.value.slice(3));
  
  onMounted(async () => {
    await editionStore.fetchEditions();
    await bookStore.fetchBooks();
  });
  
  const getAuthorByBookId = (bookId) => {
    const book = bookStore.books.find((b) => b.id === bookId);
    return book?.data?.author || "Autor desconocido";
  };
  
  const bestSellers = computed(() => {
    return [...editionStore.editions]
      .sort((a, b) => b.ventas_totales - a.ventas_totales)
      .slice(0, 10);
  });
  
  const getRankClass = (index) => {
    if (index === 0) return "gold";
    if (index === 1) return "silver";
    if (index === 2) return "bronze";
    return "";
  };
  
  const getCardStyle = (index) => {
    const total = resto.value.length;
    if (total <= 1) return {};
  
    const ratio = index / (total - 1);
    const r = Math.round(255 - (255 - 44) * ratio);
    const g = Math.round(255 - (255 - 62) * ratio);
    const b = Math.round(255 - (255 - 80) * ratio);
  
    const isDarkMode = document.documentElement.classList.contains("dark");
    const background = isDarkMode ? "rgb(30,30,30)" : `rgb(${r}, ${g}, ${b})`;
  
    return {
      backgroundColor: background,
      color: isDarkMode ? "white" : "#1a1a1a",
      "--autor-color": isDarkMode ? "rgba(255,255,255,0.85)" : "#444",
      "--editorial-color": isDarkMode ? "rgba(255,255,255,0.7)" : "#666",
      "--btn-color": isDarkMode ? "white" : "#3498db",
      "--btn-bg": isDarkMode ? "#3498db" : "transparent",
      "--btn-border": "#3498db",
      "--btn-hover-bg": isDarkMode ? "white" : "#3498db",
      "--btn-hover-color": isDarkMode ? "#3498db" : "white",
    };
  };
  </script>
  
  <style scoped>
  .title-1 {
    color: var(--color-heading);
    margin-bottom: 4%;
    transition: color 0.3s ease;
  }
  
  .container-libro.gold {
    border: 4px solid rgb(198, 176, 49);
  }
  
  .container-libro.silver {
    border: 4px solid silver;
  }
  
  .container-libro.bronze {
    border: 4px solid #cd7f32;
    /* Bronce */
  }
  
  .container-libro.gold .ranking-tag {
    border-color: rgb(198, 176, 49);
    color: #ffffff;
    background-color: rgb(198, 176, 49);
  }
  
  .container-libro.silver .ranking-tag {
    border-color: silver;
    color: #ffffff;
    background-color: silver;
  }
  
  .container-libro.bronze .ranking-tag {
    border-color: #cd7f32;
    color: #ffffff;
    background-color: #cd7f32;
  }
  
  /* 
  .ranking-tag {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #ccc;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid transparent;
    z-index: 1;
    color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    line-height: 1;
    /* 👈 importante para evitar alargamiento vertical 
    padding: 0;
    /* 👈 sin padding que rompa la forma 
  } */
  
  .container-libro h2 {
    font-size: 18px;
    font-weight: 600;
    line-height: 1.3;
    text-align: center;
    margin: 12px 0 6px 0;
    color: inherit;
  }
  
  .container-libro p {
    font-size: 14px;
    line-height: 1.1;
    text-align: center;
    margin: 2px 0;
  }
  
  .container-lista {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    margin-top: 3%;
    background-color: transparent;
  }
  
  h1 {
    color: white;
  }
  
  ul {
    list-style: none;
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    padding: 0;
  }
  
  .container-libro {
    width: 280px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s ease;
  }
  
  .img-libro {
    width: 100%;
    height: 280px;
    object-fit: contain;
    border-radius: 6px;
  }
  
  .container-libro:hover {
    transform: translateY(-5px);
  }
  
  h1 {
    color: #2c3e50;
  }
  
  .ver {
    color: var(--btn-color);
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
  }
  
  .no-resultados {
    color: #2c3e50;
    margin-top: 40px;
    font-size: 16px;
  }
  
  .container-libro .autor {
    font-size: 15px;
    font-weight: 500;
    color: var(--autor-color);
    text-align: center;
  }
  
  .container-libro .editorial {
    font-size: 13px;
    font-weight: 400;
    color: var(--editorial-color);
    text-align: center;
  }
  
  .podio {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 20px;
    margin-bottom: 40px;
  }
  
  .puesto {
    width: 280px;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    text-align: center;
    position: relative;
    transition: transform 0.3s ease;
  }
  
  .puesto-1 {
    transform: translateY(-30px);
    background-color: #fffbe6;
    border: 3px solid gold;
  }
  
  .puesto-2 {
    transform: translateY(0px);
    background-color: #f8f8f8;
    border: 3px solid silver;
  }
  
  .puesto-3 {
    transform: translateY(10px);
    background-color: #fff8f0;
    border: 3px solid #cd7f32;
  }
  
  .puesto img {
    width: 100%;
    height: 260px;
    object-fit: contain;
    border-radius: 6px;
  }
  
  .puesto h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 10px 0 4px;
    color: #1a1a1a; /* Fuerza texto oscuro, adecuado para fondo claro */
  }
  
  .puesto .autor {
    font-size: 15px;
    font-weight: 500;
    color: #444;
  }
  
  .puesto .editorial {
    font-size: 13px;
    font-weight: 400;
    color: #666;
  }
  
  .ranking-tag {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #999;
    font-size: 16px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.4);
    color: white;
    z-index: 1;
  }
  
  /* Podio colores */
  .ranking-tag.gold {
    background-color: rgb(224, 193, 15);
  }
  
  .ranking-tag.silver {
    background-color: silver;
  }
  
  .ranking-tag.bronze {
    background-color: #cd7f32;
  }
  
  .subtitulo-secundario {
    font-size: 1.6rem;
    color: #2c3e50;
    margin-bottom: 20px;
    text-align: center;
  }
  
  .separacion-libros {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 30px;
  }
  
  .lista-libros {
    margin-top: 0.1%;
  }
  </style>
  