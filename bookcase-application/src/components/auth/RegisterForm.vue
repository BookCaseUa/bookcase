<template>
  <form @submit.prevent="handleRegister">
    <!-- Nombre -->
    <div class="input-container">
      <font-awesome-icon icon="user" />
      <input
        type="text"
        v-model="name"
        :placeholder="$t('auth.nombreUsuario')"
        required
      />
    </div>

    <!-- Email -->
    <div class="input-container" :class="{ error: emailTouched && emailError }">
      <font-awesome-icon icon="envelope" />
      <input
        type="email"
        v-model="email"
        :placeholder="$t('auth.correo')"
        required
        @blur="validateEmail"
      />
    </div>

    <!-- Contraseña -->
    <div
      class="input-container"
      :class="{ error: passwordTouched && !isPasswordValid }"
    >
      <font-awesome-icon icon="lock" />
      <input
        :type="showPassword ? 'text' : 'password'"
        v-model="password"
        @blur="passwordTouched = true"
        :placeholder="$t('auth.contraseña')"
        required
        title="Debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número"
      />
      <font-awesome-icon
        :icon="showPassword ? 'eye-slash' : 'eye'"
        class="toggle-icon"
        @click="togglePassword"
      />
    </div>

    <!-- Confirmar contraseña -->
    <div
      class="input-container"
      :class="{ error: confirmTouched && !passwordsMatch }"
    >
      <font-awesome-icon icon="lock" />
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        v-model="confirmPassword"
        @blur="confirmTouched = true"
        :placeholder="$t('auth.confirmarContraseña')"
        required
      />
      <font-awesome-icon
        :icon="showConfirmPassword ? 'eye-slash' : 'eye'"
        class="toggle-icon"
        @click="toggleConfirmPassword"
      />
    </div>

    <!-- Error general -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

    <!-- Error de email -->
    <p v-if="emailTouched && emailError" class="error-message">
      {{ emailError }}
    </p>

    <!-- Botón -->
    <button type="submit">{{ $t("auth.registrarse") }}</button>
  </form>
</template>

<script setup>
import { ref, computed } from "vue";
import { useUserStore } from "@/stores/user_store";
import { useUserListStore } from "@/stores/user_list_store";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const store = useUserStore();
const userListStore = useUserListStore();
const router = useRouter();
const { t } = useI18n();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const emailError = ref("");

// Mostrar/Ocultar contraseña
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const togglePassword = () => (showPassword.value = !showPassword.value);
const toggleConfirmPassword = () =>
  (showConfirmPassword.value = !showConfirmPassword.value);

// Validación visual
const passwordTouched = ref(false);
const confirmTouched = ref(false);
const emailTouched = ref(false);

const isPasswordValid = computed(() =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password.value)
);

const passwordsMatch = computed(() => password.value === confirmPassword.value);

async function validateEmail() {
  emailTouched.value = true;
  emailError.value = "";

  if (email.value.trim() === "") {
    emailError.value = t("auth.correoObligatorio");
    return;
  }

  const result = await userListStore.getUsers();
  const emailInUse = result.data.find((user) => user.email === email.value);

  if (emailInUse) {
    emailError.value = t("auth.correoExiste");
  }
}

async function handleRegister() {
  if (emailError.value) {
    errorMessage.value = t("auth.correoErroneo");
    return;
  }

  if (!isPasswordValid.value) {
    errorMessage.value = t("auth.contraseñaRequisitos");
    return;
  }

  if (!passwordsMatch.value) {
    errorMessage.value = t("auth.contraseñasNoCoinciden");
    return;
  }

  try {
    await store.register(email.value, password.value, name.value);

    if (store.logged) {
      router.push("/");
    } else {
      throw new Error(t("auth.errorCorreoExiste"));
    }
  } catch (error) {
    console.error(error);
    errorMessage.value = error.message || t("auth.error");
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
  color: var(--color-text);
  transition: border 0.2s, box-shadow 0.2s, background-color 0.3s ease;
}

.input-container input {
  border: none;
  outline: none;
  flex-grow: 1;
  padding-left: 10px;
  background: transparent;
  color: var(--color-text);
}

.input-container:focus-within {
  border-color: var(--color-heading);
  box-shadow: 0 0 8px rgba(66, 184, 131, 0.3);
}

.input-container.error {
  border: 1px solid #e74c3c;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.5);
}

.toggle-icon {
  cursor: pointer;
  margin-left: 10px;
  color: #2c3e50;
}

.toggle-icon:hover {
  color: #2c3e90;
}

button {
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  background-color: #2c3e50;
  color: white;
  border: none;
  font-weight: bold;
  transition: background-color 0.3s, box-shadow 0.3s;
}

button:hover {
  background-color: #2c3e90;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.error-message {
  color: #e74c3c;
  font-weight: bold;
  margin-top: 5px;
  text-align: center;
}
</style>
