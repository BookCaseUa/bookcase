<template>
  <v-card class="assistant-card" elevation="6">
    <v-card-title class="assistant-header">
      {{ $t("asistente.titulo") }}
      <v-spacer />
      <v-btn variant="text" icon color="white" @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text class="assistant-body">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['assistant-message', msg.role]"
        style="white-space: pre-line"
      >
        <div v-html="msg.text"></div>
        <div v-if="msg.quickReplies" class="quick-replies">
          <v-btn
            v-for="(reply, i) in msg.quickReplies"
            :key="i"
            size="small"
            variant="outlined"
            class="quick-reply-btn"
            @click="sendQuickMessage(reply)"
          >
            {{ typeof reply === "string" ? reply : reply.label }}
          </v-btn>
        </div>
      </div>

      <!-- BLOQUE SELECCIÓN LIBROS -->
      <div v-if="availableEditionsList.length">
        <p style="margin-top: 12px; font-weight: bold">
          {{ $t("asistente.seleccionarLibro") }}
        </p>
        <v-checkbox
          v-for="edition in availableEditionsList"
          :key="edition.id"
          v-model="selectedEditions"
          :label="
            edition.title + ' (' + $t(`asistente.tipos.${edition.type}`) + ')'
          "
          :value="edition.id"
          hide-details
          density="compact"
        />
        <v-btn block color="primary" class="mb-2" @click="proceedToForm">{{
          $t("asistente.seleccionLibro")
        }}</v-btn>
        <v-btn block color="secondary" @click="cancelSelection">{{
          $t("asistente.cancelar")
        }}</v-btn>
      </div>

      <!-- BLOQUE FORMULARIOS POR EDICIÓN -->
      <div v-if="currentForms.length">
        <div
          v-for="(form, idx) in currentForms"
          :key="form.id"
          style="
            margin-bottom: 16px;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 8px;
          "
        >
          <p>
            <b>{{ form.title }}</b>
          </p>
          <v-radio-group
            v-model="form.state"
            :label="$t('asistente.estado')"
            :error-messages="form.errors.state ? [form.errors.state] : []"
          >
            <v-radio
              v-for="cond in bookConditions"
              :key="cond"
              :label="$t(`asistente.condiciones.${cond}`)"
              :value="cond"
            />
          </v-radio-group>

          <v-radio-group
            v-model="form.language"
            :label="$t('asistente.idioma')"
            :error-messages="form.errors.language ? [form.errors.language] : []"
          >
            <v-radio
              v-for="lang in availableLanguages"
              :key="lang"
              :label="$t(`asistente.idiomas.${lang}`)"
              :value="lang"
            />
          </v-radio-group>

          <v-text-field
            v-model="form.priceMin"
            type="number"
            :label="$t('asistente.precioMinimo')"
            dense
            hide-details
            :error-messages="form.errors.priceMin ? [form.errors.priceMin] : []"
          />

          <v-text-field
            v-model="form.priceMax"
            type="number"
            :label="$t('asistente.precioMaximo')"
            dense
            hide-details
            :error-messages="form.errors.priceMax ? [form.errors.priceMax] : []"
          />
        </div>

        <v-btn block color="primary" class="mb-2" @click="submitForms">{{
          $t("asistente.buscarOfertas")
        }}</v-btn>
        <v-btn block color="secondary" @click="cancelForms">{{
          $t("asistente.cancelar")
        }}</v-btn>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-text-field
        v-model="userInput"
        :placeholder="$t('asistente.escribeTuPregunta')"
        dense
        hide-details
        outlined
        class="assistant-input"
        @keyup.enter="sendMessage"
      />
      <v-btn color="primary" @click="sendMessage">{{
        $t("asistente.enviar")
      }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref, inject, watch, onMounted } from "vue";
import { useWantsStore } from "@/stores/wants_store";
import { useOfferStore } from "@/stores/offer_store";
import { useEditionStore } from "@/stores/edition_store";
import { useUserStore } from "@/stores/user_store";
import { useBookStore } from "@/stores/book_store";
import { useCartStore } from "@/stores/cart_store";
import { useI18n } from "vue-i18n";

const wantsStore = useWantsStore();
const offerStore = useOfferStore();
const editionStore = useEditionStore();
const userStore = useUserStore();
const bookStore = useBookStore();
const cartStore = useCartStore();
const { t } = useI18n();

