<template>
  <div class="checkout-container" v-if="carrito.length > 0">
    <!-- Columna izquierda -->
    <div class="carrito-resumen">
      <div class="checkout-volver">
        <v-btn
          class="boton-inicio-rojo"
          color="red"
          variant="text"
          @click="mostrarDialogoVaciar = true"
        >
          {{ $t("carrito.vaciarCarrito") }}
        </v-btn>
      </div>

      <h2 class="titulo-resumen">{{ $t("carrito.resumen") }}</h2>
      <v-progress-circular
        v-if="cargandoCarrito"
        indeterminate
        color="primary"
        class="mb-4"
      />
      <div v-else>
        <div v-for="(item, index) in carrito" :key="index" class="item-carrito">
          <div style="position: relative">
            <img class="carrito-imagen" :src="item.image" />
            <v-chip v-if="item.edition" class="edition-number">
              {{ item.edition }}ª ed
            </v-chip>
          </div>
          <div class="carrito-info">
            <p>
              <strong>{{ item.edition_book_name }}</strong>
            </p>
            <p>
              {{ $t(`carrito.${item.condition}`) }} · {{ item.language }} ·
              {{ item.price }} €
            </p>
            <p class="vendedor">
              {{ $t("carrito.vendedor") }}: {{ item.seller_name }}
            </p>
          </div>
          <hr />
        </div>
      </div>
    </div>

    <!-- Botón Vaciar Carrito -->
    <div class="checkout-box">
      <div class="steps-header">
        <span :class="{ active: step === 1 }"
          >1 {{ $t("carrito.datosPersonales") }}</span
        >
        <span :class="{ active: step === 2 }">2 {{ $t("carrito.envio") }}</span>
        <span :class="{ active: step === 3 }">3 {{ $t("carrito.pago") }}</span>
      </div>

      <!-- Paso 1: Datos personales -->
      <div v-if="step === 1" class="step-section">
        <h2>{{ $t("carrito.datosCliente") }}</h2>
        <p>{{ $t("carrito.introduceDatos") }}</p>

        <div class="form-row">
          <v-text-field
            v-model="datos.nombre"
            :label="$t('carrito.nombre')"
            variant="solo"
            class="input rounded"
            :error="errors.nombre"
            :error-messages="errors.nombre ? 'Campo obligatorio' : ''"
          />
          <v-text-field
            v-model="datos.apellidos"
            :label="$t('carrito.apellidos')"
            variant="solo"
            class="input rounded"
            :error="errors.apellidos"
            :error-messages="errors.apellidos ? 'Campo obligatorio' : ''"
          />
        </div>

        <div class="form-row">
          <v-text-field
            v-model="datos.email"
            :label="$t('carrito.email')"
            variant="solo"
            class="input rounded"
            :error="touched.email && !!errors.email"
            :error-messages="touched.email ? errors.email : ''"
          />

          <v-text-field
            v-model="datos.repetirEmail"
            :label="$t('carrito.repetirEmail')"
            variant="solo"
            class="input rounded"
            :error="touched.repetirEmail && !!errors.repetirEmail"
            :error-messages="touched.repetirEmail ? errors.repetirEmail : ''"
          />
        </div>

        <div class="form-row">
          <v-text-field
            :label="$t('carrito.prefijo')"
            variant="solo"
            class="input short rounded"
            value="+34"
            readonly
          />
          <v-text-field
            v-model="datos.telefono"
            :label="$t('carrito.telefono')"
            variant="solo"
            class="input rounded"
            :error="touched.telefono && !!errors.telefono"
            :error-messages="touched.telefono ? errors.telefono : ''"
          />
        </div>

        <div class="btn-continuar">
          <v-btn variant="text" @click="validarPaso1">{{
            $t("carrito.continuar")
          }}</v-btn>
        </div>
      </div>

      <!-- Paso 2: Envío -->
      <div v-if="step === 2" class="step-section">
        <h2>{{ $t("carrito.dondeRecibir") }}</h2>

        <div class="cards-envio">
          <div
            class="envio-card"
            :class="{ selected: datos.metodoEnvio === 'domicilio' }"
            @click="datos.metodoEnvio = 'domicilio'"
          >
            <v-icon size="36" class="thin-icon">mdi-home-outline</v-icon>
            <h3>{{ $t("carrito.envioDomicilio") }}</h3>
            <p>{{ $t("carrito.entregaDireccion") }}</p>
          </div>

          <div
            class="envio-card"
            :class="{ selected: datos.metodoEnvio === 'punto' }"
            @click="datos.metodoEnvio = 'punto'"
          >
            <v-icon size="36" class="thin-icon">mdi-map-marker-outline</v-icon>
            <h3>{{ $t("carrito.puntoRecogida") }}</h3>
            <p>{{ $t("carrito.recogerPedido") }}</p>
          </div>
        </div>

        <div v-if="datos.metodoEnvio" class="form-direccion">
          <h2>{{ $t("carrito.datosEnvio") }}</h2>
          <div class="form-row2">
            <v-text-field
              :label="$t('carrito.direccion')"
              v-model="datos.direccion"
              class="rounded flex-grow"
              variant="solo"
            />
            <v-text-field
              :label="$t('carrito.masInfo')"
              class="rounded flex-grow"
              variant="solo"
            />
          </div>
          <div class="form-row2">
            <v-text-field
              v-model="datos.cp"
              :label="$t('carrito.codigoPostal')"
              class="rounded short"
              variant="solo"
              :error="touched.cp && !!errors.cp"
              :error-messages="touched.cp ? errors.cp : ''"
            />

            <v-text-field
              :label="$t('carrito.ciudad')"
              v-model="datos.ciudad"
              variant="solo"
              class="rounded"
            />
            <v-combobox
              v-model="datos.provincia"
              :items="provincias"
              :label="$t('carrito.provincia')"
              variant="solo"
              class="rounded"
              :error="touched.provincia && !datos.provincia"
              :error-messages="
                touched.provincia && !datos.provincia
                  ? t('carrito.campoObligatorio')
                  : ''
              "
            />
            <v-text-field
              :label="$t('carrito.pais')"
              value="España"
              readonly
              class="rounded shorter"
              variant="solo"
            />
          </div>
        </div>

        <div class="btns">
          <v-btn variant="text" @click="step--">{{
            $t("carrito.volver")
          }}</v-btn>
          <v-btn variant="text" @click="validarPaso2">{{
            $t("carrito.continuar")
          }}</v-btn>
        </div>
      </div>

      <!-- Paso 3: Pago -->
      <div v-if="step === 3" class="step-section">
        <!-- barra superior de carga -->
        <v-progress-linear
          v-if="cargando"
          indeterminate
          color="primary"
          class="mb-4"
        ></v-progress-linear>

        <h2>{{ $t("carrito.finalizarCompra") }}</h2>
        <p>
          {{ $t("carrito.revisaDatos") }}
        </p>

        <div class="resumen-final">
          <p>
            <strong>{{ $t("carrito.nombre") }}:</strong> {{ datos.nombre }}
            {{ datos.apellidos }}
          </p>
          <p>
            <strong>{{ $t("carrito.email") }}:</strong> {{ datos.email }}
          </p>
          <p>
            <strong>{{ $t("carrito.telefono") }}:</strong> {{ datos.telefono }}
          </p>
          <p>
            <strong>{{ $t("carrito.direccion") }}:</strong> {{ datos.direccion
            }}{{ datos.infoExtra ? ", " + datos.infoExtra : "" }},
            {{ datos.cp }} - {{ datos.ciudad }} ({{ datos.provincia }})
          </p>
        </div>

        <!-- mensaje de carga o éxito -->
        <div v-if="mensajePago" class="mensaje-pago">
          {{ mensajePago }}
        </div>

        <div
          class="btns-final"
          v-if="
            !cargando &&
            mensajePago !== 'Gracias por comprar con nosotros. Pago exitoso'
          "
        >
          <v-btn variant="text" @click="step--">{{
            $t("carrito.atras")
          }}</v-btn>
          <v-btn variant="text" @click="realizarPago">{{
            $t("carrito.realizarPago")
          }}</v-btn>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="carrito-vacio-container">
    <div>
      <p class="carrito-vacio">
        <strong>{{ $t("carrito.vacio") }}</strong>
      </p>
      <div class="checkout-volver">
        <v-btn
          class="boton-inicio-azul"
          variant="text"
          @click="$router.push('/')"
        >
          {{ $t("carrito.irAComprar") }}
        </v-btn>
      </div>
    </div>
  </div>
  <!-- Botón para volver al inicio -->
  <!-- <div class="checkout-volver" v-if="mensajePago.includes('Pago exitoso')">
    <v-btn class="boton-inicio" variant="text" @click="$router.push('/')">
      Volver al inicio
    </v-btn>
  </div> -->
  <!-- <div class="checkout-volver">
    <v-btn class="boton-inicio" color="orange" variant="text" @click="reactivarOfertasInactivas">
      Reactivar todas las ofertas inactivas
    </v-btn>
  </div> -->
  <!-- <v-btn variant="text" color="red" @click="vaciarYRecargarTodo">
    Vaciar store y recargar ofertas
  </v-btn>
 -->

  <v-dialog v-model="mostrarDialogoVaciar" width="500">
    <v-card>
      <v-card-title class="headline">{{ $t("carrito.vaciar") }}</v-card-title>
      <!-- Azul -->
      <v-card-text>
        {{ $t("carrito.vaciarSeguro") }}
      </v-card-text>
      <v-card-actions class="botones-modal">
        <v-btn variant="text" @click="mostrarDialogoVaciar = false">{{
          $t("carrito.cancelar")
        }}</v-btn>
        <v-spacer></v-spacer>
        <v-btn
          variant="text"
          class="boton-vaciar-modal"
          @click="vaciarCarritoConfirmado"
          >{{ $t("carrito.vaciar") }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useCartStore } from "@/stores/cart_store";
