<template>
  <div v-if="user" class="profile-container">
    <div class="profile-header">
      <img
        :src="user.data.profile_photo"
        alt="Foto de Perfil"
        class="profile-picture"
      />
      <div class="user-info">
        <h2 class="username">{{ user.data.name }}</h2>
        <h2 class="user-desc">@{{ user.data.nickname }}</h2>
        <p class="user-desc">{{ user.data.descripcion }}</p>
      </div>
      <router-link
        v-if="isOwnProfile"
        to="/perfil/editar"
        class="edit-profile-button"
      >
        ✏️ {{ $t("perfil.editar") }}
      </router-link>
    </div>

    <div v-if="userOffers.length" class="profile-section">
      <h3 class="section-title">{{ $t("perfil.misOfertas") }}</h3>

      <table class="offer-table">
        <thead>
          <tr>
            <th class="offer-table-head">{{ $t("perfil.columnasOfertas.libro") }}</th>
            <th class="offer-table-head">{{ $t("perfil.columnasOfertas.precio") }}</th>
            <th class="offer-table-head">{{ $t("perfil.columnasOfertas.estado") }}</th>
            <th class="offer-table-head">{{ $t("perfil.columnasOfertas.idioma") }}</th>
            <th class="offer-table-head">{{ $t("perfil.columnasOfertas.comentario") }}</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(offer, index) in displayedOffers"
            :key="offer.id"
            class="offer-table-row"
          >
            <td class="offer-title">
              <img
                :src="offer.edition.image || 'https://via.placeholder.com/40x50?text=Libro'"
                alt="Portada"
                class="offer-cover"
              />
              <span>{{ offer.data.edition_book_name }}</span>
            </td>
            <td class="offer-price">{{ offer.data.price }} €</td>
            <td class="offer-condition">{{ offer.data.condition }}</td>
            <td class="offer-language">{{ offer.data.language }}</td>
            <td
              class="offer-comment"
              v-if="offer.data.comment"
            >
              "{{ offer.data.comment }}"
            </td>
          </tr>
        </tbody>
      </table>

      <button
        v-if="userOffers.length > 3"
        @click="toggleShowAll"
        class="toggle-button"
      >
        {{ showAll ? $t("Ocultar") : $t("Mostrar Todas") }}
      </button>
    </div>

    <div v-if="wantedEditionsList.length" class="profile-section">
        <h3 class="section-title">📚 Artículos que Quiero</h3>
        <div class="wanted-editions-grid">
          <div v-for="(edition, index) in wantedEditionsList" :key="index" class="wanted-edition-card" @click="goToEdition(edition.id)">
            <div class="book-info">
              <img :src="edition.image || 'https://via.placeholder.com/40x50?text=Libro'" alt="Portada" class="book-cover" />
              <div class="edition-details">
                <span class="edition-title">{{ edition.book_title }}</span>
                <span class="edition-type">{{ edition.type }}</span>
                <span class="edition-editorial">{{ edition.editorial }}</span>
              </div>
            </div>
          </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";

import { useUserStore } from "@/stores/user_store";
import { useOfferStore } from "@/stores/offer_store";
import { useEditionStore } from "@/stores/edition_store";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const offerStore = useOfferStore();
const editionStore = useEditionStore();
const route = useRoute();
const { t } = useI18n();
const router = useRouter();

const goToEdition = (id) => {
  router.push(`/infoEdicion/${id}`);
};

const user = ref(null);
const userOffersRaw = ref([]);
const editions = ref({});
const wantedEditionsList = ref([]);
const showAll = ref(false);

const getStars = (rating) => {
  const maxStars = 5;
  return "★".repeat(rating) + "☆".repeat(maxStars - rating);
};

const toggleShowAll = () => {
  showAll.value = !showAll.value;
};

const displayedOffers = computed(() => {
  return showAll.value ? userOffers.value : userOffers.value.slice(0, 3);
});

const offersWithEdition = computed(() => {
  return userOffersRaw.value
    .filter((offer) => offer.data.status === 'ACTIVE')
    .map((offer) => ({
      ...offer,
      edition: editions.value[offer.data.edition_id] || {},
    }));
});




const isOwnProfile = computed(() => {
  return String(userStore.id) === route.params.id;
});

const userOffers = offersWithEdition;

onMounted(async () => {
  await fetchProfileData(route.params.id);
});

watch(
  () => route.params.id,
  async (newId) => {
    await fetchProfileData(newId);
    window.scrollTo(0, 0);
  }
);

