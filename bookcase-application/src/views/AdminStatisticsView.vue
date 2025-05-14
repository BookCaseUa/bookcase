<template>
  <v-container class="estadisticas-container">
    <h1 class="text-h5 font-weight-bold text-center mb-6 color-proyecto">
      <v-icon class="mr-2">mdi-chart-bar</v-icon>
      {{ $t("estadisticas.titulo") }}
    </h1>

    <v-row>
      <!-- Libros más vendidos -->
      <v-col cols="12">
        <v-card class="estadisticas-card" elevation="6">
          <h3>
            <v-icon>mdi-book-multiple</v-icon>
            {{ $t("estadisticas.librosMasVendidos") }}
          </h3>
          <BarChart
            v-if="librosData"
            :chart-data="librosData"
            :chart-options="chartOptionsLibros"
          />
          <div
            v-else
            class="d-flex justify-center align-center"
            style="height: 300px"
          >
            <v-progress-circular
              indeterminate
              color="#2c3e50"
              size="60"
              width="6"
            />
          </div>
        </v-card>
      </v-col>

      <!-- Categorías más populares -->
      <v-col cols="12">
        <v-card class="estadisticas-card" elevation="6">
          <h3>
            <v-icon>mdi-book-open-page-variant</v-icon>
            {{ $t("estadisticas.categoriasMasPopulares") }}
          </h3>
          <BarChart
            v-if="categoriasData"
            :chart-data="categoriasData"
            :chart-options="chartOptionsCategorias"
          />
          <div
            v-else
            class="d-flex justify-center align-center"
            style="height: 300px"
          >
            <v-progress-circular
              indeterminate
              color="#2c3e50"
              size="60"
              width="6"
            />
          </div>
        </v-card>
      </v-col>

      <!-- Pedidos por mes -->
      <v-col cols="12">
        <v-card class="estadisticas-card" elevation="6">
          <h3>
            <v-icon>mdi-package-variant-closed</v-icon>
            {{ $t("estadisticas.pedidosPorMes") }}
          </h3>
          <LineChart
            v-if="pedidosData"
            :chart-data="pedidosData"
            :chart-options="chartOptionsPedidos"
          />
          <div
            v-else
            class="d-flex justify-center align-center"
            style="height: 300px"
          >
            <v-progress-circular
              indeterminate
              color="#2c3e50"
              size="60"
              width="6"
            />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import BarChart from "../components/charts/BarChart.vue";
import LineChart from "../components/charts/LineChart.vue";
import { useOfferStore } from "@/stores/offer_store";
import { useEditionStore } from "@/stores/edition_store";
import { useBookStore } from "@/stores/book_store";
import { useOrderStore } from "@/stores/order_store";
import { useI18n } from "vue-i18n";
import { ref, onMounted, computed } from "vue";

const offerStore = useOfferStore();
const editionStore = useEditionStore();
const bookStore = useBookStore();
const orderStore = useOrderStore();
const { t } = useI18n();

const top = 5;
const colores = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099"];
const coloresCategorias = [
  "#26A69A",
  "#7E57C2",
  "#FF7043",
  "#5C6BC0",
  "#26C6DA",
  "#FFCA28",
  "#8D6E63",
];

const librosNumeros = ref(null);
const categoriasNumeros = ref(null);
const pedidosNumeros = ref(null);

const chartOptionsLibros = ref({});
const chartOptionsCategorias = ref({});
const chartOptionsPedidos = ref({});

const meses = computed(() => [
  t("estadisticas.enero"),
  t("estadisticas.febrero"),
  t("estadisticas.marzo"),
  t("estadisticas.abril"),
  t("estadisticas.mayo"),
  t("estadisticas.junio"),
  t("estadisticas.julio"),
  t("estadisticas.agosto"),
  t("estadisticas.septiembre"),
  t("estadisticas.octubre"),
  t("estadisticas.noviembre"),
  t("estadisticas.diciembre"),
]);

const librosData = computed(() =>
  librosNumeros.value
    ? {
        labels: meses.value,
        datasets: librosNumeros.value.datasets,
      }
    : null
);

const categoriasData = computed(() =>
  categoriasNumeros.value
    ? {
        labels: meses.value,
        datasets: categoriasNumeros.value.raw.map((c, i) => ({
          label: t(`estadisticas.generos.${c.category}`, c.category),
          data: c.sales,
          backgroundColor: coloresCategorias[i % coloresCategorias.length],
        })),
      }
    : null
);