import { useUserStore } from "@/stores/user_store";
import { useEditionStore } from "@/stores/edition_store";
import { useOfferStore } from "@/stores/offer_store";
import { useI18n } from "vue-i18n";

const editionStore = useEditionStore();
const userStore = useUserStore();
const offerStore = useOfferStore();
const cartStore = useCartStore();
const { t } = useI18n();

const carrito = ref([]);
const cargando = ref(false);
const cargandoCarrito = ref(true);
const mensajePago = ref("");
const step = ref(1);

/* async function reactivarOfertasInactivas() {
  await offerStore.fetchOffers();
  const inactivas = offerStore.offers.filter(o => o.data.status !== 'ACTIVE');
  for (const oferta of inactivas) {
    await offerStore.updateOffer(oferta.id, 'ACTIVE');
  }
  await offerStore.fetchOffers();
  alert(` Se reactivaron ${inactivas.length} ofertas.`);
} */

/* async function vaciarYRecargarTodo() {
  cartStore.cart = [];
  localStorage.setItem('cart', JSON.stringify({ cart: [] }));
  await offerStore.fetchOffers();
  alert("Store del carrito vaciado y ofertas recargadas.");
} */

const datos = ref({
  nombre: "",
  apellidos: "",
  email: "",
  repetirEmail: "",
  telefono: "",
  direccion: "",
  cp: "",
  ciudad: "",
  provincia: "",
  metodoEnvio: "",
});