async function fetchProfileData(userId) {
  try {
    user.value = await userStore.fetchUserById(userId);

    const offerResult = await offerStore.getOffersForUserFiltered(userId);
    if (offerResult.result === "SUCCESS") {
      userOffersRaw.value = offerResult.data;
    }

    const editionResult = await editionStore.getEditions();
    if (editionResult.result === "SUCCESS") {
      editions.value = Object.fromEntries(
        editionResult.data.map((ed) => [ed.id, { id: ed.id, ...ed.data }])
      );
    }

    const wantedEditions = user.value.data.wants
      .map((wantId) => editions.value[wantId])
      .filter(Boolean);

    wantedEditionsList.value = wantedEditions;


  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
</script>


<style scoped>
.profile-container {
  width: 100%;
  padding: 30px;
  background: #ecf0f1;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.profile-picture {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #2c3e50;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-size: 1.8rem;
  color: #2c3e50;
  margin: 0;
}

.user-desc {
  color: #7f8c8d;
  margin-top: 5px;
  font-style: italic;
}

.profile-section {
  margin-bottom: 30px;
  margin-top: 30px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #34495e;
}

.book-list {
  list-style: none;
  padding: 0;
}

.book-item {
  background: #fff;
  width: 20%;
  padding: 10px 10px;
  margin-bottom: 10px;
  border-radius: 5px;
  border-left: 4px solid #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.book-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.book-item .book-cover {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid #bdc3c7;
}

.reviews {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.review-card {
  background: #fff;
  width: 40%;
  padding: 20px;
  border-radius: 5px;
  border-left: 4px solid #2c3e50;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.review-block {
  margin-bottom: 20px;
}

.review-subtitle {
  margin: 0 0 8px;
  font-weight: bold;
  color: #2c3e50;
}

.review-subtitle span {
  color: #34495e;
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.book-title-with-cover {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.book-cover {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border: 1px solid #bdc3c7;
  border-radius: 3px;
}

.review-text {
  margin: 0 0 5px;
  color: #7f8c8d;
  font-style: italic;
}

.stars {
  color: #f39c12;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .profile-container {
    width: 90%;
    padding: 20px;
  }

  .wanted-editions-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }

  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .user-info {
    align-items: center;
  }

  .book-title-with-cover {
    flex-direction: column;
    align-items: flex-start;
  }

  .book-cover {
    margin-bottom: 5px;
  }
}

.offer-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  font-size: 0.9rem;
  border: none;
}

.offer-table-head {
  padding: 8px 12px;
  background: #f4f4f4;
  border: none;
  text-align: left;
  border-bottom: 1px solid #e0e0e0bf;
}

.offer-table-row {
  padding: 8px 12px;
  background: #ecf0f1;
  border: none;
  text-align: left;
  border-bottom: 1px solid #e0e0e0bf;
}

.offer-title {
  display: flex;
  border: none;
  align-items: center;
  gap: 8px;
}

.offer-cover {
  width: 40px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.offer-price {
  border: none;
  color: #27ae60;
  font-weight: bold;
  text-align: left;
}

.offer-condition,
.offer-language {
  color: #555;
  border: none;
  text-align: left;
}

.offer-comment {
  font-style: italic;
  color: #666;
  border: none;
  text-align: left;
}

.toggle-button {
  margin-top: 10px;
  padding: 8px 14px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.toggle-button:hover {
  background: #2980b9;
}

.edit-profile-button {
  display: inline-block;
  margin-bottom: 15px;
  padding: 5px 5px;
  background-color: #27ae60;
  color: white;
  font-weight: bold;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.edit-profile-button:hover {
  background-color: #219150;
}

/* 🌙 Ajustes para modo oscuro */
html[data-theme="dark"] .profile-container {
  background: var(--color-background-soft);
  color: var(--color-text);
}

html[data-theme="dark"] .username,
html[data-theme="dark"] .review-subtitle,
html[data-theme="dark"] .review-subtitle span,
html[data-theme="dark"] .section-title {
  color: var(--color-heading);
}

html[data-theme="dark"] .user-desc,
html[data-theme="dark"] .review-text {
  color: #cccccc;
}

html[data-theme="dark"] .book-item,
html[data-theme="dark"] .review-card {
  background-color: #1e1e1e;
  border-left: 4px solid var(--color-heading);
  color: var(--color-text);
}

html[data-theme="dark"] .offer-table-head {
  background: #2a2a2a;
  color: #ffffff;
}

.wanted-editions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
  padding: 10px;
}

.wanted-edition-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wanted-edition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.book-info {
  display: flex;
  gap: 12px;
  padding: 15px;
  align-items: center;
}

.book-cover {
  width: 60px;
  height: 90px;
  object-fit: cover;
  border-radius: 5px;
  border: 1px solid #bdc3c7;
}

.edition-details {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.edition-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: #2c3e50;
}

.edition-type, .edition-editorial {
  font-size: 0.9rem;
  color: #7f8c8d;
}

html[data-theme="dark"] .offer-table-row {
  background: #1f1f1f;
  color: #ffffff;
}

html[data-theme="dark"] .offer-price {
  color: #2ecc71;
}

html[data-theme="dark"] .offer-condition,
html[data-theme="dark"] .offer-language,
html[data-theme="dark"] .offer-comment {
  color: #dddddd;
}

html[data-theme="dark"] .toggle-button {
  background: #2980b9;
  color: white;
}

html[data-theme="dark"] .edit-profile-button {
  background-color: #2ecc71;
}

html[data-theme="dark"] .wanted-edition-card {
  background: #1e1e1e;
  color: #ffffff;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4); /* Sombra más suave e integrada */
}

html[data-theme="dark"] .edition-title {
  color: #ffffff;
}

html[data-theme="dark"] .edition-type,
html[data-theme="dark"] .edition-editorial {
  color: #cccccc;
}

</style>
