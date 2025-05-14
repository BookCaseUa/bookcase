<template>
  <component :is="isMobile ? ChatViewMobile : ChatViewDesktop" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import ChatViewDesktop from "./ChatViewDesktop.vue";
import ChatViewMobile from "./ChatViewMobile.vue";

const isMobile = ref(false);

onMounted(() => {
  const check = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  check();
  window.addEventListener("resize", check);
  onBeforeUnmount(() => window.removeEventListener("resize", check));
});
</script>
