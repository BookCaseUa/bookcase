<template>
    <v-navigation-drawer
      :model-value="drawer"
      @update:model-value="$emit('update:drawer', $event)"
      app
      temporary
      color="#2c3e50"
      dark
    >
      <!-- Botón de cerrar -->
      <div class="close-button">
        <v-btn icon @click="$emit('update:drawer', false)" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
  
      <v-list dense class="custom-list">
        <v-list-item to="/" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-home</v-icon>
            <span>{{ $t("nav.inicio") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/AdvSearch" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-filter</v-icon>
            <span>{{ $t("nav.busquedaAvanzada") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/addOffer" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-plus</v-icon>
            <span>{{ $t("nav.anadirOferta") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/libros-deseados" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-bookshelf</v-icon>
            <span>{{ $t("nav.librosDeseados") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/mis-ofertas" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-tag</v-icon>
            <span>{{ $t("nav.ofertas") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/mis-pedidos" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-package-variant-closed</v-icon>
            <span>{{ $t("nav.pedidos") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/mis-ventas" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-cash</v-icon>
            <span>{{ $t("nav.ventas") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/mis-valoraciones" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-star</v-icon>
            <span>{{ $t("nav.valoraciones") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/mis-chats" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-chat</v-icon>
            <span>{{ $t("nav.chats") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item to="/carrito" link>
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-cart</v-icon>
            <span>{{ $t("nav.carrito") }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item
          to="/admin"
          v-if="userStore.email === 'admin@admin.com'"
          link
        >
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-tools</v-icon>
            <span>{{ $t("nav.admin") }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useUserStore } from "@/stores/user_store";
  
  const userStore = useUserStore();
  
  defineProps({
    drawer: Boolean,
  });
  
  defineEmits(["update:drawer"]);
  </script>
  
  <style scoped>
  .close-button {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px;
  }
  
  .custom-list .v-list-item {
    margin-bottom: 36px;
    padding: 8px 12px;
    border-radius: 8px;
    transition: background 0.2s ease;
  }
  
  .custom-list .v-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  </style>
  