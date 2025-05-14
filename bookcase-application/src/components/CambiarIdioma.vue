<template>
  <v-menu offset-y>
    <template #activator="{ props }">
      <v-btn v-bind="props" variant="text" size="small" class="text-uppercase">
        {{ currentLang.toUpperCase() }}
        <v-icon end>mdi-chevron-down</v-icon>
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="lang in languages"
        :key="lang.code"
        @click="changeLanguage(lang.code)"
        :active="currentLang === lang.code"
      >
        <v-list-item-title>
          {{ lang.label }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import { ref, onMounted } from "vue";
import { useLocale } from "vuetify";

const { locale } = useI18n();
const { current } = useLocale();
const currentLang = ref(locale.value);

const languages = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

function changeLanguage(lang) {
  locale.value = lang;
  current.value = lang;
  currentLang.value = lang;
  localStorage.setItem("idioma", lang);
  console.log("Idioma cambiado al: ", lang);
}

onMounted(() => {
  const saved = localStorage.getItem("idioma");
  if (saved) {
    currentLang.value = saved;
    current.value = saved;
    locale.value = saved;
  }
  console.log("Idioma en: ", saved);
});
</script>

<style scoped>
.v-list-item--active {
  background-color: #2c3e50;
  color: white;
}
</style>
