<template>
  <v-container class="ventas-vcontainer">
    <v-row justify="center">
      <v-col cols="12" md="12">
        <v-card class="ventas-vcard" elevation="6">
          <h1>{{ $t("ventas.titulo") }}</h1>

          <div class="boton-filtrar-contenedor">
            <v-btn
              @click="mostrarDialogo = true"
              variant="outlined"
              class="boton-filtrar"
            >
              {{ $t("ventas.filtrar") }}
            </v-btn>
          </div>

          <div
            class="zona-filtros-activos"
            :class="{ oculto: !hayFiltrosAplicados }"
            v-if="precioMin || fechaDesde"
          >
            <span v-if="mostrarFiltroPrecio" class="filtro-activo">
              {{ textoFiltroPrecio }}
              <v-btn
                icon
                size="x-small"
                @click="limpiarFiltroPrecio"
                variant="text"
              >
                <v-icon class="icono-close-circle">mdi-close-circle</v-icon>
              </v-btn>
            </span>

            <span v-if="mostrarFiltroFechas" class="filtro-activo">
              {{ textoFiltroFecha }}
              <v-btn
                icon
                size="x-small"
                @click="limpiarFiltroFechas"
                variant="text"
              >
                <v-icon class="icono-close-circle">mdi-close-circle</v-icon>
              </v-btn>
            </span>

            <v-btn
              v-if="
                hayFiltrosAplicados &&
                cantidadFiltros > 1 &&
                !todosLosPreciosInvalidos
              "
              @click="limpiarTodosLosFiltros"
              variant="outlined"
              class="boton-limpiar-filtros"
            >
              {{ $t("ventas.limpiarFiltros") }}
            </v-btn>
          </div>

          <v-dialog v-model="mostrarDialogo" width="400">
            <v-card class="vcard-dialogo">
              <v-card-title class="titulo-dialogo">{{
                $t("ventas.filtrado")
              }}</v-card-title>
              <v-card-text>
                <div class="bloque-filtro">
                  <p class="rango-precio-dialogo">
                    {{ $t("ventas.rangoPrecio") }}
                  </p>
                  <v-range-slider
                    v-model="rangoPrecios"
                    :min="
                      isFechaValida(fechaMinimaReal)
                        ? fechaMinimaReal.toISOString().split('T')[0]
                        : undefined
                    "
                    :max="precioMaximoReal"
                    color="#2c3e50"
                    step="0.01"
                    thumb-label
                    :disabled="todosLosPreciosInvalidos"
                  />
                </div>

                <div class="bloque-filtro">
                  <p class="rango-fechas-dialogo">
                    {{ $t("ventas.rangoFechas") }}
                  </p>
                  <v-date-picker
                    v-model="rangoFechas"
                    :min="
                      isFechaValida(fechaMinimaReal.value)
                        ? fechaMinimaReal.value.toISOString().split('T')[0]
                        : undefined
                    "
                    :max="fechaMaximaReal.toISOString().split('T')[0]"
                    multiple
                    color="#2c3e50"
                    @update:model-value="limitarFechas"
                  />
                </div>
              </v-card-text>
              <v-card-actions class="acciones-dialogo">
                <v-spacer />
                <v-btn @click="mostrarDialogo = false" color="black">{{
                  $t("ventas.cerrar")
                }}</v-btn>
                <v-btn @click="aplicarFiltros" color="#2c3e50">{{
                  $t("ventas.aplicar")
                }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-text-field
            v-model="search"
            :placeholder="$t('ventas.buscador')"
            prepend-inner-icon="mdi-magnify"
            class="buscador"
            hide-details
            clearable
            variant="outlined"
            @click:clear="search = ''"
          />

          <v-data-table
            v-model:search="search"
            :headers="headers"
            :items="ventasFiltradas"
            :items-per-page="5"
            :items-per-page-options="[5, 10, 20, 50, -1]"
            :items-per-page-text="$t('tabla.elementosPorPagina')"
            :items-per-page-all-text="$t('tabla.todos')"
            :sort-by="[{ key: 'fecha', order: 'desc' }]"
            density="comfortable"
          >
            <template #item="{ item, index }">
              <tr :class="index % 2 === 0 ? 'fila-par' : 'fila-impar'" @click="goToVenta(item.id)">
                <td>{{ item.id }}</td>
                <td>{{ item.buyer_name }}</td>
                <td>
                  {{
                    new Date(
                      item.buying_date.seconds * 1000
                    ).toLocaleDateString()
                  }}
                </td>
                <td>
                  {{
                    isNaN(item.total_price) || item.total_price === null
                      ? $t("ventas.noDisponible")
                      : item.total_price + " €"
                  }}
                </td>
                <td>
                  <v-btn
                    v-if="item.status === 'PAID'"
                    class="boton-enviar"
                    @click="marcarComoEnviado(item.id)"
                    density="comfortable"
                  >
                    {{ $t("ventas.marcarEnviado") }}
                  </v-btn>
                </td>
              </tr>
            </template>

            <template #no-data>
              <div class="no-datos">{{ $t("ventas.noDatos") }}</div>
            </template>
          </v-data-table>

          <!-- Mensaje si no hay ventas -->
          <div v-if="ventas.length === 0" class="sin-ventas">
            <v-icon color="grey" size="40">mdi-book-off</v-icon>
            <p class="sin-ventas-p">{{ $t("ventas.sinVentas") }}</p>
          </div>

          <div class="resumen-totales">
            <p class="resumen-totales-p">
              <strong>{{ $t("ventas.totalVentas") }} :</strong>
              {{ totalVentas }}
            </p>
            <p>
              <strong>{{ $t("ventas.ingresosTotales") }} :</strong>
              {{
                isNaN(totalIngresos) || totalIngresos === null
                  ? $t("ventas.noDisponible")
                  : totalIngresos + " €"
              }}
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "@/stores/user_store";
import { useOrderStore } from "@/stores/order_store";
import { useRouter } from 'vue-router';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();

const ventas = ref([]);
const search = ref("");

const { t } = useI18n();

const precioMin = ref(null);
const precioMax = ref(null);
const fechaDesde = ref(null);
const fechaHasta = ref(null);

const rangoPrecios = ref([null, null]);
const rangoFechas = ref([]);

const mostrarDialogo = ref(false);
let intervaloRefresco = null;

const goToVenta = (id) => {
  router.push(`Perfil/GestionarPedido/${id}`);
};

const headers = computed(() => [
  {
    title: t("ventas.idPedido"),
    value: "id",
    align: "center",
    sortable: true,
  },
  {
    title: t("ventas.comprador"),
    value: "buyer_name",
    align: "center",
    sortable: true,
  },
  {
    title: t("ventas.fechaSin"),
    value: "buying_date",
    align: "center",
    sortable: true,
  },
  {
    title: t("ventas.total"),
    value: "total_price",
    align: "center",
    sortable: true,
  },
  {
    title: t("ventas.acciones"),
    value: "actions",
    align: "center",
    sortable: false,
  },
]);

const convertirTimestampAFecha = (timestamp) => {
  if (!timestamp || typeof timestamp.seconds !== "number") return null;
  return new Date(timestamp.seconds * 1000);
};

const isFechaValida = (fecha) =>
  fecha instanceof Date && !isNaN(fecha.getTime());

const precioMinimoReal = computed(() =>
  Math.min(...ventas.value.map((v) => parseFloat(v.total_price)))
);
const precioMaximoReal = computed(() =>
  Math.max(...ventas.value.map((v) => parseFloat(v.total_price)))
);

const todosLosPreciosInvalidos = computed(() =>
  ventas.value.every((v) => isNaN(parseFloat(v.total_price)))
);

const fechaMinimaReal = computed(
  () =>
    new Date(
      Math.min(
        ...ventas.value
          .map((v) => convertirTimestampAFecha(v.buying_date))
          .filter((f) => f instanceof Date && !isNaN(f))
      )
    )
);

const fechaMaximaReal = computed(
  () =>
    new Date(
      Math.max(
        ...ventas.value
          .map((v) => convertirTimestampAFecha(v.buying_date))
          .filter((f) => f instanceof Date && !isNaN(f))
      )
    )
);

const mostrarFiltroPrecio = computed(() => {
  if (todosLosPreciosInvalidos.value) return false;
  return (
    precioMin.value !== null &&
    (precioMin.value !== precioMinimoReal.value ||
      precioMax.value !== precioMaximoReal.value)
  );
});

const mostrarFiltroFechas = computed(() => {
  const fechaMinFormat = isFechaValida(fechaMinimaReal.value)
    ? fechaMinimaReal.value.toISOString().split("T")[0]
    : undefined;

  const fechaMaxFormat = fechaMaximaReal.value.toISOString().split("T")[0];

  return (
    fechaDesde.value &&
    (fechaDesde.value !== fechaMinFormat || fechaHasta.value !== fechaMaxFormat)
  );
});

const hayFiltrosAplicados = computed(() => {
  const precioModificado =
    precioMin.value !== null &&
    (precioMin.value !== precioMinimoReal.value ||
      precioMax.value !== precioMaximoReal.value);

  const fechaMinFormat = isFechaValida(fechaMinimaReal.value)
    ? fechaMinimaReal.value.toISOString().split("T")[0]
    : undefined;

  const fechaMaxFormat = fechaMaximaReal.value.toISOString().split("T")[0];

  const fechaModificada =
    fechaDesde.value &&
    (fechaDesde.value !== fechaMinFormat ||
      fechaHasta.value !== fechaMaxFormat);

  return precioModificado || fechaModificada;
});

const textoFiltroPrecio = computed(() => {
  if (precioMin.value == null || precioMax.value == null) return "";
  const min = parseFloat(precioMin.value).toFixed(2);
  const max = parseFloat(precioMax.value).toFixed(2);
  if (min === max) {
    return t("ventas.precioSin") + `: ${min}€`;
  } else {
    return t("ventas.filtroPrecio") + `: ${min}€ - ${max}€`;
  }
});

const textoFiltroFecha = computed(() => {
  if (!fechaDesde.value || !fechaHasta.value) return "";

  let f1 = fechaDesde.value;
  let f2 = fechaHasta.value;

  if (f1 > f2) [f1, f2] = [f2, f1];

  const fechaDesdeStr = formatearFecha(f1);
  const fechaHastaStr = formatearFecha(f2);

  if (fechaDesdeStr === fechaHastaStr) {
    return t("ventas.fechaSin") + `: ${fechaDesdeStr}`;
  } else {
    return t("ventas.filtroFecha") + `: ${fechaDesdeStr} - ${fechaHastaStr}`;
  }
});

const totalVentas = computed(() => ventasFiltradas.value.length);

const totalIngresos = computed(() =>
  ventasFiltradas.value
    .reduce((total, venta) => total + parseFloat(venta.total_price), 0)
    .toFixed(2)
);

const toFechaString = (fecha) => {
  if (!fecha) return "";
  const f = new Date(fecha);
  if (isNaN(f)) return "";

  const dia = String(f.getDate()).padStart(2, "0");
  const mes = String(f.getMonth() + 1).padStart(2, "0");
  const anio = f.getFullYear();

  return `${anio}-${mes}-${dia}`;
};

const formatearFecha = (fechaStr) => {
  if (!fechaStr) return "";
  const fecha = new Date(fechaStr);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  return `${dia}-${mes}-${anio}`;
};

const ventasFiltradas = computed(() => {
  let fechaInicio = fechaDesde.value;
  let fechaFin = fechaHasta.value;

  if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
    [fechaInicio, fechaFin] = [fechaFin, fechaInicio];
  }

  const fechaDesdeStr = fechaInicio ? toFechaString(fechaInicio) : "";
  const fechaHastaStr = fechaFin ? toFechaString(fechaFin) : "";

  return ventas.value.filter((venta) => {
    const textoCoincide =
      venta.id.toLowerCase().includes(search.value.toLowerCase()) ||
      venta.buyer_name.toLowerCase().includes(search.value.toLowerCase());

    const precio = parseFloat(venta.total_price);
    const fechaVenta = convertirTimestampAFecha(venta.buying_date);
    const fechaVentaStr = fechaVenta ? toFechaString(fechaVenta) : "";

    const pasaPrecio =
      todosLosPreciosInvalidos.value ||
      ((precioMin.value == null || precio >= precioMin.value) &&
        (precioMax.value == null || precio <= precioMax.value));

    const pasaFecha =
      (!fechaDesdeStr || fechaVentaStr >= fechaDesdeStr) &&
      (!fechaHastaStr || fechaVentaStr <= fechaHastaStr);

    return textoCoincide && pasaPrecio && pasaFecha;
  });
});

