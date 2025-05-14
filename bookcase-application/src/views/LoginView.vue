<template>
  <div class="page-container">
    <div class="card">
      <h2>{{ $t("auth.loginTitulo") }}</h2>
      <LoginForm />

      <p class="switch-form">
        {{ $t("auth.noCuenta") }}
        <router-link to="/register">{{
          $t("auth.registrateAqui")
        }}</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import LoginForm from "@/components/auth/LoginForm.vue";
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
  background: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-radius: 12px;
  padding: 25px;
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
