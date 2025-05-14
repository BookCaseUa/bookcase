<template>
    <v-navigation-drawer
      :model-value="drawer"
      @update:model-value="$emit('update:drawer', $event)"
      temporary
      app
      location="left"
      color="#2c3e50"
      dark
    >
      <div class="close-button">
        <v-btn icon @click="$emit('update:drawer', false)" variant="text">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
  
      <v-list dense class="mobile-list">
        <v-list-item
          v-for="item in menuItems"
          :key="item.to"
          :to="item.to"
          link
          @click="$emit('update:drawer', false)"
        >
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">{{ item.icon }}</v-icon>
            <span>{{ $t(item.label) }}</span>
          </v-list-item-content>
        </v-list-item>
  
        <v-list-item
          v-if="userStore.email === 'admin@admin.com'"
          to="/admin"
          link
          @click="$emit('update:drawer', false)"
        >
          <v-list-item-content class="d-flex align-center">
            <v-icon class="me-2">mdi-tools</v-icon>
            <span>{{ $t('nav.admin') }}</span>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </template>
  
  <script setup>
  import { useUserStore } from "@/stores/user_store";
  
  const userStore = useUserStore();
  
  defineProps({ drawer: Boolean });
  defineEmits(["update:drawer"]);
  
  const menuItems = [
    { to: "/", label: "nav.inicio", icon: "mdi-home" },
    { to: "/AdvSearch", label: "nav.busquedaAvanzada", icon: "mdi-filter" },
    { to: "/addOffer", label: "nav.anadirOferta", icon: "mdi-plus" },
    { to: "/libros-deseados", label: "nav.librosDeseados", icon: "mdi-bookshelf" },
    { to: "/mis-ofertas", label: "nav.ofertas", icon: "mdi-tag" },
    { to: "/mis-pedidos", label: "nav.pedidos", icon: "mdi-package-variant-closed" },
    { to: "/mis-ventas", label: "nav.ventas", icon: "mdi-cash" },
    { to: "/mis-valoraciones", label: "nav.valoraciones", icon: "mdi-star" },
    { to: "/mis-chats", label: "nav.chats", icon: "mdi-chat" },
    { to: "/carrito", label: "nav.carrito", icon: "mdi-cart" },
  ];
  </script>
  
  <style scoped>
  .close-button {
    display: flex;
    justify-content: flex-end;
    padding: 8px 12px;
  }
  
  .mobile-list .v-list-item {
    padding: 10px 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }
  
  .mobile-list .v-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  </style>
  