const userInput = ref("");
const messages = ref([]);

const warningEditions = inject("warningEditions", ref([]));
const isOpen = ref(false);
const warningShown = ref(false);

const availableEditionsList = ref([]);
const selectedEditions = ref([]);
const currentForms = ref([]);
const matchingOffers = ref([]);

const availableLanguages = ["ES", "EN", "FR", "DE", "IT"];
const bookConditions = ["NEW", "LIKE NEW", "GOOD", "ACCEPTABLE", "BAD"];

function cancelSelection() {
  selectedEditions.value = [];
  availableEditionsList.value = [];
  messages.value.push({
    role: "assistant",
    text: `❌ ${t("asistente.canceladoCompra")}`,
  });
}

function cancelForms() {
  currentForms.value = [];
}

async function submitForms() {
  matchingOffers.value = []; // Limpia antes de buscar
  let hasErrors = false;

  // Reinicia los errores
  currentForms.value.forEach((form) => {
    form.errors = {
      state: "",
      language: "",
      priceMin: "",
      priceMax: "",
    };
  });

  // Validación
  for (const form of currentForms.value) {
    if (!form.state) {
      form.errors.state = t("asistente.seleccionaCondicion");
      hasErrors = true;
    }
    if (!form.language) {
      form.errors.language = t("asistente.seleccionaIdioma");
      hasErrors = true;
    }
    if (form.priceMin === "") {
      form.priceMin = Math.min(
        ...offerStore.offers
          .filter(
            (o) => o.data.edition_id === form.id && o.data.status === "ACTIVE"
          )
          .map((o) => o.data.price)
      );
    }
    if (form.priceMax === "") {
      form.priceMax = Math.max(
        ...offerStore.offers
          .filter(
            (o) => o.data.edition_id === form.id && o.data.status === "ACTIVE"
          )
          .map((o) => o.data.price)
      );
    }

    if (
      form.priceMin !== "" &&
      form.priceMax !== "" &&
      parseFloat(form.priceMin) >= parseFloat(form.priceMax)
    ) {
      form.errors.priceMax = t("asistente.precioMaximoMinimo");
      hasErrors = true;
    }
  }

  if (hasErrors) {
    return; // No continúes si hay errores
  }

  // Si pasa la validación, busca ofertas
  for (const form of currentForms.value) {
    const res = await offerStore.getOffersForEditionFiltered(form.id);
    if (res.result === "SUCCESS") {
      const filteredOffers = res.data.filter(
        (o) =>
          o.data.status === "ACTIVE" &&
          o.data.condition === form.state &&
          o.data.language === form.language &&
          o.data.price >= parseFloat(form.priceMin) &&
          o.data.price <= parseFloat(form.priceMax)
      );

      filteredOffers.sort((a, b) => a.data.price - b.data.price);

      if (filteredOffers.length > 0) {
        filteredOffers.forEach((offer) => {
          matchingOffers.value.push({
            ...offer,
            title: form.title,
          });

          const edition = editionStore.editions.find(
            (e) => e.id === offer.data.edition_id
          );
          const image =
            edition && edition.data.image
              ? `<img src="${edition.data.image}" alt="${t(
                  "asistente.portadaDe"
                )} ${
                  form.title
                }" style="width: 80px; height: auto; border-radius: 8px; margin: 8px 0;" /><br>`
              : "";

          messages.value.push({
            role: "assistant",
            text: `
                            <div style="text-align: center;">
                                <b>${form.title}</b><br>
                                ${image}
                                💰 ${t("asistente.precio")} ${
              offer.data.price
            } €<br>
                                👤 ${t("asistente.vendedor")} ${
              offer.vendedor || t("asistente.usuario")
            }<br>
                                🌍 ${t("asistente.idioma")}: ${
              offer.data.language
            }<br>
                                📦 ${t("asistente.estado")}: ${
              t(`asistente.condiciones.${offer.data.condition}`) ||
              offer.data.condition
            }<br>
                            </div>
                        `,
            quickReplies: [
              {
                label: t("asistente.botones.anadirCarrito"),
                offerId: offer.id,
              },
              { label: t("asistente.botones.cancelar"), offerId: offer.id },
            ],
          });
        });
      } else {
        messages.value.push({
          role: "assistant",
          text: `❌ ${t("asistente.noOfertasPara")} ${form.title}`,
        });
      }
    }
  }

  // Limpia los formularios después de buscar
  currentForms.value = [];
}

