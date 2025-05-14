<template>
  <form @submit.prevent="handleLogin">
    <div class="input-container">
      <font-awesome-icon icon="envelope" />
      <input
        type="email"
        v-model="email"
        :placeholder="$t('auth.correo')"
        required
      />
    </div>

    <div class="input-container">
      <font-awesome-icon icon="lock" />
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        :placeholder="$t('auth.contraseña')"
        required
      />
      <button
        type="button"
        class="toggle-password"
        @click="showPassword = !showPassword"
      >
        <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
      </button>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <button type="submit">{{ $t("auth.iniciarSesion") }}</button>

    <p class="forgot-password" @click="showRecoveryModal = true">
      {{ $t("auth.olvidoContraseña") }}
    </p>

    <!-- Modal de recuperación de contraseña -->
    <div v-if="showRecoveryModal" class="modal">
      <div class="modal-content">
        <h3>{{ $t("auth.recuperarTitulo") }}</h3>
        <input
          type="email"
          v-model="recoveryEmail"
          :placeholder="$t('auth.introduceCorreo')"
          required
        />

        <div class="modal-buttons">
          <button @click="handlePasswordRecovery">
            {{ $t("auth.enviar") }}
          </button>
          <button class="close-btn" @click="showRecoveryModal = false">
            {{ $t("auth.cerrar") }}
          </button>
        </div>

        <p
          v-if="recoveryMessage"
          :class="recoverySuccess ? 'success-message' : 'error-message'"
        >
          {{ recoveryMessage }}
        </p>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user_store";
import { useRouter } from "vue-router";

const store = useUserStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
const errorMessage = ref("");
const showRecoveryModal = ref(false);
const recoveryEmail = ref("");
const recoveryMessage = ref("");
const recoverySuccess = ref(false);

async function handleLogin() {
  errorMessage.value = "";

  try {
    await store.login(email.value, password.value);

    if (store.logged) {
      router.push("/");
    } else {
      errorMessage.value = "Correo o contraseña incorrectos.";
    }
  } catch (error) {
    console.error("Error en login:", error);
    errorMessage.value =
      "Error al iniciar sesión. Inténtalo de nuevo más tarde.";
  }
}

async function handlePasswordRecovery() {
  const result = await store.recoverPassword(recoveryEmail.value);

  recoveryMessage.value = result.message;
  recoverySuccess.value = result.result === "SUCCESS";

  if (recoverySuccess.value) {
    setTimeout(() => {
      showRecoveryModal.value = false;
      recoveryMessage.value = "";
      router.push("/login");
    }, 3000);
  }
}
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px 12px;
  position: relative;
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease,
    border-color 0.3s ease;
}

.input-container input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding-left: 10px;
  background: transparent;
  color: var(--color-text);
}

.toggle-password {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #2c3e50;
  cursor: pointer;
}

.toggle-password:hover {
  color: #2c3e90;
}

.input-container:focus-within {
  border-color: #2c3e50;
  box-shadow: 0 0 8px rgba(66, 184, 131, 0.3);
}

button[type="submit"] {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #2c3e50;
  color: white;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
}

button[type="submit"]:hover {
  background-color: #2c3e90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.forgot-password {
  text-align: center;
  color: var(--color-heading);
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: var(--color-background);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.modal-content h3 {
  margin-bottom: 15px;
}

.modal-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  color: var(--color-text);
}

/* Agrupación horizontal de botones */
.modal-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
}

.modal-buttons button {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  border: none;
  transition: background-color 0.3s ease;
}

.modal-buttons button:first-child {
  background-color: var(--color-heading);
  color: var(--color-background);
}

.modal-buttons button:first-child:hover {
  background-color: var(--color-heading);
}

.modal-buttons .close-btn {
  background: #e74c3c;
  color: white;
}

.modal-buttons .close-btn:hover {
  background: #c0392b;
}

.close-btn {
  background: #e74c3c !important;
  color: white;
}

.close-btn:hover {
  background: #c0392b !important;
}

.success-message {
  color: green;
  font-weight: bold;
  margin-top: 10px;
}

.error-message {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
</style>
