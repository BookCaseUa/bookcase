<script setup>
import { ref, onMounted, provide } from "vue";
import { RouterView } from "vue-router";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import Sidebar from "./components/Sidebar.vue";



const drawer = ref(false);
const toggleDrawer = () => {
  drawer.value = !drawer.value;
};

const warningEditions = ref([]);
provide('warningEditions', warningEditions);
function handleWarning(editions) {
  warningEditions.value = editions;
}

onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }
});

</script>

<template>
  <v-app>
    <Header @toggle-sidebar="toggleDrawer" />
    <Sidebar v-model:drawer="drawer" />
    <v-main>
      <div class="router-container">
        <RouterView />
      </div>
    </v-main>
    <Footer />
  </v-app>
</template>

<style>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.v-application {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.v-main {
  display: flex;
  flex-direction: column;
  min-height: 0;
  background-color: var(--color-background);
  color: var(--color-text);
}

/* Elimina el margen inferior innecesario */
.router-container {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 4%;
  margin-bottom: 0; /* o prueba con 1rem si quieres un pequeño espacio */
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* Solo para móviles */
@media (max-width: 768px) {
  .router-container {
    padding-top: 30px; /* mismo alto que el HeaderMobile */
  }
}

</style>