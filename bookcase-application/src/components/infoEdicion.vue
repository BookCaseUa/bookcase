<template>
  <v-container class="pa-8">
    <v-card class="card mx-auto" max-width="900" elevation="3">
      <v-row no-gutters>
        <v-col cols="12" md="4" class="position-relative">
          <div style="position: relative">
            <v-img
              :src="edicion?.data?.image || 'https://placehold.co/200x300'"
              height="300"
              class="rounded"
            />
            <v-chip
              v-if="edicion?.data?.edition"
              style="
                position: absolute;
                bottom: -10px;
                left: 20px;
                width: 40px;
                height: 40px;
                background-color: #1976d2;
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
              "
            >
              {{ edicion.data.edition }}ª ed
            </v-chip>
          </div>
        </v-col>

        <v-col cols="12" md="8">
          <h2 class="titulo">{{ edicion?.data?.book_title }}</h2>
          <p class="texto">
            <strong>{{ $t("infoEdicion.año") }}:</strong>
            {{ edicion?.data?.year }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.primeraPublicacion") }}:</strong>
            {{ libro?.data?.primera_publicacion }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.editorial") }}:</strong>
            {{ edicion?.data?.editorial }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.autor") }}:</strong>
            {{ libro?.data?.author }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.tipo") }}:</strong>
            {{ edicion?.data?.type }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.genero") }}:</strong>
            {{ libro?.data?.genre }}
          </p>
          <p class="texto">
            <strong>{{ $t("infoEdicion.observaciones") }}:</strong>
            {{ edicion?.data?.observations }}
          </p>
          <v-icon
            v-if="userStore.logged"
            color="red"
            @click="toggleWanted()"
            class="me-2"
          >
            {{
              wants.is_wanted(edicion?.id) ? "mdi-heart" : "mdi-heart-outline"
            }}
          </v-icon>
        </v-col>
      </v-row>
    </v-card>

    <h3 class="titulo-oferta">{{ $t("infoEdicion.ofertasDisponibles") }}</h3>

    <v-row class="my-6" justify="space-between">
      <v-col cols="12" md="3">
        <v-select
          v-model="orden"
          :items="opcionesOrden"
          :label="$t('infoEdicion.ordenarPor')"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filtroCondicion"
          :items="opcionesCondicion"
          :label="$t('infoEdicion.filtrarPorCondicion')"
          outlined
          dense
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="filtroIdioma"
          :items="opcionesIdioma"
          :label="$t('infoEdicion.filtrarPorIdioma')"
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-data-table
      class="solo-encabezado"
      :headers="headers"
      :items="ofertasFiltradas"
      :items-per-page="5"
      :items-per-page-options="[5, 10, 20, 50, -1]"
      :items-per-page-text="$t('tabla.elementosPorPagina')"
      :items-per-page-all-text="$t('tabla.todos')"
    >
      <template v-slot:item.vendedor="{ item }">
        {{ item.vendedor || $t("infoEdicion.usuario") }}
        <v-tooltip top content-class="custom-tooltip">
          <template #activator="{ props }">
            <v-icon
              small
              v-bind="props"
              @mouseenter="
                console.log(
                  `Mostrando comentarios de ${item.data.seller_id}: `,
                  comentariosPorVendedor[item.data.seller_id]?.comentarios
                    .length
                )
              "
            >
              mdi-information-outline
            </v-icon>
          </template>
          <div class="tooltip-contenedor">
            <strong
              >{{ $t("infoEdicion.comentariosSobre") }}
              {{ item.vendedor }}</strong
            >

            <!-- ESTRELLAS Y MEDIA -->
            <div v-if="comentariosPorVendedor[item.data.seller_id]?.count">
              <div class="tooltip-rating">
                <span v-for="n in 5" :key="n">
                  <v-icon small>
                    {{
                      comentariosPorVendedor[item.data.seller_id].totalRating /
                        comentariosPorVendedor[item.data.seller_id].count >=
                      n
                        ? "mdi-star"
                        : comentariosPorVendedor[item.data.seller_id]
                            .totalRating /
                            comentariosPorVendedor[item.data.seller_id].count >=
                          n - 0.5
                        ? "mdi-star-half-full"
                        : "mdi-star-outline"
                    }}
                  </v-icon>
                </span>
                <span style="margin-left: 4px">
                  ({{
                    (
                      comentariosPorVendedor[item.data.seller_id].totalRating /
                      comentariosPorVendedor[item.data.seller_id].count
                    ).toFixed(1)
                  }})
                </span>
              </div>
            </div>

            <!-- LISTA DE COMENTARIOS -->
            <div
              v-if="
                comentariosPorVendedor[item.data.seller_id]?.comentarios.length
              "
            >
              <div
                v-for="(comentario, index) in comentariosPorVendedor[
                  item.data.seller_id
                ].comentarios"
                :key="index"
                class="tooltip-comentario"
              >
                · {{ comentario.buyer_name }}: {{ comentario.comment }}
              </div>
            </div>
            <div v-else class="tooltip-sin-comentarios">
              {{ $t("infoEdicion.sinComentarios") }}
            </div>
          </div>
        </v-tooltip>
      </template>

      <template v-slot:item.price="{ item }">
        {{ item.data.price }} €
        <v-icon color="primary" class="me-2" @click="añadirAlCarrito(item)">
          mdi-cart-plus
        </v-icon>
        <v-icon
          v-if="item.data.seller_id !== userStore.id"
          color="blue"
          class="me-2"
          @click="abrirChatConVendedor(item)"
          :title="$t('infoEdicion.contactarConVendedor')"
        >
          mdi-chat
        </v-icon>
      </template>

      <template v-slot:item.comment="{ item }">
        <div class="comentario">
          <v-tooltip location="top">
            <template #activator="{ props }">
              <span
                v-bind="props"
                :class="`fi fi-${obtenerBandera(item.data.language)}`"
                class="bandera"
              ></span>
            </template>
            <span> {{ $t(`infoEdicion.idiomas.${item.data.language}`) }} </span>
          </v-tooltip>
          <v-tooltip location="top">
            <template #activator="{ props }">
              <div
                v-bind="props"
                class="estado-cuadrado"
                :class="siglasCondicion(item.data.condition)"
              >
                {{ siglasCondicion(item.data.condition) }}
              </div>
            </template>
            <span>
              {{ $t(`infoEdicion.condicionesCodigo.${item.data.condition}`) }}
            </span>
          </v-tooltip>
          {{ item.data.comment }}
        </div>
      </template>
      <template v-slot:no-data>
        {{ $t("infoEdicion.sinOfertasDisponibles") }}
      </template>
    </v-data-table>
  </v-container>
  <ResumenCarrito @eliminar-oferta="quitarDelCarrito" />
</template>

<script setup>
import { onMounted, ref, computed, reactive } from "vue";
import { useRoute } from "vue-router";
import { useEditionStore } from "@/stores/edition_store";
import { useBookStore } from "@/stores/book_store";
import { useOfferStore } from "@/stores/offer_store";
import { useWantsStore } from "@/stores/wants_store";
import { useUserStore } from "@/stores/user_store";
import { getOrCreateChat } from "@/config/chat_conifg";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart_store";
import { useOrderStore } from "@/stores/order_store";
import ResumenCarrito from "@/components/ResumenCarrito.vue";
import { useI18n } from "vue-i18n";

const router = useRouter();
const route = useRoute();
const editionStore = useEditionStore();
const bookStore = useBookStore();
const offerStore = useOfferStore();
const wants = useWantsStore();
const userStore = useUserStore();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const { t } = useI18n();

const edicion = ref(null);
const libro = ref(null);
const todasLasOfertas = ref([]);
const filtroCondicion = ref("");
const filtroIdioma = ref("");
const orden = ref("precio-asc");
const comentariosPorVendedor = reactive({});

const obtenerBandera = (idioma) => {
  const codigos = {
    ES: "es",
    EN: "gb",
    FR: "fr",
    DE: "de",
    IT: "it",
  };
  return codigos[idioma];
};

const opcionesCondicion = computed(() => [
  { title: t("infoEdicion.todas"), value: "" },
  { title: t("infoEdicion.condiciones.nuevo"), value: "NEW" },
  { title: t("infoEdicion.condiciones.seminuevo"), value: "LIKE NEW" },
  { title: t("infoEdicion.condiciones.bueno"), value: "GOOD" },
  { title: t("infoEdicion.condiciones.aceptable"), value: "ACCEPTABLE" },
  { title: t("infoEdicion.condiciones.malo"), value: "BAD" },
]);

const opcionesIdioma = computed(() => [
  { title: t("infoEdicion.todos"), value: "" },
  { title: "ES", value: "ES" },
  { title: "EN", value: "EN" },
  { title: "FR", value: "FR" },
  { title: "DE", value: "DE" },
  { title: "IT", value: "IT" },
]);

const opcionesOrden = computed(() => [
  { title: t("infoEdicion.orden.masReciente"), value: "reciente" },
  { title: t("infoEdicion.orden.precioAscendente"), value: "precio-asc" },
  { title: t("infoEdicion.orden.precioDescendente"), value: "precio-desc" },
]);

const headers = computed(() => [
  {
    title: t("infoEdicion.headers.vendedor"),
    value: "vendedor",
    align: "center",
  },
  { title: t("infoEdicion.headers.precio"), value: "price", align: "center" },
  {
    title: t("infoEdicion.headers.comentario"),
    value: "comment",
    align: "center",
  },
]);

const siglasCondicion = (c) =>
  ({
    NEW: "N",
    "LIKE NEW": "SN",
    GOOD: "B",
    ACCEPTABLE: "A",
    BAD: "M",
  }[c] || c);

const toggleWanted = async () => {
  if (!edicion.value?.id) return;
  const id = edicion.value.id;
  const esWanted = wants.is_wanted(id);
  esWanted ? await wants.remove_wanted(id) : await wants.add_wanted(id);
};

const añadirAlCarrito = async (oferta) => {
  if (!userStore.id) {
    router.push("/login");
    return;
  }
  try {
    await cartStore.addToCart(oferta.id);
    todasLasOfertas.value = todasLasOfertas.value.filter(
      (o) => o.id !== oferta.id
    );
  } catch (error) {
    console.error("[ERROR] No se pudo añadir al carrito:", error);
  }
};

const quitarDelCarrito = async (offerId) => {
  await cartStore.removeFromCart(offerId);

  // 🔄 Comprobar si corresponde a esta edición antes de añadirla
  const todas = await offerStore.getOffers();
  const ofertaDevuelta = todas.data.find((o) => o.id === offerId);

  if (ofertaDevuelta && ofertaDevuelta.data.edition_id === edicion.value?.id) {
    try {
      const user = await userStore.fetchUserById(ofertaDevuelta.data.seller_id);
      ofertaDevuelta.vendedor = user.data.nickname || "Usuario";
    } catch (error) {
      console.error("[ERROR] No se pudo recuperar el vendedor: ", error);
      ofertaDevuelta.vendedor = "Usuario";
    }
    // Añadirla si corresponde a la edición actual
    todasLasOfertas.value.push(ofertaDevuelta);
    todasLasOfertas.value = [...todasLasOfertas.value];

    // Ordenar si hace falta
    if (orden.value === "precio-asc") {
      todasLasOfertas.value.sort((a, b) => a.data.price - b.data.price);
    } else if (orden.value === "precio-desc") {
      todasLasOfertas.value.sort((a, b) => b.data.price - a.data.price);
    } else if (orden.value === "reciente") {
      todasLasOfertas.value.sort(
        (a, b) =>
          (b.data.publication_date?.seconds || 0) -
          (a.data.publication_date?.seconds || 0)
      );
    }
  }
};

const abrirChatConVendedor = async (oferta) => {
  if (!userStore.id) {
    router.push("/login");
    return;
  }
  const buyerId = userStore.id;
  const sellerId = oferta.data.seller_id;
  const offerId = oferta.id;

  try {
    const chatId = await getOrCreateChat(buyerId, sellerId, offerId);
    router.push(`/chat/${chatId}`);
  } catch (e) {
    console.error("Error al abrir chat:", e);
  }
};

const obtenerLibroAsociado = async (bookId) => {
  if (!bookId) return null;
  const libros = await bookStore.getBooks();
  return libros.data.find((b) => b.id === bookId);
};

const usuariosMapeados = ref({});

const ofertasFiltradas = computed(() => {
  let resultado = [...todasLasOfertas.value];

  resultado = resultado.filter(
    (o) => o.data.seller_id !== userStore.id && o.data.status === "ACTIVE"
  );

  if (filtroCondicion.value) {
    resultado = resultado.filter(
      (o) => o.data.condition === filtroCondicion.value
    );
  }
  if (filtroIdioma.value) {
    resultado = resultado.filter((o) => o.data.language === filtroIdioma.value);
  }

  if (orden.value === "precio-asc") {
    resultado.sort((a, b) => a.data.price - b.data.price);
  } else if (orden.value === "precio-desc") {
    resultado.sort((a, b) => b.data.price - a.data.price);
  } else if (orden.value === "reciente") {
    resultado.sort(
      (a, b) =>
        b.data.publication_date?.seconds - a.data.publication_date?.seconds
    );
  }

  return resultado;
});

async function cargarOfertas() {
  const resultado = await offerStore.getOffersForEditionFiltered(
    edicion.value.id
  );

  todasLasOfertas.value = [];

  todasLasOfertas.value = resultado.data;

  console.log("Ofertas obtenidas: ", todasLasOfertas.value);

  for (const oferta of todasLasOfertas.value) {
    const sellerId = oferta.data.seller_id;
    let nickname = t("infoEdicion.usuario");

    if (!usuariosMapeados.value[sellerId]) {
      const user = await userStore.fetchUserById(sellerId);
      nickname = user?.data?.nickname || t("infoEdicion.usuario");
      usuariosMapeados.value[sellerId] = nickname;
    }

    oferta.vendedor = usuariosMapeados.value[sellerId];
  }
}

async function cargarComentariosVendedores() {
  for (const key in comentariosPorVendedor) {
    delete comentariosPorVendedor[key];
  }

  const result = await orderStore.getOrders();
  if (result.result !== "SUCCESS") {
    console.error("No se pudieron obtener los comentarios");
    return;
  }

  result.data.forEach((order) => {
    if (!comentariosPorVendedor[order.seller_id]) {
      comentariosPorVendedor[order.seller_id] = {
        comentarios: [],
        totalRating: 0,
        count: 0,
      };
    }

    if (order.comment && order.comment.trim() !== "") {
      comentariosPorVendedor[order.seller_id].comentarios.push({
        id: order.id,
        comment: order.comment,
        buyer_name: order.buyer_name,
      });
    }

    if (typeof order.user_rating === "number") {
      comentariosPorVendedor[order.seller_id].totalRating += order.user_rating;
      comentariosPorVendedor[order.seller_id].count += 1;
    }
  });

  console.log("Comentarios y ratings obtenidos: ", comentariosPorVendedor);
}

onMounted(async () => {
  const id = route.params.id;

  edicion.value = (await editionStore.getEditions()).data.find(
    (e) => e.id === id
  );

  libro.value = await obtenerLibroAsociado(edicion.value?.data?.book_id);

  wants.init();

  await cargarOfertas();

  await cargarComentariosVendedores();

  setInterval(async () => {
    await cargarOfertas();
    await cargarComentariosVendedores();
  }, 10000);
});
</script>

<style scoped>
.solo-encabezado :deep(thead) {
  background-color: #2c3e50 !important;
}

.solo-encabezado :deep(th) {
  color: white !important;
  font-weight: bold;
  text-align: center !important;
}

/* 🎯 CUERPO tbody */
.solo-encabezado :deep(tbody tr) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

.solo-encabezado :deep(tbody td) {
  text-align: center;
}

/* 🎯 FOOTER */
.solo-encabezado :deep(tfoot),
.solo-encabezado :deep(.v-data-footer),
.solo-encabezado :deep(.v-data-table-footer) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

/* 🎯 Menú, listas y selects */
.solo-encabezado :deep(.v-overlay__content),
.solo-encabezado :deep(.v-list),
.solo-encabezado :deep(.v-menu__content),
.solo-encabezado :deep(.v-list-item-title),
.solo-encabezado :deep(.v-select),
.solo-encabezado :deep(.v-field) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

/* 🎯 Scroll */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}

.card {
  position: relative;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: var(--color-background);
  color: var(--color-text);
}

h2 {
  font-weight: bold;
  margin-bottom: 10px;
}

h3 {
  font-weight: bold;
  margin-top: 30px;
  text-align: center;
  font-size: 28px;
}

.texto {
  margin-bottom: 2%;
}

.v-table thead {
  background-color: #2c3e50;
  color: white;
}

.v-table tbody tr:nth-child(odd) {
  background-color: #f9f9f9;
}

.comentario {
  display: flex;
  align-items: center;
}

.comentario .bandera {
  margin-left: 8px;
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.estado-cuadrado {
  display: flex;
  justify-content: center;
  border: 4px;
  /* Borde del cuadrado */
  border-radius: 4px;
  /* Bordes ligeramente redondeados si lo deseas */
  text-align: center;
  font-size: 10px;
  font-weight: bolder;
  width: 40px;
  height: 20px;
  color: white;
  padding-top: 3px;
  margin-right: 10px;
}

.estado-cuadrado.N {
  background-color: green;
  /* Fondo para 'Nuevo' */
}

.estado-cuadrado.SN {
  background-color: orange;
  /* Fondo para 'SemiNuevo' */
}

.estado-cuadrado.B {
  background-color: #150dff;
  /* Fondo para 'Bueno' */
}

.estado-cuadrado.A {
  background-color: rgb(192, 192, 34);
  /* Fondo para 'Aceptable' */
}

.estado-cuadrado.M {
  background-color: red;
  /* Fondo para 'Malo' */
}

.custom-tooltip {
  background-color: #ffffff !important;
  color: #1e1e1e;
  border-radius: 8px;
  padding: 8px;
  max-width: 250px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
}

.tooltip-contenedor {
  font-size: 0.95rem;
}

.tooltip-rating {
  display: flex;
  align-items: center;
  margin: 4px 0;
}

.tooltip-rating span:last-child {
  margin-left: 4px;
  font-weight: bold;
}

.tooltip-comentario {
  margin: 4px 0;
  font-size: 0.85rem;
}

.tooltip-sin-comentarios {
  margin-top: 4px;
  font-style: italic;
}
</style>
