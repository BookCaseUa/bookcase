<template>
  <nav class="navbar">
    <!-- Botón para abrir/cerrar sidebar -->
    <template v-if="store.logged">
      <button @click="$emit('toggle-sidebar')" class="menu-button">
        <font-awesome-icon icon="bars" />
      </button>
    </template>

    <CambiarIdioma class="cambiar-idioma" />

    <router-link to="/" class="title-link"> BookCase </router-link>

    <!-- 🌙 Botón Toggle de Tema -->
    <button
      @click="toggleTheme"
      class="theme-toggle"
      :title="$t('header.cambiarTema')"
    >
      <span v-if="isDark">🌙</span>
      <span v-else>☀️</span>
    </button>

    <ul class="nav-links">
      <template v-if="store.logged">
        <li class="user-menu" ref="menuRef">
          <div class="profile-trigger" @click="toggleMenu">
            <span class="user-name"
              >{{ $t("header.hola") }}, {{ store.nickname }}</span
            >
            <img :src="store.profile_photo" alt="Perfil" class="profile-pic" />
          </div>
          <ul :class="['dropdown-menu', { show: showMenu }]">
            <li>
              <router-link :to="`/perfil/${store.id}`">
                <v-icon>mdi-account</v-icon>
                {{ $t("header.perfil") }}
              </router-link>
            </li>
            <li class="dropdown-divider"></li>
            <li>
              <button @click="handleLogout">
                <font-awesome-icon
                  icon="right-from-bracket"
                  class="dropdown-icon"
                />
                {{ $t("header.cerrarSesion") }}
              </button>
            </li>
          </ul>
        </li>
        <!-- Icono carrito -->
        <li>
          <router-link to="/carrito" class="carrito-icon">
            <template v-if="carritoSeguro > 0">
              <v-badge :content="carritoSeguro" color="error" overlap>
                <v-icon size="28"> mdi-cart-outline</v-icon>
              </v-badge>
            </template>
            <template v-else>
              <v-icon size="28">mdi-cart-outline</v-icon>
            </template>
          </router-link>
        </li>
      </template>

      <template v-else>
        <li>
          <router-link to="/login">{{
            $t("header.iniciarSesion")
          }}</router-link>
        </li>
        <li>
          <router-link to="/register">{{ $t("header.registro") }}</router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watchEffect } from "vue";
import { useUserStore } from "@/stores/user_store";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart_store";
import CambiarIdioma from "@/components/CambiarIdioma.vue";

const store = useUserStore();
const router = useRouter();
const cartStore = useCartStore();

const showMenu = ref(false);
const menuRef = ref(null);

// 🌙 Modo oscuro
const isDark = ref(false);

onMounted(() => {
  // Tema al cargar
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    isDark.value = true;
    document.documentElement.setAttribute("data-theme", "dark");
  }

  // Eventos para cerrar menú
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("mousemove", handleMouseMove);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("mousemove", handleMouseMove);
});

function toggleTheme() {
  isDark.value = !isDark.value;
  const newTheme = isDark.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
}

// Toggle de menú usuario
function toggleMenu() {
  showMenu.value = !showMenu.value;
}

// Ver carrito en consola
watchEffect(() => {
  console.log("[DEBUG] Contenido del carrito:", cartStore.cart);
});

// Calcular elementos únicos del carrito
const carritoSeguro = computed(() => {
  if (!Array.isArray(cartStore.cart)) return 0;
  const unicos = [...new Set(cartStore.cart)];
  return unicos.filter(Boolean).length;
});

// Detectar clic fuera del menú
function handleClickOutside(event) {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false;
  }
}

// Detectar alejamiento del cursor
function handleMouseMove(event) {
  if (!showMenu.value || !menuRef.value) return;

  const rect = menuRef.value.getBoundingClientRect();
  const buffer = 100;

  const outside =
    event.clientX < rect.left - buffer ||
    event.clientX > rect.right + buffer ||
    event.clientY < rect.top - buffer ||
    event.clientY > rect.bottom + buffer;

  if (outside) {
    showMenu.value = false;
  }
}

// Logout del usuario
function handleLogout() {
  store.logout();
  router.push("/");
}
</script>

<style scoped>
.menu-button {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 20px;
}

.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #2c3e50;
  color: white;
  padding: 20px;
  height: 80px;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
}

.title-link {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.8rem;
  font-family: serif;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  list-style: none;
  display: flex;
  gap: 20px;
  padding: 20px;
  margin-left: auto;
  margin-right: 20px;
}

.nav-links a,
.logout-btn {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  background: none;
  border: none;
  cursor: pointer;
}

.nav-links a:hover,
.logout-btn:hover {
  text-decoration: underline;
}

.user-name {
  font-weight: bold;
  color: #15dffa;
}

.logout-btn {
  font-weight: bold;
}

.profile-icon {
  font-size: 2.5rem;
  margin-right: 6px;
  vertical-align: middle;
  color: white;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.profile-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 6px;
}

.dropdown-menu {
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.2s ease;
  pointer-events: none;
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  list-style: none;
  padding: 0;
  margin: 0;
}

.user-menu:hover .dropdown-menu,
.dropdown-menu.show {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.dropdown-menu li {
  padding: 10px 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu a,
.dropdown-menu button {
  color: #2c3e50;
  /* Texto visible y elegante */
  text-decoration: none;
  border: none;
  background: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #f2f2f2;
}

.dropdown-icon {
  color: #2c3e50;
  font-size: 16px;
}

.dropdown-divider {
  border-top: 1px solid #e0e0e0;
  margin: 4px 0;
}

.profile-pic {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 8px;
}

.carrito-icon {
  color: white;
  display: flex;
  align-items: center;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-left: 20px; /* Cambiado de auto a un valor fijo */
}

/* 🌙 Adaptar menú desplegable al modo oscuro */
:root[data-theme="dark"] .dropdown-menu {
  background: #2c2c2c;
  color: white;
}

:root[data-theme="dark"] .dropdown-menu a,
:root[data-theme="dark"] .dropdown-menu button {
  color: white;
}

:root[data-theme="dark"] .dropdown-menu a:hover,
:root[data-theme="dark"] .dropdown-menu button:hover {
  background-color: #3a3a3a;
}

:root[data-theme="dark"] .dropdown-icon {
  color: white;
}

:root[data-theme="dark"] .dropdown-divider {
  border-top: 1px solid #444;
}
</style>