const errors = ref({
  nombre: false,
  apellidos: false,
  email: "",
  repetirEmail: "",
  telefono: "",
  direccion: false,
  cp: false,
  ciudad: false,
  provincia: false,
});

const provincias = [
  "Álava",
  "Albacete",
  "Alicante",
  "Almería",
  "Asturias",
  "Ávila",
  "Badajoz",
  "Barcelona",
  "Burgos",
  "Cáceres",
  "Cádiz",
  "Cantabria",
  "Castellón",
  "Ciudad Real",
  "Córdoba",
  "Cuenca",
  "Gerona",
  "Granada",
  "Guadalajara",
  "Guipúzcoa",
  "Huelva",
  "Huesca",
  "Islas Baleares",
  "Jaén",
  "La Coruña",
  "La Rioja",
  "Las Palmas",
  "León",
  "Lérida",
  "Lugo",
  "Madrid",
  "Málaga",
  "Murcia",
  "Navarra",
  "Orense",
  "Palencia",
  "Pontevedra",
  "Salamanca",
  "Santa Cruz de Tenerife",
  "Segovia",
  "Sevilla",
  "Soria",
  "Tarragona",
  "Teruel",
  "Toledo",
  "Valencia",
  "Valladolid",
  "Vizcaya",
  "Zamora",
  "Zaragoza",
];