function proceedToForm() {
  currentForms.value = selectedEditions.value.map((id) => {
    availableEditionsList.value = [];
    const edition = editionStore.editions.find((e) => e.id === id);

    const offers = offerStore.offers.filter(
      (o) => o.data.edition_id === id && o.data.status === "ACTIVE"
    );
    const prices = offers.map((o) => o.data.price);
    const minPrice = prices.length ? Math.min(...prices) : "";
    const maxPrice = prices.length ? Math.max(...prices) : "";

    return {
      id,
      title:
        edition.data.book_title +
        " (" +
        t(`asistente.tipos.${edition.data.type}`) +
        ")",
      state: "",
      language: "",
      priceMin: minPrice,
      priceMax: maxPrice,
      errors: {
        state: "",
        language: "",
        priceMin: "",
        priceMax: "",
      },
    };

    availableEditionsList.value = [];
  });
}

watch(warningEditions, (newVal) => {
  if (newVal.length > 0 && !isOpen.value) {
    isOpen.value = true;
    messages.value.push({
      role: "assistant",
      text: t("asistente.edicionesPocasUnidades"),
    });
  }
});

async function sendQuickMessage(reply) {
  if (typeof reply === "string") {
    userInput.value = reply;
    await sendMessage();
    return;
  }

  // Eliminar el mensaje de la oferta del chat
  messages.value = messages.value.filter(
    (m) =>
      !m.quickReplies ||
      !m.quickReplies.some((r) => r.offerId === reply.offerId)
  );

  if (reply.label === t("asistente.anadirCarrito")) {
    await cartStore.addToCart(reply.offerId);
    matchingOffers.value = matchingOffers.value.filter(
      (o) => o.id !== reply.offerId
    );
    messages.value.push({
      role: "assistant",
      text: `✅ ${t("asistente.ofertaAlCarrito")}`,
    });
  } else if (reply.label === t("asistente.cancelar")) {
    matchingOffers.value = matchingOffers.value.filter(
      (o) => o.id !== reply.offerId
    );
    messages.value.push({
      role: "assistant",
      text: `❌ ${t("asistente.operacionCancelada")}`,
    });
  }
}

onMounted(async () => {
  await editionStore.getEditions();
});

async function sendMessage() {
  if (!userInput.value.trim()) return;

  const userMessage = userInput.value;
  messages.value.push({ role: "user", text: userMessage });

  const response = await getAssistantResponse(userMessage);
  if (response) {
    if (typeof response === "string") {
      messages.value.push({ role: "assistant", text: response });
    } else if (typeof response === "object" && response.text) {
      messages.value.push({
        role: "assistant",
        text: response.text,
        quickReplies: response.quickReplies || [],
      });
    }
  }

  userInput.value = "";
}

