<template>
  <div class="page-container">
    <div class="card">
      <h2>{{ $t("auth.registroTitulo") }}</h2>
      <RegisterForm />

      <p class="switch-form">
        {{ $t("auth.yaCuenta") }}
        <router-link to="/login">{{ $t("auth.iniciaSesion") }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import RegisterForm from "@/components/auth/RegisterForm.vue";
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 1rem;
  height: 100%;
}

.card {
  width: 100%;
  max-width: 400px;
  padding: 25px;
  background: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--color-heading);
}

.switch-form {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.switch-form a {
  color: var(--color-heading);
  text-decoration: none;
  font-weight: bold;
}

.switch-form a:hover {
  text-decoration: underline;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