const touched = ref({
  email: false,
  repetirEmail: false,
  telefono: false,
});

onMounted(async () => {
  const items = await cartStore.getCartItems();
  await editionStore.fetchEditions(); // asegúrate de tenerlas cargadas

  const enrichedItems = await Promise.all(
    items.map(async (item) => {
      const { id, data } = item;
      const user = await userStore.fetchUserById(data.seller_id);
      const edition = editionStore.editions.find(
        (e) => e.id === data.edition_id
      );

      return {
        id,
        edition_book_name: data.edition_book_name,
        condition: data.condition,
        language: data.language,
        price: data.price,
        seller_name: user?.data?.nickname || "Usuario",
        image: edition?.data.image || "",
        edition: edition?.data.edition,
      };
    })
  );

  carrito.value = enrichedItems;
  cargandoCarrito.value = false;
});

const mostrarDialogoVaciar = ref(false);
const vaciarCarritoConfirmado = async () => {
  mostrarDialogoVaciar.value = false;
  await vaciarCarritoManual(); // ya la tienes definida
};

async function vaciarCarritoManual() {
  for (const item of carrito.value) {
    const offerId = item.id;

    try {
      await cartStore.removeFromCart(offerId);
    } catch (error) {
      console.error(" Error al quitar oferta del carrito:", offerId, error);
    }
  }

  // Limpiar referencias locales
  cartStore.cart = [];
  localStorage.setItem("cart", JSON.stringify({ cart: [] }));
  carrito.value = [];

  await offerStore.fetchOffers();
}

function validarPaso1() {
  // Marcar como tocado todos los campos críticos al pulsar continuar
  touched.value.email = true;
  touched.value.repetirEmail = true;
  touched.value.telefono = true;

  let valido = true;
  errors.value.nombre = !datos.value.nombre;
  errors.value.apellidos = !datos.value.apellidos;
  errors.value.email = "";
  errors.value.repetirEmail = "";
  errors.value.telefono = "";

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!datos.value.email || !emailRegex.test(datos.value.email)) {
    errors.value.email = "Introduce un email válido";
    valido = false;
  }
  if (datos.value.repetirEmail !== datos.value.email) {
    errors.value.repetirEmail = "Los correos no coinciden";
    valido = false;
  }
  if (!/^\d{9}$/.test(datos.value.telefono)) {
    errors.value.telefono = "Introduce un teléfono válido";
    valido = false;
  }

  if (!datos.value.nombre || !datos.value.apellidos) {
    valido = false;
  }

  if (valido) step.value++;
}

touched.value.provincia = false;
touched.value.cp = false;

function validarPaso2() {
  let valido = true;
  errors.value.direccion = !datos.value.direccion;
  errors.value.cp = !datos.value.cp;
  errors.value.ciudad = !datos.value.ciudad;
  errors.value.provincia = !datos.value.provincia;
  touched.value.cp = true;
  touched.value.provincia = true;
  errors.value.cp = "";

  if (
    !datos.value.metodoEnvio ||
    errors.value.direccion ||
    errors.value.cp ||
    errors.value.ciudad ||
    errors.value.provincia
  ) {
    valido = false;
  }
  if (!/^\d{5}$/.test(datos.value.cp)) {
    errors.value.cp = "Introduce un código postal válido";
    valido = false;
  }

  if (valido) step.value++;
}

async function realizarPago() {
  cargando.value = true;
  mensajePago.value = "Estamos procesando su operación...";

  // Esperamos para simular proceso
  await new Promise((resolve) => setTimeout(resolve, 1000));

  userStore.telefono = datos.value.telefono;
  userStore.direccion = {
    direccion: datos.value.direccion,
    cp: datos.value.cp,
    ciudad: datos.value.ciudad,
    provincia: datos.value.provincia,
  };

  await userStore.editUserInDatabase();

  const result = await cartStore.buyCart();

  cargando.value = false;

  if (result.result === "SUCCESS") {
    mensajePago.value = "Gracias por comprar con nosotros. Pago exitoso";
    carrito.value = [];
  } else {
    mensajePago.value = "Hubo un error al procesar el pago: " + result.message;
  }
}
</script>

