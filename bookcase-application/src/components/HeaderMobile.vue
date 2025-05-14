<template>
    <nav class="navbar-mobile">
      <div class="top-bar">
        <template v-if="store.logged">
          <button @click="$emit('toggle-sidebar')" class="menu-button">
            <font-awesome-icon icon="bars" />
          </button>
        </template>
  
        <router-link to="/" class="title-link">BookCase</router-link>
  
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :title="$t('header.cambiarTema')"
        >
          <span v-if="isDark">🌙</span>
          <span v-else>☀️</span>
        </button>
  
        <CambiarIdioma class="idioma" />
        <button class="menu-toggle" @click="toggleMenu">
            <font-awesome-icon :icon="showMenu ? 'times' : 'ellipsis-v'" />
        </button>
      </div>
  
      <transition name="slide">
        <ul v-if="showMenu" class="mobile-menu">
          <template v-if="store.logged">
            <li class="user-info">
              <span>{{ $t("header.hola") }}, {{ store.nickname }}</span>
              <img :src="store.profile_photo" alt="Perfil" class="profile-pic" />
            </li>
            <li>
              <router-link :to="`/perfil/${store.id}`" @click="toggleMenu">
                <v-icon>mdi-account</v-icon> {{ $t("header.perfil") }}
              </router-link>
            </li>
            <li>
              <router-link to="/carrito" @click="toggleMenu">
                <v-icon size="20">mdi-cart-outline</v-icon>
                <span>{{ $t("header.carrito") }}</span>
                <v-badge v-if="carritoSeguro > 0" :content="carritoSeguro" color="error" />
              </router-link>
            </li>
            <li>
              <button @click="handleLogout">
                <font-awesome-icon icon="right-from-bracket" />
                {{ $t("header.cerrarSesion") }}
              </button>
            </li>
          </template>
          <template v-else>
            <li>
              <router-link to="/login" @click="toggleMenu">{{
                $t("header.iniciarSesion")
              }}</router-link>
            </li>
            <li>
              <router-link to="/register" @click="toggleMenu">{{
                $t("header.registro")
              }}</router-link>
            </li>
          </template>
        </ul>
      </transition>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from "vue";
  import { useUserStore } from "@/stores/user_store";
  import { useCartStore } from "@/stores/cart_store";
  import { useRouter } from "vue-router";
  import CambiarIdioma from "@/components/CambiarIdioma.vue";
  
  const store = useUserStore();
  const cartStore = useCartStore();
  const router = useRouter();
  
  const showMenu = ref(false);
  const isDark = ref(false);
  
  onMounted(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      isDark.value = true;
      document.documentElement.setAttribute("data-theme", "dark");
    }
  });
  
  const carritoSeguro = computed(() => {
    if (!Array.isArray(cartStore.cart)) return 0;
    const unicos = [...new Set(cartStore.cart)];
    return unicos.filter(Boolean).length;
  });
  
  function toggleTheme() {
    isDark.value = !isDark.value;
    const newTheme = isDark.value ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }
  
  function toggleMenu() {
    showMenu.value = !showMenu.value;
  }
  
  function handleLogout() {
    store.logout();
    router.push("/");
  }
  </script>
  
  <style scoped>
  .navbar-mobile {
    width: 100vw;
    background: #2c3e50;
    color: white;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
    border-bottom: 1px solid #444;
  }
  
  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
  }
  
  .title-link {
    font-size: 1.5rem;
    font-family: serif;
    font-weight: bold;
    color: white;
    text-decoration: none;
    flex-grow: 1;
    text-align: center;
  }
  
  .menu-button,
  .theme-toggle,
  .menu-toggle {
    background: none;
    border: none;
    font-size: 1.4rem;
    color: white;
    cursor: pointer;
    margin: 0 6px;
  }
  
  .idioma {
    margin-left: 6px;
  }
  
  .mobile-menu {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #2c3e50;
    border-top: 1px solid #444;
  }
  
  .mobile-menu li {
    padding: 10px;
    border-bottom: 1px solid #444;
  }
  
  .mobile-menu a,
  .mobile-menu button {
    color: white;
    text-decoration: none;
    font-size: 1rem;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    text-align: left;
  }
  
  .mobile-menu a:hover,
  .mobile-menu button:hover {
    background-color: #34495e;
    border-radius: 6px;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .profile-pic {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }
  
  .slide-enter-active,
  .slide-leave-active {
    transition: all 0.3s ease;
  }
  .slide-enter-from,
  .slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
  }
  </style>
  