<template>
  <v-container class="user-list-container">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="user-list-vcard" elevation="6">
          <h1 class="color-proyecto">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            {{ $t("usuarios.titulo") }}
          </h1>

          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('usuarios.buscar')"
            outlined
            clearable
            hide-details
            prepend-inner-icon="mdi-magnify"
            @click:clear="
              () => {
                searchQuery = '';
                currentPage = 1;
              }
            "
          />

          <v-data-table
            v-if="filteredUsers.length > 0"
            :headers="headers"
            :items="filteredUsers"
            :items-per-page="5"
            :items-per-page-options="[5, 10, 20, 50, -1]"
            :items-per-page-text="$t('tabla.elementosPorPagina')"
            :items-per-page-all-text="$t('tabla.todos')"
            :page.sync="currentPage"
            class="mt-4"
          >
            <template #item="{ item, index }">
              <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
                <td>{{ item.nickname }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.pais }}</td>
                <td>{{ item.compras }}</td>
                <td>{{ item.ventas }}</td>
                <td>
                  <v-select
                    v-model="item.data.type"
                    :items="roles"
                    item-title="label"
                    item-value="value"
                    dense
                    hide-details
                    class="select-rol"
                    density="compact"
                    @update:model-value="cambiarTipo(item)"
                  />
                </td>
              </tr>
            </template>

            <template #no-data>
              <div class="no-datos">{{ $t("usuarios.sinResultados") }}</div>
            </template>
          </v-data-table>

          <p v-if="filteredUsers.length === 0" class="no-users">
            {{ $t("usuarios.sinUsuarios") }}
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserListStore } from "../stores/user_list_store";
import { useI18n } from "vue-i18n";

const userListStore = useUserListStore();
const searchQuery = ref("");
const currentPage = ref(1);
const { t } = useI18n();

const headers = computed(() => [
  {
    title: t("usuarios.nombre"),
    key: "nickname",
    align: "center",
    sortable: true,
  },
  { title: t("usuarios.email"), key: "email", align: "center", sortable: true },
  { title: t("usuarios.pais"), key: "pais", align: "center", sortable: true },
  {
    title: t("usuarios.compras"),
    key: "compras",
    align: "center",
    sortable: true,
  },
  {
    title: t("usuarios.ventas"),
    key: "ventas",
    align: "center",
    sortable: true,
  },
  {
    title: t("usuarios.rol"),
    key: "type",
    align: "center",
    sortable: false,
  },
]);

const roles = computed(() => [
  { label: t("usuarios.admin"), value: "admin" },
  { label: t("usuarios.usuario"), value: "user" },
  { label: t("usuarios.profesional"), value: "profesional" },
  { label: t("usuarios.libreria"), value: "bookstore" },
]);

const cambiarTipo = async (user) => {
  try {
    await userListStore.editUserType(user.id, user.data.type);
  } catch (error) {
    console.error("Error al cambiar tipo:", error);
  }
};

const filteredUsers = computed(() => {
  const search = searchQuery.value.toLowerCase().trim();
  return userListStore.users
    .map((user) => ({
      id: user.id,
      data: user.data,
      nickname: user.data?.nickname || user.data?.name || "",
      email: user.data?.email || "",
      pais: user.data?.direccion?.pais || "-",
      compras: user.data?.compras ?? "-",
      ventas: user.data?.ventas ?? "-",
      type: user.data?.type || "",
    }))
    .filter((user) => {
      return (
        user.email.toLowerCase().includes(search) ||
        user.nickname.toLowerCase().includes(search)
      );
    });
});

onMounted(async () => {
  await userListStore.fetchUsers();
});
</script>

<style scoped>
.user-list-container {
  padding: 1.5rem auto;
}

.user-list-vcard {
  padding: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #2c3e50;
}

.color-proyecto {
  color: #2c3e50;
}

html[data-theme="dark"] .color-proyecto,
html[data-theme="dark"] h1 {
  color: var(--color-heading) !important;
}

::v-deep(.v-data-table thead th) {
  font-size: 1.1rem;
  background-color: #2c3e50 !important;
  color: white !important;
  text-align: center;
}

::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.7rem;
}

.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
  text-align: center;
  color: var(--color-text) !important;
  background-color: var(--color-background-soft) !important;
}

.fila-par {
  background-color: var(--color-background-soft);
}

.fila-impar {
  background-color: var(--color-background-soft);
}

::v-deep(.v-data-table tbody tr:hover) {
  background-color: rgba(33, 150, 243, 0.08);
  transition: background-color 0.3s;
}

.select-rol {
  width: 100%;
}

.no-datos {
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text);
}

.no-users {
  text-align: center;
  color: var(--color-text);
}

/* Footer (paginación) */
::v-deep(.v-data-table-footer) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

::v-deep(.v-data-table-footer .v-select),
::v-deep(.v-data-table-footer .v-field) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}
</style>