<style scoped>
/* ╔══════════════════════════════╗
   ║ 1. COLORES DE BOTONES        ║
   ╚══════════════════════════════╝ */

/* 🔴 Botón "Vaciar carrito" */
.boton-inicio-rojo {
  color: #e53935 !important;
  font-weight: bold;
  text-transform: uppercase;
}

/* 🔵 Botón "Ir a comprar" */
.boton-inicio-azul {
  color: #2c3e50 !important;
  font-weight: bold;
}

/* ╔══════════════════════════════╗
   ║ 2. CONTENEDORES Y LAYOUT     ║
   ╚══════════════════════════════╝ */

.checkout-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 32px;
  padding: 40px 20px;
  min-height: 0vh;
}

.checkout-volver {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.carrito-vacio-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
}

/* ╔══════════════════════════════╗
   ║ 3. CAJAS Y TARJETAS          ║
   ╚══════════════════════════════╝ */

.carrito-resumen {
  width: 500px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  padding: 30px 24px;
  margin-right: 32px;
  height: fit-content;
  max-height: 90vh;
  overflow-y: auto;
}

.checkout-box {
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  padding: 30px 40px;
}

.resumen-final {
  background-color: #f8f9fa;
  padding: 24px;
  border-radius: 12px;
  margin: 20px 0;
  font-size: 16px;
  line-height: 1.8;
}

.resumen-final p {
  margin: 6px 0;
}

/* ╔══════════════════════════════╗
   ║ 4. TEXTOS Y CABECERAS        ║
   ╚══════════════════════════════╝ */

.titulo-resumen {
  margin-bottom: 4%;
  text-align: center;
}

.carrito-vacio {
  font-size: 1rem;
  color: #2c3e50;
  text-align: center;
}

.step-section h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 12px;
}

.step-section p {
  color: #555;
  margin-bottom: 24px;
}

.steps-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  margin-bottom: 40px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.steps-header span {
  flex: 1;
  text-align: center;
  opacity: 0.4;
  transition: 0.3s;
}

.steps-header .active {
  opacity: 1;
  border-bottom: 3px solid #2c3e50;
}

/* ╔══════════════════════════════╗
   ║ 5. ELEMENTOS DEL CARRITO     ║
   ╚══════════════════════════════╝ */

