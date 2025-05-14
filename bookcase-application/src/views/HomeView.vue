<template>
  <div>
    <v-container>
      <v-row justify="center" class="mt-4">
        <v-col cols="12" md="8" lg="8">
          <Busqueda @buscar="manejarBusqueda" />
        </v-col>
      </v-row>
    </v-container>

    <!-- ✅ Mostrar contenido original solo si no hay búsqueda activa -->
    <div v-if="!busquedaActiva">
      <Anuncios />
      <NovedadesResumen />
      <hr class="separador" />
      <LibrosMasVendidos />
      <hr class="separador" />
      <ListaLibros />
    </div>

    <!-- 🧑‍🦱 Resultados usuarios -->
    <v-container
      v-if="
        modoBusqueda.toLowerCase() === 'usuarios' && usuariosFiltrados.length && busquedaActiva
      "
    >
      <v-row justify="center">
        <v-col
          v-for="usuario in paginacionUsuarios"
          :key="usuario.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card class="usuario-card">
            <div class="usuario-avatar-wrapper">
              <img
                :src="
                  usuario.data.profile_photo || require('@/assets/account.png')
                "
                :alt="$t('home.fotoPerfil')"
                class="usuario-avatar"
              />
            </div>
            <v-card-title>
              <div class="usuario-info">
                <h3 class="nickname">{{ usuario.data.nickname }}</h3>
                <p class="email">{{ usuario.data.email }}</p>
                <p class="ventas">
                  {{ $t("home.ventas") }}: {{ usuario.data.ventas }}
                </p>
                <p class="compras">
                  {{ $t("home.compras") }}: {{ usuario.data.compras }}
                </p>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn text color="primary" @click="verPerfil(usuario)">{{
                $t("home.verPerfil")
              }}</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-pagination
        class="pagination"
        v-model="paginaActual"
        :length="numPaginasUsuarios"
        @input="actualizarPaginacionUsuarios"
      />
    </v-container>

    <div
      v-if="
        modoBusqueda.toLowerCase() === 'usuarios' &&
        usuariosFiltrados.length === 0
      "
    >
      <p class="no-results">{{ $t("home.noUsuarios") }}</p>
    </div>

    <!-- 📚 Resultados libros -->
    <v-container
      v-if="
        busquedaActiva &&
        modoBusqueda.toLowerCase() === 'libros' &&
        librosFiltrados.length
      "
    >
      <v-row justify="center">
        <v-col
          v-for="edicion in paginacionLibros"
          :key="edicion.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <div class="card-wrapper" @click="goToEdition(edicion.id)">
            <img
              :src="edicion.data.image || 'https://placehold.co/400x600'"
              class="cover-image"
            />
            <div class="hover-info">
              <strong>{{ edicion.data.book_title || 'Sin título' }}</strong><br />
              <span>{{ obtenerLibroPorId(edicion.data.book_id)?.author || $t("home.autorDesconocido") }}</span><br />
              <span>{{ edicion.data.editorial || $t("wishlist.editorialDesconocida") }}</span><br />
              <span>{{ $t(`wishlist.tipos.${edicion.data.type || 'Otro'}`) }}</span><br />
              <span>{{ $t("home.publicado") }}: {{ obtenerLibroPorId(edicion.data.book_id)?.primera_publicacion || $t("wishlist.añoDesconocido") }}</span>
            </div>
          </div>
        </v-col>
      </v-row>

      <v-pagination
        class="pagination-libro"
        v-model="paginaActual"
        :length="numPaginasLibros"
        @input="actualizarPaginacionLibros"
      />
    </v-container>

    <!-- ❌ No se encontraron libros -->
    <div
      v-if="
        buscandoLibros &&
        modoBusqueda.toLowerCase() === 'libros' &&
        librosFiltrados.length === 0
      "
    >
      <p class="no-results">{{ $t("home.noLibros") }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Busqueda from "@/components/Busqueda.vue";
import Anuncios from "@/components/anuncios.vue";
import NovedadesResumen from "@/components/NovedadesResumen.vue";
import ListaLibros from "@/components/listaLibros2.vue";
import LibrosMasVendidos from "@/components/listaLibrosHome.vue";
import { useUserListStore } from "@/stores/user_list_store";
import { useEditionStore } from "@/stores/edition_store";
import { useRouter } from "vue-router";
import { useUserStore } from "@/stores/user_store";
import { useBookStore } from "@/stores/book_store";
import { useI18n } from "vue-i18n";

const store = useUserListStore();
const editionStore = useEditionStore();
const userStore = useUserStore();
const router = useRouter();
const bookStore = useBookStore();
const { t } = useI18n();
const modoBusqueda = ref("Libros");
const textoBusqueda = ref("");
const paginaActual = ref(1);
const resultadosPorPagina = 8;

// Variables de estado para los resultados de la búsqueda
const usuariosFiltrados = ref([]);
const librosFiltrados = ref([]);

// Paginación
const numPaginasUsuarios = computed(() =>
  Math.ceil(usuariosFiltrados.value.length / resultadosPorPagina)
);
const numPaginasLibros = computed(() =>
  Math.ceil(librosFiltrados.value.length / resultadosPorPagina)
);

const manejarBusqueda = ({ opcion, texto }) => {
  modoBusqueda.value = opcion;
  textoBusqueda.value = texto;
  paginaActual.value = 1;
  filtrarResultados();
};
const obtenerLibroPorId = (bookId) => {
  return bookStore.books.find((b) => b.id === bookId)?.data || null;
};
// Filtrado de usuarios y libros
const filtrarResultados = () => {
  const texto = textoBusqueda.value.toLowerCase().trim();
  const modo = modoBusqueda.value.toLowerCase();

  if (modo === "usuarios") {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!texto) {
      // Cuando no hay texto, mostrar todos los usuarios permitidos
      usuariosFiltrados.value = store.users.filter((u) => {
        const esAdmin = u.data?.type === "admin";
        const esElMismo = u.id === userStore.id;
        return !esAdmin || esElMismo;
      });
      return;
    }

    usuariosFiltrados.value = store.users
      .filter((u) =>
        regexEmail.test(texto)
          ? u.data.email.toLowerCase().includes(texto)
          : u.data.nickname.toLowerCase().includes(texto)
      )
      .filter((u) => {
        const esAdmin = u.data?.type === "admin";
        const esElMismo = u.id === userStore.id;
        return !esAdmin || esElMismo;
      });
  } else if (modo === "libros") {
    if (!texto) {
      // Cuando no hay texto, mostrar todos los libros
      librosFiltrados.value = editionStore.editions;
      return;
    }

    librosFiltrados.value = editionStore.editions.filter(
      (ed) =>
        ed.data.book_title?.toLowerCase().includes(texto) ||
        ed.data.author?.toLowerCase().includes(texto)
    );
  }
};