const limitarFechas = (fechasSeleccionadas) => {
  if (fechasSeleccionadas.length > 2) {
    rangoFechas.value = fechasSeleccionadas.slice(-2);
  }
};

const cantidadFiltros = computed(() => {
  let count = 0;
  if (
    precioMin.value !== null &&
    (precioMin.value !== precioMinimoReal.value ||
      precioMax.value !== precioMaximoReal.value)
  )
    count++;

  if (
    fechaDesde.value &&
    (toFechaString(fechaDesde.value) !== toFechaString(fechaMinimaReal.value) ||
      toFechaString(fechaHasta.value) !== toFechaString(fechaMaximaReal.value))
  )
    count++;

  return count;
});

const limpiarFiltroPrecio = () => {
  precioMin.value = null;
  precioMax.value = null;
  rangoPrecios.value = [precioMinimoReal.value, precioMaximoReal.value];
};

const limpiarFiltroFechas = () => {
  fechaDesde.value = null;
  fechaHasta.value = null;
  rangoFechas.value = [];
};

const limpiarTodosLosFiltros = () => {
  limpiarFiltroPrecio();
  limpiarFiltroFechas();
  search.value = "";
};

const aplicarFiltros = () => {
  precioMin.value = rangoPrecios.value[0];
  precioMax.value = rangoPrecios.value[1];

  if (rangoFechas.value.length === 2) {
    const ordenadas = [...rangoFechas.value].sort();
    fechaDesde.value = ordenadas[0];
    fechaHasta.value = ordenadas[1];
  } else if (rangoFechas.value.length === 1) {
    fechaDesde.value = rangoFechas.value[0];
    fechaHasta.value = rangoFechas.value[0];
  } else {
    fechaDesde.value = null;
    fechaHasta.value = null;
  }

  mostrarDialogo.value = false;
};