async function getAssistantResponse(question) {
  await editionStore.getEditions();
  console.log("Todas las ediciones cargadas:", editionStore.editions);

  const wantedIds = wantsStore.wants || [];
  const userId = userStore.id;

  let palabraClaveDetectada = false;

  if (!warningShown.value) {
    let warningMessage = "";
    let hasFewUnits = false;

    for (const editionId of wantedIds) {
      const res = await offerStore.getOffersForEditionFiltered(editionId);

      if (res.result === "SUCCESS" && res.data.length > 0) {
        const activeOffers = res.data.filter(
          (o) =>
            o.data.status === "ACTIVE" &&
            o.data.edition_id === editionId &&
            o.data.seller_id !== userId
        );

        if (activeOffers.length < 5) {
          const edition = editionStore.editions.find((e) => e.id === editionId);
          const title = edition
            ? edition.data.book_title
            : t("asistente.edicionDesconocida");
          const type = edition
            ? t(`asistente.tipos.${edition.data.type}`)
            : t("asistente.tipoDesconocido");

          warningMessage += `• ${title} (${type}) → ${activeOffers.length} ${t(
            "asistente.ofertasActivas"
          )}\n`;
          hasFewUnits = true;
        }
      }
    }

    if (hasFewUnits) {
      messages.value.push({
        role: "assistant",
        text: `
                    <div style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 8px; border: 1px solid #ffeeba;">
                        <b>${t("asistente.atencionTitulo")}</b> ${t(
          "asistente.atencionMensaje"
        )}
                        <ul style="padding-left: 20px; margin: 8px 0 0 0;">
                            ${warningMessage
                              .split("\n")
                              .filter((line) => line.trim() !== "")
                              .map((line) => {
                                const parts = line.replace("• ", "").split("→");
                                return `<li>${parts[0]} → <b>${parts[1]}</b></li>`;
                              })
                              .join("")}
                        </ul>
                    </div>
                    `,
      });
      warningShown.value = true;
    }
  }

  if (/total/i.test(question) || /sum/i.test(question)) {
    let total = 0;
    let foundOffers = false;
    let details = "";
    palabraClaveDetectada = true;

    // Mapa de traducción de condiciones
    const conditionMap = {
      NEW: "Nuevo",
      LIKE_NEW: "Seminuevo",
      GOOD: "Bueno",
      ACCEPTABLE: "Aceptable",
      POOR: "Malo",
    };

    for (const editionId of wantedIds) {
      const res = await offerStore.getOffersForEditionFiltered(editionId);

      if (res.result === "SUCCESS" && res.data.length > 0) {
        // Filtrar solo las ofertas activas Y de esta edición exacta
        const activeOffers = res.data.filter(
          (o) =>
            o.data.status === "ACTIVE" &&
            o.data.edition_id === editionId &&
            o.data.seller_id !== userId
        );

        if (activeOffers.length > 0) {
          foundOffers = true;

          const minOffer = activeOffers.reduce(
            (min, o) => (o.data.price < min.data.price ? o : min),
            activeOffers[0]
          );
          total += minOffer.data.price;

          const edition = editionStore.editions.find((e) => e.id === editionId);
          const title = edition
            ? edition.data.book_title
            : t("asistente.edicionDesconocida");

          console.log("Edición completa:", edition);
          console.log("minOffer: ", minOffer);

          const seller =
            minOffer.vendedor ||
            minOffer.data.seller_name ||
            t("asistente.desconocido");
          const language =
            minOffer.data.language || t("asistente.noEspecificado");
          const rawCondition = minOffer.data.condition || "NO_INFO";
          const condition =
            t(`asistente.condiciones.${rawCondition}`) ||
            t("asistente.noEspecificado");

          details += `• ${title}\n`;
          details += `${t("asistente.precio")} ${minOffer.data.price.toFixed(
            2
          )} €\n`;
          details += `${t("asistente.vendedor")} ${seller}\n`;
          details += `${t("asistente.idioma")}: ${language}\n`;
          details += `${t("asistente.estado")}: ${condition}\n\n`;
        }
      }
    }

    if (!foundOffers) {
      return t("asistente.noOfertasActivas");
    } else {
      messages.value.push({
        role: "assistant",
        text: t("asistente.ofertasBaratas"),
      });

      return `${details}Total: ${total.toFixed(2)} €`;
    }
  }

  if (
    /pocos ejemplares/i.test(question) ||
    /pocas unidades/i.test(question) ||
    /few units/i.test(question) ||
    /low stock/i.test(question)
  ) {
    let fewUnitsList = "";
    palabraClaveDetectada = true;

    for (const editionId of wantedIds) {
      const res = await offerStore.getOffersForEditionFiltered(editionId);

      if (res.result === "SUCCESS" && res.data.length > 0) {
        const activeOffers = res.data.filter(
          (o) =>
            o.data.status === "ACTIVE" &&
            o.data.edition_id === editionId &&
            o.data.seller_id !== userStore.id
        );

        if (activeOffers.length < 5) {
          const edition = editionStore.editions.find((e) => e.id === editionId);
          const title = edition
            ? edition.data.book_title
            : t("asistente.edicionDesconocida");
          const type = edition
            ? t(`asistente.tipos.${edition.data.type}`)
            : t("asistente.tipoDesconocido");
          fewUnitsList += `• ${title} (${type}) → ${activeOffers.length} ${t(
            "asistente.ofertasActivas"
          )}\n`;
        }
      }
    }

    if (fewUnitsList) {
      return `${t("asistente.atencionMensaje")}\n${fewUnitsList}`;
    } else {
      return t("asistente.tusEdicionesSuficientes");
    }
  }

  if (
    /recomienda/i.test(question) ||
    /recom/i.test(question) ||
    /recommend/i.test(question) ||
    /suggest/i.test(question)
  ) {
    palabraClaveDetectada = true;

    // 🟡 Mostrar en consola las ediciones deseadas
    const wantedEditions = editionStore.editions.filter((ed) =>
      wantsStore.wants.includes(ed.id)
    );
    console.log(
      "Ediciones en wantsStore.wants:",
      wantedEditions.map((ed) => ({
        id: ed.id,
        title: ed.data.book_title,
        type: ed.data.type,
        editorial: ed.data.editorial,
      }))
    );

    const booksRes = await bookStore.getBooks();
    const books = booksRes.data;

    const editionMap = {};
    editionStore.editions.forEach((ed) => {
      editionMap[ed.id] = ed.data.book_id;
    });

    const wantedBookIds = wantsStore.wants.map((edId) => editionMap[edId]);

    const genreCount = {};
    wantedBookIds.forEach((bookId) => {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        const genre = book.data.genre;
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    });

    const topGenre = Object.entries(genreCount).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0];
    if (!topGenre) return t("asistente.noRecomendarte");

    // Filtrar ediciones del género que NO estén en wants
    const editionsInGenre = editionStore.editions.filter((ed) => {
      const book = books.find((b) => b.id === ed.data.book_id);
      return (
        book &&
        book.data.genre === topGenre &&
        !wantsStore.wants.includes(ed.id)
      );
    });

    if (editionsInGenre.length === 0) {
      return `${t("asistente.wowGenero")} ${t(
        `asistente.generosLista.${topGenre}`
      )} ${t("asistente.enTuLista")}`;
    }

    // Elegir edición aleatoria
    const randomEdition =
      editionsInGenre[Math.floor(Math.random() * editionsInGenre.length)];
    console.log("Edición recomendada:", randomEdition);
    const book = books.find((b) => b.id === randomEdition.data.book_id);

    const { book_title, type, editorial } = randomEdition.data;
    const { author, primera_publicacion, genre, sinopsis } = book.data;

    const editionHtml = `
            <div style="text-align: center;">
                ${
                  randomEdition.data.image
                    ? `<img src="${randomEdition.data.image}" alt="${t(
                        "asistente.portadaLibro"
                      )}" style="width: 120px; height: auto; border-radius: 8px; margin-bottom: 8px;" />`
                    : ""
                }
                <div><b>📚 ${t("asistente.titulo")}</b> ${book_title}</div>
                <div><b>✍ ${t("asistente.autor")}</b> ${author}</div>
                <div><b>📅 ${t(
                  "asistente.ano"
                )}</b> ${primera_publicacion}</div>
                <div><b>🏷 ${t("asistente.genero")}</b> ${t(
      `asistente.generosLista.${genre}`
    )}</div>
                <div><b>📦 ${t("asistente.tipo")}</b> ${
      t(`asistente.tipos.${type}`) || t("asistente.noDisponible")
    }</div>
                <div><b>🏢 Editorial:</b> ${
                  editorial || t("asistente.noDisponible")
                }</div>
                <div><b>📝 ${t("asistente.sinopsis")}</b> ${
      sinopsis || t("asistente.noDisponible")
    }</div>
            </div>`;

    return `${t("asistente.teGustanLibros")} ${topGenre}, ${t(
      "asistente.teRecomiendoEdicion"
    )}${editionHtml}`;
  }

  if (
    /comprar/i.test(question) ||
    /compra/i.test(question) ||
    /carrito/i.test(question) ||
    /buy/i.test(question) ||
    /purchase/i.test(question) ||
    /cart/i.test(question)
  ) {
    palabraClaveDetectada = true;
    availableEditionsList.value = [];
    selectedEditions.value = [];

    for (const editionId of wantedIds) {
      const res = await offerStore.getOffersForEditionFiltered(editionId);
      if (res.result === "SUCCESS" && res.data.length > 0) {
        const activeOffers = res.data.filter(
          (o) =>
            o.data.status === "ACTIVE" &&
            o.data.edition_id === editionId &&
            o.data.seller_id !== userId
        );
        if (activeOffers.length > 0) {
          const edition = editionStore.editions.find((e) => e.id === editionId);
          if (edition) {
            availableEditionsList.value.push({
              id: editionId,
              title: edition.data.book_title,
              type: edition.data.type,
            });
          }
        }
      }
    }

    if (availableEditionsList.value.length === 0) {
      return t("asistente.noEdicionesDisponibles");
    }
  }

  if (
    /géneros/i.test(question) ||
    /generos/i.test(question) ||
    /genero/i.test(question) ||
    /género/i.test(question) ||
    /genres/i.test(question) ||
    /genre/i.test(question)
  ) {
    palabraClaveDetectada = true;

    const booksRes = await bookStore.getBooks();
    const books = booksRes.data;

    const editionMap = {};
    editionStore.editions.forEach((ed) => {
      editionMap[ed.id] = ed.data.book_id;
    });

    const wantedBookIds = wantsStore.wants.map((edId) => editionMap[edId]);

    const genreCount = {};
    wantedBookIds.forEach((bookId) => {
      const book = books.find((b) => b.id === bookId);
      if (book) {
        const genre = t(`asistente.generosLista.${book.data.genre}`);
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    });

    if (Object.keys(genreCount).length === 0) {
      return t("asistente.noGenerosRegistrados");
    }

    let summary = `
            <div style="background-color: #f0f8ff; color: #333; padding: 6px 10px; border-radius: 6px; border: 1px solid #add8e6;">
                📚 <b>${t("asistente.tienesLibros")}</b>
                ${Object.entries(genreCount)
                  .map(
                    ([genre, count]) =>
                      `<div style="margin-left: 8px;">${genre}: <b>${count}</b></div>`
                  )
                  .join("")}
            </div>
            `;

    return summary;
  }

  // 👉 Si ninguna palabra clave fue detectada, mostramos ayuda
  if (!palabraClaveDetectada) {
    return {
      text: t("asistente.comoAyudarte"),
      quickReplies: [
        t("asistente.totalLista"),
        t("asistente.pocasUnidades"),
        t("asistente.recomendar"),
        t("asistente.comprar"),
        t("asistente.generos"),
      ],
    };
  }

  // 👉 Si fue palabra clave, no mostramos ayuda ni devolvemos nada extra
  return "";
}
</script>

<style scoped>
.assistant-card {
  position: absolute;
  bottom: 65px;
  right: 20px;
  width: 370px;
  height: 650px;
  display: flex;
  flex-direction: column;
  font-size: 0.95rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  transition: background-color 0.3s ease, color 0.3s ease;
}

.assistant-header {
  background-color: #2c3e50; /* Siempre azul oscuro fijo */
  color: #ffffff;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  text-align: center;
}

.assistant-body {
  margin-top: 2%;
  overflow-y: auto;
  flex: 1;
  padding: 12px;
  background-color: var(--color-background-mute);
}

.assistant-message {
  margin-bottom: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  max-width: 100%;
  word-wrap: break-word;
  animation: fadeInUp 0.3s ease;
}

.assistant-message.user {
  background-color: #a1c2d1; /* Azul suave fijo para el usuario */
  color: #000;
  align-self: flex-end;
  text-align: right;
}

.assistant-message.assistant {
  background-color: var(--color-background);
  color: var(--color-text);
  align-self: flex-start;
}

.assistant-input {
  flex: 1;
  margin-right: 8px;
}

.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  width: 100%;
}

.quick-reply-btn {
  font-size: 0.75rem;
  padding: 4px 8px;
  white-space: normal;
  word-wrap: break-word;
  max-width: 100%;
  flex: 1 1 100%;
}

/* Scroll personalizado para todo el cuerpo del asistente */
.assistant-body::-webkit-scrollbar {
  width: 8px;
}

.assistant-body::-webkit-scrollbar-track {
  background: transparent;
}

.assistant-body::-webkit-scrollbar-thumb {
  background-color: #999;
  border-radius: 4px;
}

/* Tema oscuro: ajusta color del thumb */
:root[data-theme="dark"] .assistant-body::-webkit-scrollbar-thumb {
  background-color: #888;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
