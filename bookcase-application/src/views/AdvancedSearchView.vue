<template>
  <div class="header-skip"></div>
  <component :is="isMobile ? AdvancedSearchViewMobile : AdvancedSearchViewDesktop" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdvancedSearchViewDesktop from '@/views/AdvancedSearchViewDesktop.vue';
import AdvancedSearchViewMobile from '@/views/AdvancedSearchViewMobile.vue';

const isMobile = ref(false);

onMounted(() => {
  const updateScreen = () => {
    isMobile.value = window.innerWidth <= 768;
  };
  updateScreen();
  window.addEventListener('resize', updateScreen);
});
</script>
