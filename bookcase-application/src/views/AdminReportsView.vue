<template>
  <v-container class="reports-container">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="reports-vcard" elevation="6">
          <h2 class="text-h5 font-weight-bold text-center mb-6 color-proyecto">
            <v-icon class="mr-2">mdi-alert-circle</v-icon>
            {{ $t("reportes.titulo") }}
          </h2>

          <v-text-field
            v-model="searchQuery"
            :placeholder="$t('reportes.buscar')"
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
            v-if="reports.length > 0"
            :headers="headers"
            :items="filteredReports"
            :items-per-page="5"
            :items-per-page-options="[5, 10, 20, 50, -1]"
            :items-per-page-text="$t('tabla.elementosPorPagina')"
            :items-per-page-all-text="$t('tabla.todos')"
            :page.sync="currentPage"
            class="mt-4"
          >
            <template #item="{ item, index }">
              <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'">
                <td>{{ item.email }}</td>
                <td>{{ item.book }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.comment }}</td>
              </tr>
            </template>
          </v-data-table>

          <p v-else class="no-reports">{{ $t("reportes.sinReportes") }}</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const reports = ref([]);
const searchQuery = ref("");
const currentPage = ref(1);
const { t } = useI18n();

const headers = computed(() => [
  { title: t("reportes.email"), key: "email", align: "center", sortable: true },
  { title: t("reportes.libro"), key: "book", align: "center", sortable: true },
  {
    title: t("reportes.reporte"),
    key: "status",
    align: "center",
    sortable: false,
  },
  {
    title: t("reportes.comentario"),
    key: "comment",
    align: "center",
    sortable: false,
  },
]);

const filteredReports = computed(() => {
  const search = searchQuery.value.toLowerCase().trim();
  return reports.value.filter((report) => {
    const email = report.email?.toLowerCase() || "";
    const book = report.book?.toLowerCase() || "";
    return email.includes(search) || book.includes(search);
  });
});

onMounted(() => {
  reports.value = [
    {
      email: "juanperez@gmail.com",
      book: "Libro de Ejemplo",
      status: "Daño en el estado",
      comment: "El libro llegó con la cubierta rasgada.",
    },
    {
      email: "ana.lopez@hotmail.com",
      book: "Otro libro",
      status: "No llegó",
      comment: "No he recibido el libro que compré.",
    },
    {
      email: "luisgomez@gmail.com",
      book: "Libro Genérico",
      status: "Estado perfecto",
      comment: "Todo en orden, el libro estaba en buen estado.",
    },
  ];
});
</script>

<style scoped>
.reports-container {
  padding: 1.5rem auto;
}

.reports-vcard {
  padding: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

.color-proyecto {
  color: #2c3e50;
}

html[data-theme="dark"] .color-proyecto {
  color: var(--color-heading) !important;
}

::v-deep(.v-data-table thead th) {
  background-color: #2c3e50 !important;
  color: white !important;
  font-size: 1.1rem;
  text-align: center;
}

::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.7rem;
}

.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
  color: var(--color-text) !important;
  background-color: var(--color-background-soft) !important;
  text-align: center;
}

.fila-impar {
  background-color: var(--color-background-soft);
}

.fila-par {
  background-color: var(--color-background-mute);
}

.no-reports {
  text-align: center;
  margin-top: 20px;
  font-style: italic;
  color: var(--color-text);
}

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