.item-carrito {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.carrito-imagen {
  width: 80px;
  height: auto;
  border-radius: 8px;
  object-fit: cover;
}

.carrito-info {
  flex: 1;
}

.carrito-info p:first-child {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.vendedor {
  font-size: 0.9em;
  color: #666;
}

/* ╔══════════════════════════════╗
   ║ 6. FORMULARIOS Y CAMPOS      ║
   ╚══════════════════════════════╝ */

.form-row,
.form-row2 {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.input {
  flex: 1;
}

.input.short {
  max-width: 100px;
}

.short {
  max-width: 160px;
}

.shorter {
  max-width: 120px;
}

.rounded :deep(.v-input__control) {
  border-radius: 16px !important;
}

.flex-grow {
  flex: 1;
}

.form-direccion {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 20px;
}

/* ╔══════════════════════════════╗
   ║ 7. BOTONES                   ║
   ╚══════════════════════════════╝ */

.btn-continuar {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  color: #2c3e50;
}

.btns {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.btns-paso2 {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 20px;
}

.btns-final {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  color: #2c3e50;
}

.boton-atras {
  color: #2c3e50;
}

/* ╔══════════════════════════════╗
   ║ 8. TARJETAS DE ENVÍO         ║
   ╚══════════════════════════════╝ */

.cards-envio {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.envio-card {
  border: 1px solid #cfd8dc;
  border-radius: 12px;
  padding: 24px 20px;
  min-width: 220px;
  flex: 1;
  text-align: center;
  transition: all 0.2s ease-in-out;
  box-shadow: none;
  background-color: white;
}

.envio-card:hover {
  border-color: #2c3e50;
  background-color: #f9fbfc;
  cursor: pointer;
}

.envio-card.selected {
  border-color: #2c3e50;
  background: #e5f1ff;
}

/* ╔══════════════════════════════╗
   ║ 9. OTROS                     ║
   ╚══════════════════════════════╝ */

.thin-icon {
  color: #2c3e50;
  opacity: 0.8;
  margin-bottom: 8px;
}

.mensaje-pago {
  padding: 14px 20px;
  border-radius: 8px;
  text-align: center;
  margin-top: 16px;
  font-weight: 500;
  color: #2c3e50;
}
</style>

<!-- 🌙 Estilos modo oscuro SOLO para checkout -->
<style>
/* ╔══════════════════════════════╗
   ║ 1. CONTENEDORES Y ESTRUCTURA ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"] .checkout-container {
  background-color: transparent;
}

html[data-theme="dark"] .checkout-container .checkout-box,
html[data-theme="dark"] .checkout-container .carrito-resumen {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
  box-shadow: none !important;
}

/* ╔══════════════════════════════╗
   ║ 2. TEXTOS Y ETIQUETAS        ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"]
  .checkout-container
  :is(
    .titulo-resumen,
    .carrito-vacio,
    .mensaje-pago,
    .steps-header span,
    .steps-header .active,
    .step-section h2,
    .step-section p,
    .btn-continuar,
    .boton-atras,
    .thin-icon
  ) {
  color: var(--color-heading) !important;
}

html[data-theme="dark"] .checkout-container .steps-header {
  border-color: var(--color-border) !important;
}

/* ╔══════════════════════════════╗
   ║ 3. CARDS Y BLOQUES RESUMEN   ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"] .checkout-container .resumen-final {
  background-color: var(--color-background-mute) !important;
  color: var(--color-text) !important;
}

html[data-theme="dark"] .checkout-container .envio-card {
  background-color: var(--color-background) !important;
  color: var(--color-text) !important;
  border: 1px solid var(--color-border) !important;
}

html[data-theme="dark"] .checkout-container .envio-card.selected {
  background-color: rgba(33, 150, 243, 0.1) !important;
  border-color: #2196f3 !important;
}

html[data-theme="dark"] .checkout-container .item-carrito {
  border-bottom: 1px solid var(--color-border-hover);
}

html[data-theme="dark"] .checkout-container .vendedor {
  color: var(--color-text) !important;
}

/* ╔══════════════════════════════╗
   ║ 4. CAMPOS DE ENTRADA         ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"]
  .checkout-container
  .checkout-box
  :is(
    .v-field,
    .v-text-field,
    .v-combobox,
    .v-select,
    .v-input,
    .v-input__control
  ),
html[data-theme="dark"]
  .checkout-container
  .carrito-resumen
  :is(
    .v-field,
    .v-text-field,
    .v-combobox,
    .v-select,
    .v-input,
    .v-input__control
  ) {
  background-color: var(--color-background-mute) !important;
  color: var(--color-text) !important;
}

html[data-theme="dark"]
  .checkout-container
  .checkout-box
  :is(input, textarea, .v-label),
html[data-theme="dark"]
  .checkout-container
  .carrito-resumen
  :is(input, textarea, .v-label) {
  background-color: transparent !important;
  color: var(--color-text) !important;
}

html[data-theme="dark"] .checkout-container .checkout-box .v-field__input,
html[data-theme="dark"] .checkout-container .carrito-resumen .v-field__input {
  color: var(--color-text) !important;
  background-color: transparent !important;
}

html[data-theme="dark"] .checkout-container .checkout-box .v-field,
html[data-theme="dark"] .checkout-container .carrito-resumen .v-field {
  border-color: var(--color-border) !important;
}

/* ╔══════════════════════════════╗
   ║ 5. COMBOBOX / OVERLAY        ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"]
  .checkout-container
  :is(.v-overlay__content, .v-list, .v-list-item, .v-list-item-title) {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

html[data-theme="dark"] .checkout-container .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.08) !important;
}

/* 🔧 Overlay global fuera del scope (para combobox) */
html[data-theme="dark"] .v-overlay-container .v-list,
html[data-theme="dark"] .v-overlay-container .v-list-item,
html[data-theme="dark"] .v-overlay-container .v-list-item-title {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
}

html[data-theme="dark"] .v-overlay-container .v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05) !important;
}

html[data-theme="dark"] .v-overlay-container .v-overlay__content {
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05) !important;
  border-radius: 8px;
}

/* Scrollbar en overlay */
html[data-theme="dark"] .v-overlay-container ::-webkit-scrollbar {
  width: 8px;
}

html[data-theme="dark"] .v-overlay-container ::-webkit-scrollbar-track {
  background: transparent;
}

html[data-theme="dark"] .v-overlay-container ::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

html[data-theme="dark"] .v-overlay-container ::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

/* ╔══════════════════════════════╗
   ║ 6. BOTONES EN MODO OSCURO    ║
   ╚══════════════════════════════╝ */

/* 💙 Botones de texto visibles y consistentes */
html[data-theme="dark"] .checkout-container .v-btn.v-btn--variant-text {
  color: #64b5f6 !important;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: inherit;
  font-weight: 500;
  font-size: 0.875rem;
}

/* Estilos para el carrito vacío en modo oscuro */
html[data-theme="dark"] .carrito-vacio-container {
  background-color: var(--color-background);
}

html[data-theme="dark"] .carrito-vacio {
  color: var(--color-heading) !important;
}

html[data-theme="dark"] .checkout-container .v-btn.v-btn--variant-text:hover {
  color: #90caf9 !important;
  background-color: rgba(100, 181, 246, 0.1) !important;
}

/* ❤️ Restaurar botón "Vaciar carrito" en rojo */
html[data-theme="dark"]
  .checkout-container
  .v-btn.v-btn--variant-text.boton-inicio-rojo {
  color: #e53935 !important;
  font-weight: bold;
  text-transform: uppercase;
}

html[data-theme="dark"]
  .checkout-container
  .v-btn.v-btn--variant-text.boton-inicio-rojo:hover {
  color: #ef5350 !important;
  background-color: rgba(229, 57, 53, 0.08) !important;
}

/* 💡 Botón "Ir a comprar" visible también en modo oscuro */
html[data-theme="dark"] .carrito-vacio-container .boton-inicio-azul {
  color: #64b5f6 !important;
}

html[data-theme="dark"] .carrito-vacio-container .boton-inicio-azul:hover {
  color: #90caf9 !important;
  background-color: rgba(100, 181, 246, 0.1) !important;
}

.headline {
  color: #2c3e50;
  text-align: center;
}

.botones-modal {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  /* 👈 Esto separa los botones */
}

/* ╔══════════════════════════════╗
   ║ MODO OSCURO - MODAL VACIAR   ║
   ╚══════════════════════════════╝ */
html[data-theme="dark"] .v-dialog .v-card {
  background-color: var(--color-background-soft) !important;
  color: var(--color-text) !important;
  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

html[data-theme="dark"] .v-dialog .v-card-title {
  color: var(--color-heading) !important;
}

html[data-theme="dark"] .v-dialog .v-card-text {
  color: var(--color-text) !important;
}

html[data-theme="dark"] .v-dialog .v-btn.v-btn--variant-text {
  color: #64b5f6 !important;
}

html[data-theme="dark"] .v-dialog .v-btn.v-btn--variant-text:hover {
  background-color: rgba(100, 181, 246, 0.1) !important;
}

html[data-theme="dark"] .v-dialog .v-btn.v-btn--variant-text[color="red"] {
  color: #ef5350 !important;
}

html[data-theme="dark"]
  .v-dialog
  .v-btn.v-btn--variant-text[color="red"]:hover {
  background-color: rgba(239, 83, 80, 0.1) !important;
}

/* COLOR por defecto para modo claro */
.boton-vaciar-modal .v-btn__content {
  color: #e53935 !important;
}

/* COLOR por defecto para modo oscuro */
html[data-theme="dark"] .boton-vaciar-modal .v-btn__content {
  color: #ef5350 !important;
}

/* HOVER para ambos */
.boton-vaciar-modal:hover .v-btn__content {
  color: #ef5350 !important;
}

html[data-theme="dark"] .boton-vaciar-modal:hover .v-btn__content {
  color: #ff8a80 !important;
}

.edition-number {
  position: absolute;
  bottom: -5px;
  left: -10px;
  width: 30px;
  height: 20px;
  background-color: #1976d2;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px !important;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  padding: 0;
  line-height: 1;
}
</style>
