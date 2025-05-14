<template>
  <v-container class="compare-editions" fluid>
    <h2 class="text-center mb-6">Comparar ediciones</h2>

    <v-row justify="center">
      <v-col
        v-for="edition in filteredEditions"
        :key="edition.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="edition-card" outlined>
          <v-img :src="edition.data.image" height="28rem" cover></v-img>

          <v-card-title class="text-wrap">
            {{ edition.data.book_title }} (Edición {{ edition.data.edition }})
          </v-card-title>

          <v-card-text>
            <p><strong>Editorial:</strong> {{ edition.data.editorial }}</p>
            <p><strong>Tipo:</strong> {{ edition.data.type }}</p>
            <p><strong>Año:</strong> {{ edition.data.year }}</p>
            <p>
              <strong>Observaciones:</strong>
              {{ edition.data.observations || "Ninguna" }}
            </p>
          </v-card-text>

          <v-card-actions>
            <v-btn color="primary" block @click="verOfertas(edition.id)"
              >Ver ofertas</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { get_editions } from "../controllers/edition_controller";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const bookId = route.params.bookId;
const editions = ref([]);

const filteredEditions = computed(() => {
  return editions.value.filter((e) => e.data.book_id === bookId);
});

const verOfertas = (editionId) => {
  router.push({ name: "OffersByEdition", params: { editionId } });
};

onMounted(async () => {
  const result = await get_editions();
  if (result.result === "SUCCESS") {
    editions.value = result.data;
  }
});
</script>

<style scoped>
.compare-editions {
  max-width: 1200px;
  margin: auto;
  padding: 20px;
}

h2 {
  color: #c7c7c7;
}

.edition-card {
  transition: transform 0.3s ease;
  cursor: pointer;
  border-radius: 12px;
}

.edition-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