const pedidosData = computed(() =>
  pedidosNumeros.value
    ? {
        labels: meses.value,
        datasets: [
          {
            label: t("estadisticas.pedidos"),
            borderColor: "#7E57C2",
            backgroundColor: "rgba(126, 87, 194, 0.2)",
            tension: 0.4,
            fill: true,
            data: pedidosNumeros.value.data,
          },
        ],
      }
    : null
);

async function generarLibrosMasVendidosData() {
  await offerStore.fetchOffers();
  await editionStore.fetchEditions();

  const soldOffers = offerStore.offers.filter((o) => o.data.status === "SOLD");

  const editionMap = {};
  editionStore.editions.forEach((ed) => {
    editionMap[ed.id] = ed.data.book_title;
  });

  const bookSales = {};
  soldOffers.forEach((offer) => {
    const editionId = offer.data.edition_id;
    const bookTitle = editionMap[editionId] || t("pedidos.desconocido");
    const monthIndex = new Date(
      offer.data.publication_date.seconds * 1000
    ).getMonth();

    if (!bookSales[bookTitle]) bookSales[bookTitle] = Array(12).fill(0);
    bookSales[bookTitle][monthIndex]++;
  });

  const topLibros = Object.entries(bookSales)
    .map(([title, sales]) => ({
      title,
      total: sales.reduce((a, b) => a + b, 0),
      sales,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, top);

  const maxY =
    Math.ceil(Math.max(...topLibros.flatMap((l) => l.sales)) / 10) * 10;

  librosNumeros.value = {
    datasets: topLibros.map((l, i) => ({
      label: l.title,
      data: l.sales,
      backgroundColor: colores[i % colores.length],
    })),
  };

  chartOptionsLibros.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, max: maxY } },
  };
}

async function generarCategoriasMasPopularesData() {
  await offerStore.fetchOffers();
  await editionStore.fetchEditions();
  await bookStore.fetchBooks();

  const soldOffers = offerStore.offers.filter((o) => o.data.status === "SOLD");

  const editionToBookMap = {};
  editionStore.editions.forEach((ed) => {
    editionToBookMap[ed.id] = ed.data.book_id;
  });

  const bookToGenreMap = {};
  bookStore.books.forEach((book) => {
    bookToGenreMap[book.id] = book.data.genre || t("pedidos.desconocido");
  });

  const categorySales = {};
  soldOffers.forEach((offer) => {
    const editionId = offer.data.edition_id;
    const bookId = editionToBookMap[editionId];
    const genre = bookToGenreMap[bookId] || t("pedidos.desconocido");
    const monthIndex = new Date(
      offer.data.publication_date.seconds * 1000
    ).getMonth();

    if (!categorySales[genre]) categorySales[genre] = Array(12).fill(0);
    categorySales[genre][monthIndex]++;
  });

  const categoriasConTotales = Object.entries(categorySales).map(
    ([category, sales]) => ({
      category,
      total: sales.reduce((a, b) => a + b, 0),
      sales,
    })
  );

  const maxY =
    Math.ceil(Math.max(...categoriasConTotales.flatMap((c) => c.sales)) / 10) *
    10;

  categoriasNumeros.value = {
    raw: categoriasConTotales,
  };

  chartOptionsCategorias.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, max: maxY } },
  };
}

async function generarPedidosPorMesData() {
  await orderStore.fetchOrders();

  const pedidosPorMes = Array(12).fill(0);
  orderStore.orders.forEach((order) => {
    const monthIndex = new Date(order.buying_date.seconds * 1000).getMonth();
    pedidosPorMes[monthIndex]++;
  });

  const maxY = Math.ceil(Math.max(...pedidosPorMes) / 10) * 10;

  pedidosNumeros.value = {
    data: pedidosPorMes,
  };

  chartOptionsPedidos.value = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } },
    scales: { y: { beginAtZero: true, max: maxY } },
  };
}

onMounted(async () => {
  await Promise.all([
    generarLibrosMasVendidosData(),
    generarCategoriasMasPopularesData(),
    generarPedidosPorMesData(),
  ]);
});
</script>

<style scoped>
.estadisticas-container {
  padding: 1rem;
}

.estadisticas-card {
  padding: 1.5rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s, color 0.3s;
}

h1 {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
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

h3 {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-text);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