const marcarComoEnviado = async (pedidoId) => {
  await orderStore.confirmShipment(pedidoId);
  console.log("Pedido marcado como enviado.");
  const result = await orderStore.getSellsFromUser(userStore.id);
  if (result?.result === "SUCCESS") {
    ventas.value = result.data;
  }
};

const cargarVentas = async () => {
  const result = await orderStore.getSellsFromUser(userStore.id);
  if (result?.result === "SUCCESS") {
    ventas.value = result.data;
  }
};

onMounted(async () => {
  await cargarVentas();

  intervaloRefresco = setInterval(() => {
    cargarVentas();
  }, 5000);

  rangoPrecios.value = [precioMinimoReal.value, precioMaximoReal.value];
  if (
    isFechaValida(fechaMinimaReal.value) &&
    isFechaValida(fechaMaximaReal.value)
  ) {
    rangoFechas.value = [
      fechaMinimaReal.value.toISOString().split("T")[0],
      fechaMaximaReal.value.toISOString().split("T")[0],
    ];
  } else {
    rangoFechas.value = [];
  }
});

onBeforeUnmount(() => {
  clearInterval(intervaloRefresco);
});
</script>

<style scoped>
.ventas-vcontainer {
  padding: 1.5rem auto;
}

.ventas-vcard {
  padding: 1rem;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-align: center;
  color: #2c3e50;
}

