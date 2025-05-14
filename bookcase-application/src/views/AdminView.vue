<template>
  <v-container class="admin-container" fluid>
    <h2 class="text-center mb-8 panel-admin">
      <v-icon>mdi-cog</v-icon>
      {{ $t("admin.panel") }}
    </h2>

    <v-row justify="center" align="stretch" dense>
      <v-col
        cols="12"
        sm="6"
        md="4"
        lg="4"
        v-for="(section, index) in adminSections"
        :key="index"
      >
        <v-card class="admin-card" @click="goTo(section.route)">
          <v-card-text class="text-center">
            <v-icon size="60" class="mb-3">{{ section.icon }}</v-icon>
            <h3>{{ section.title }}</h3>
            <p>{{ section.description }}</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const router = useRouter();
const { t } = useI18n();

const goTo = (route) => {
  router.push(route);
};

const adminSections = computed(() => [
  {
    title: t("admin.gestionarUsuarios"),
    description: t("admin.usuariosDescripcion"),
    icon: "mdi-account-group-outline",
    route: "/admin/users",
  },
  {
    title: t("admin.gestionarLibros"),
    description: t("admin.librosDescripcion"),
    icon: "mdi-book-open-page-variant",
    route: "/admin/books",
  },
  {
    title: t("admin.gestionarPedidos"),
    description: t("admin.pedidosDescripcion"),
    icon: "mdi-truck-check-outline",
    route: "/admin/orders",
  },
  {
    title: t("admin.revisarReportes"),
    description: t("admin.reportesDescripcion"),
    icon: "mdi-file-document-outline",
    route: "/admin/reports",
  },
  {
    title: t("admin.revisarEstadisticas"),
    description: t("admin.estadisticasDescripcion"),
    icon: "mdi-chart-bar",
    route: "/admin/statistics",
  },
]);
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: auto;
  padding: 30px;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.panel-admin {
  color: var(--color-heading);
}

.admin-card {
  background-color: var(--color-background);
  color: var(--color-text);
  border-radius: 12px;
  padding: 20px;
  height: 100%;
  transition: background-color 0.3s ease, transform 0.3s ease,
    box-shadow 0.3s ease;
  cursor: pointer;
}

.admin-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
}

.admin-card h3 {
  margin: 10px 0 8px;
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--color-heading);
}

.admin-card p {
  font-size: 0.95rem;
  color: var(--color-text);
}
</style>