// Paginación de usuarios
const paginacionUsuarios = computed(() => {
  const start = (paginaActual.value - 1) * resultadosPorPagina;
  return usuariosFiltrados.value.slice(start, start + resultadosPorPagina);
});

// Paginación de libros
const paginacionLibros = computed(() => {
  const start = (paginaActual.value - 1) * resultadosPorPagina;
  return librosFiltrados.value.slice(start, start + resultadosPorPagina);
});

// Función para actualizar la paginación de usuarios
const actualizarPaginacionUsuarios = (pagina) => {
  paginaActual.value = pagina;
};

// Función para actualizar la paginación de libros
const actualizarPaginacionLibros = (pagina) => {
  paginaActual.value = pagina;
};

const busquedaActiva = computed(() => textoBusqueda.value.length > 0);

const goToEdition = (editionId) => {
  const ed = editionStore.editions.find((e) => e.id === editionId);
  if (!ed) {
    alert(t("home.libroSinEdicion"));
    return;
  }
  router.push(`/infoEdicion/${editionId}`);
};

const verPerfil = (usuario) => {
  if (!usuario?.id) return;
  router.push(`/perfil/${usuario.id}`);
};

onMounted(async () => {
  await store.fetchUsers();
  await editionStore.fetchEditions();
  bookStore.fetchBooks()
  filtrarResultados(); // Cargar los resultados inicialmente
});
</script>

<style scoped>
.busqueda-wrapper {
  margin-top: 5%;
  display: flex;
  justify-content: center;
  padding: 16px;
  background-color: var(--color-background);
}

.v-col {
  display: flex;
  align-items: center;
}

.usuario-card {
  width: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease, color 0.3s ease;
  margin-top: 5%;
  color: var(--color-text);
}

.usuario-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.usuario-avatar {
  border-radius: 50%;
}

.usuario-info h3 {
  color: var(--color-heading);
}

.nickname {
  text-align: center;
  margin-bottom: 5%;
}

.email {
  font-size: 14px;
  font-weight: bold;
}

.ventas,
.compras {
  font-size: 12px;
}

.v-card-actions {
  display: flex;
  justify-content: flex-end;
}

.foto-perfil {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.no-results {
  text-align: center;
  font-size: medium;
  margin-top: 10%;
  color: var(--color-text);
}

.pagination {
  margin-top: 2%;
}

/* 🎯 Card de libro */
.libro-card {
  width: auto;
  border-radius: 10px;
  background-color: var(--color-background); /* ⭐ Fondo adaptable */
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease, color 0.3s ease;
  margin-top: 5%;
  color: var(--color-text); /* ⭐ Color del texto adaptable */
  display: flex;
  flex-direction: column;
  height: auto;
}

.libro-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.libro-info {
  padding: 12px 16px;
  background-color: var(--color-background-soft); /* ⭐ Fondo suave */
  color: var(--color-text);
}

.libro-info h3 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
  font-size: 1.2rem;
  color: var(--color-heading); /* ⭐ Títulos adaptados */
  margin-bottom: 4px;
}

.libro-info p {
  font-size: 1rem;
  margin: 2px 0;
  color: var(--color-text);
}

.v-card-actions {
  padding: 8px 16px;
  justify-content: flex-end;
}

.usuario-avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.usuario-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-border);
}

.separador {
  border: none;
  height: 2px;
  background-color: #ddd;
  margin: 40px auto;
  width: 80%;
}

.hoverable-card {
  margin-bottom: 0;
  height: 370px;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: transform 0.3s ease, box-shadow 0.3s ease,
    background-color 0.3s ease, color 0.3s ease;
}

.hoverable-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.clickable-card {
  cursor: pointer;
}

.uniform-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.contenedor-imagen {
  width: 100%;
  aspect-ratio: 2/3.5 !important;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.imagen-expandida {
  width: 100%;
  height: 100%;
  object-position: top;
  object-fit: cover;
}

.card-wrapper {
  width: 220px;
  height: 330px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease;
  margin: 0 auto;
}

.card-wrapper:hover {
  transform: scale(1.05);
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  border-radius: 12px;
}

.hover-info {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 0.85rem;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-wrapper:hover .hover-info {
  opacity: 1;
}

</style>