.boton-filtrar-contenedor {
  display: flex;
  justify-content: end;
}

.boton-filtrar {
  margin-bottom: 1rem;
}

.boton-filtrar:hover {
  background-color: #95a4b3;
}

.zona-filtros-activos {
  display: flex;
  justify-content: end;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.zona-filtros-activos span {
  background-color: #95a4b3;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.filtro-activo {
  background-color: #f4f4f4;
  padding: 0.4rem 1rem;
  display: inline-flex;
  align-items: center;
  font-size: 0.95rem;
  height: 2.5rem;
  line-height: 1.5;
  gap: 0.5rem;
}

.icono-close-circle {
  font-size: 1.2rem;
  color: black;
}

.boton-limpiar-filtros {
  height: 2.5rem;
  transition: 0.3s ease background-color;
}

.boton-limpiar-filtros:hover {
  background-color: #818f9c;
}

.oculto {
  display: none !important;
}

.titulo-dialogo,
.rango-precio-dialogo,
.rango-fechas-dialogo {
  color: #2c3e50;
}

.bloque-filtro {
  margin-bottom: 1.5rem;
}

.acciones-dialogo {
  margin-top: -2rem;
}

.buscador {
  margin-bottom: 1.5rem;
}

/* 🧿 Cabecera tabla */
::v-deep(.v-data-table thead th) {
  font-size: 1.1rem;
  background-color: #2c3e50;
  color: white;
}

/* Íconos de orden */
::v-deep(.v-data-table-header__sort-icon) {
  margin-right: -1.8rem;
}

/* Cuerpo tabla */
::v-deep(.v-data-table tbody td) {
  text-align: center;
  color: var(--color-text);
}

/* Fila impar (blanca modo claro, oscura modo oscuro) */
.fila-impar {
  background-color: white;
}

/* Tamaño celdas */
.v-data-table td {
  font-size: 1rem;
  padding: 12px 16px;
}

.boton-enviar {
  background-color: #2c3e50;
  color: white;
  font-size: 0.8rem;
}

/* No hay datos */
.no-datos {
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: 1rem;
}

.sin-ventas {
  text-align: center;
  margin-top: 1.5rem;
}

.sin-ventas-p {
  margin-top: 0.5rem;
}

.resumen-totales {
  margin-top: 1.5rem;
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
}

.resumen-totales-p {
  color: #2c3e50;
}

/* 🌙🌙🌙 Estilos para modo oscuro */
html[data-theme="dark"] {
  .ventas-vcard {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  h1,
  .resumen-totales-p,
  .titulo-dialogo,
  .rango-precio-dialogo,
  .rango-fechas-dialogo {
    color: var(--color-heading) !important;
  }

  .filtro-activo,
  .zona-filtros-activos span {
    background-color: var(--color-background-mute) !important;
    color: var(--color-text) !important;
  }

  .icono-close-circle {
    color: var(--color-text) !important;
  }

  .fila-impar {
    background-color: var(--color-background-mute) !important;
  }

  ::v-deep(.v-data-table tbody tr:hover) {
    background-color: rgba(21, 101, 192, 0.15) !important;
  }

  /* 🗓 Date Picker dentro del diálogo */
  ::v-deep(.v-picker) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-date-picker-header),
  ::v-deep(.v-date-picker-controls),
  ::v-deep(.v-date-picker-table) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-btn--variant-outlined) {
    border-color: var(--color-border) !important;
    color: var(--color-text) !important;
  }

  ::v-deep(.v-slider-thumb__label) {
    background-color: #2c3e50 !important;
    color: white !important;
  }
}

