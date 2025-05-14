<template>
  <div class="header-skip"></div>
  <div class="order-container">
    <h2 class="section-title">📦 {{ $t("verPedido.titulo") }}</h2>

    <div class="panel">
      <h3 class="panel-title">🧾 {{ $t("verPedido.detalles") }}</h3>

      <div class="panel-row">
        <span class="label">#️⃣ {{ $t("verPedido.numero") }}:</span>
        <span class="value">{{ order.orderNumber }}</span>
      </div>

      <div class="panel-row">
        <span class="label">👤 {{ $t("verPedido.vendedor") }}:</span>
        <Button @click="$router.push(`/perfil/${order.sellerId}`)">{{
          order.sellerName
        }}</Button>
      </div>

      <div class="panel-row">
        <span class="label">🏠 {{ $t("verPedido.direccion") }}:</span>
        <span class="value"
          >{{ order.shippingAddress?.direccion }},
          {{ order.shippingAddress?.ciudad }},
          {{ order.shippingAddress?.provincia }}</span
        >
      </div>

      <div class="panel-row">
        <span class="label">📝 {{ $t("verPedido.comentario") }}:</span>
        <span class="value italic">"{{ order.comment }}"</span>
      </div>

      <div class="panel-row status-row">
        <span class="label">🔄 {{ $t("verPedido.estado") }}:</span>
        <span>{{
          order.status === "PAID"
            ? $t("verPedido.pendiente")
            : order.status === "SHIPPED"
            ? $t("verPedido.enviado")
            : order.status === "ARRIVED"
            ? $t("verPedido.completado")
            : order.status
        }}</span>
      </div>
    </div>

    <div class="panel">
      <h3 class="panel-title">📚 {{ $t("verPedido.articulos") }}</h3>

      <table class="book-table">
        <thead>
          <tr>
            <th>{{ $t("verPedido.portada") }}</th>
            <th>{{ $t("verPedido.tituloTabla") }}</th>
            <th>{{ $t("verPedido.tipo") }}</th>
            <th>{{ $t("verPedido.condicion") }}</th>
            <th>Editorial</th>
            <th>{{ $t("verPedido.precio") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in order.books" :key="index">
            <td><img :src="book.image" alt="Portada" class="book-cover" /></td>
            <td>{{ book.title }}</td>
            <td>{{ book.type }}</td>
            <td>{{ book.condition }}</td>
            <td>{{ book.editorial }}</td>
            <td class="price">{{ book.price }} €</td>
          </tr>
        </tbody>
      </table>

      <div class="panel-row">
        <span class="label">{{ $t("verPedido.precioEnvio") }}:</span>
        <span class="value price">{{ order.shippingCost }} €</span>
      </div>
      <div class="panel-row">
        <span class="label">{{ $t("verPedido.precioTotal") }}:</span>
        <span class="value price">{{ order.totalPrice }} €</span>
      </div>
    </div>

    <div class="help-section">
      <p>{{ $t("verPedido.preguntaProblema") }}</p>
      <button @click="$router.push(`/contacto`)" class="help-button">
        {{ $t("verPedido.necesitoAyuda") }}
      </button>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import { useOrderStore } from "@/stores/order_store";
import { useOfferStore } from "@/stores/offer_store";
import { useEditionStore } from "@/stores/edition_store";
import { useUserStore } from "@/stores/user_store";

export default {
  name: "GestionarPedido",
  setup() {
    const route = useRoute();
    const orderStore = useOrderStore();
    const offerStore = useOfferStore();
    const editionStore = useEditionStore();
    const userStore = useUserStore();
    const router = useRouter();
    const order = ref({
      orderNumber: "",
      sellerName: "",
      shippingAddress: "",
      comment: "",
      status: "",
      totalPrice: 0,
      shippingCost: 0,
      books: [],
      sellerId: "",
    });

    onMounted(async () => {
      const orderId = route.params.id;
      const response = await orderStore.getOrder(orderId);

      if (response?.result === "SUCCESS") {
        if (response.data.buyer_id !== userStore.id) {
          router.push("/");
        }

        const orderData = response.data;

        const offers = [];
        for (const offerId of orderData.offer_ids) {
          const offerResponse = await offerStore.getOffer(offerId);
          if (offerResponse?.result === "SUCCESS") {
            offers.push(offerResponse.data);
          } else {
            console.warn(`❌ Offer ${offerId} not found`);
          }
        }

        await editionStore.fetchEditions();
        console.log("Available editions:", editionStore.editions);

        const bookList = offers.map((offer) => {
          const editionId = offer.data?.edition_id;
          console.log("Offer edition_id:", editionId);
          const edition = editionStore.editions.find((e) => e.id === editionId);
          console.log("Edition found:", edition);

          return {
            title:
              edition?.data?.book_title ||
              offer.data?.edition_book_name ||
              "Título desconocido",
            image: edition?.data?.image || "placeholder.jpg",
            price: offer?.data?.price || 0,
            language: offer?.data?.language || "",
            condition: offer?.data?.condition || "",
            type: edition?.data?.type || "",
            editorial: edition?.data?.editorial || "",
          };
        });

        order.value = {
          orderNumber: orderData.id,
          sellerName: orderData.seller_name || "—",
          shippingAddress: orderData.shipping_address || "—",
          comment: orderData.comment || "",
          status: orderData.status || "Pendiente",
          totalPrice: orderData.total_price || 0,
          shippingCost: orderData.shipping_cost || 0,
          offers: orderData.offer_ids,
          books: bookList,
          sellerId: orderData.seller_id,
        };

        console.log("📦 Orden cargada:", order.value);
      } else {
        console.error("❌ Error al cargar la orden:", response?.message);
      }
    });

    return {
      order,
    };
  },
};
</script>

<style scoped>
.header-skip {
  height: 40px;
}

.order-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #34495e;
}

.panel {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
}

.panel-title {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: #2c3e50;
}

.panel-row {
  margin-bottom: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
}

.label {
  font-weight: bold;
  width: 150px;
  color: #2c3e50;
}

.value {
  color: #34495e;
  flex: 1;
}

.italic {
  font-style: italic;
  color: #7f8c8d;
}

.price {
  color: #27ae60;
  font-weight: bold;
}

.status-select {
  padding: 6px 12px;
  border: 1px solid #bdc3c7;
  border-radius: 4px;
  font-size: 1rem;
  background-color: #f9f9f9;
  color: #2c3e50;
  cursor: pointer;
  outline: none;
}

.status-row {
  align-items: center;
  gap: 10px;
}

.confirm-button {
  background-color: #2ecc71;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.3s;
}

.confirm-button:hover {
  background-color: #27ae60;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fdfdfd;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 4px solid #2980b9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.book-cover {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.book-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.book-table thead {
  background-color: #ecf0f1;
}

.book-table th,
.book-table td {
  padding: 12px 10px;
  text-align: left;
  font-size: 0.95rem;
  color: #34495e;
}

.book-table th {
  font-weight: bold;
  color: #ffffff;
}

.book-table td {
  vertical-align: middle;
}

.book-cover {
  width: 50px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.book-table .price {
  color: #27ae60;
  font-weight: bold;
}

/* 🌙 Soporte para modo oscuro */
html[data-theme="dark"] .order-container {
  background: var(--color-background-soft);
  color: var(--color-text);
}

html[data-theme="dark"] .section-title,
html[data-theme="dark"] .panel-title,
html[data-theme="dark"] .label {
  color: var(--color-heading);
}

html[data-theme="dark"] .panel {
  background: #1e1e1e;
  border-left: 4px solid var(--color-heading);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

html[data-theme="dark"] .value {
  color: var(--color-text);
}

html[data-theme="dark"] .italic {
  color: #cccccc;
}

html[data-theme="dark"] .status-select {
  background-color: #2c2c2c;
  color: white;
  border: 1px solid #555;
}

html[data-theme="dark"] .confirm-button {
  background-color: #27ae60;
  color: white;
}

html[data-theme="dark"] .confirm-button:hover {
  background-color: #1f8f4d;
}

html[data-theme="dark"] .book-item {
  background: #2a2a2a;
  border-left: 4px solid #3498db;
  color: white;
}

.help-section {
  text-align: center;
  margin-top: 30px;
  color: #7f8c8d;
}

.help-button {
  background-color: #e67e22;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-weight: 500;
  margin-top: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.help-button:hover {
  background-color: #d35400;
}
</style>