/* 🌙 Correcciones completas para v-dialog y v-card en modo oscuro */
html[data-theme="dark"] {
  /* Contenedor del diálogo */
  ::v-deep(.v-overlay__content .v-card) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Fondo interior del v-card-text */
  ::v-deep(.v-card-text) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Botones del diálogo */
  ::v-deep(.v-card-actions .v-btn) {
    color: var(--color-heading) !important;
  }

  /* Título del diálogo */
  ::v-deep(.v-card-title) {
    color: var(--color-heading) !important;
  }
}

html[data-theme="dark"] {
  /* Fondo uniforme en modo oscuro para todas las filas */
  ::v-deep(.v-data-table tbody tr) {
    background-color: var(--color-background-soft) !important;
  }

  /* ✅ Elimina cualquier efecto hover en filas */
  ::v-deep(.v-data-table tbody tr:hover) {
    background-color: var(--color-background-soft) !important;
  }

  /* 🧿 Footer (elementos por página, paginación) */
  ::v-deep(.v-data-table-footer) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* 🧿 Select en footer */
  ::v-deep(.v-data-table-footer .v-select),
  ::v-deep(.v-data-table-footer .v-field) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
  }

  /* Botones paginación en footer */
  ::v-deep(.v-data-table-footer .v-btn) {
    background-color: var(--color-background-soft) !important;
    color: var(--color-text) !important;
    transition: none !important;
  }

  /* Texto resumen totales */
  .resumen-totales-p {
    color: var(--color-heading) !important;
  }

  /* Estilo uniforme para celdas */
  ::v-deep(.v-data-table tbody td) {
    color: var(--color-text) !important;
    background-color: var(--color-background-soft) !important;
  }
}
</style>
