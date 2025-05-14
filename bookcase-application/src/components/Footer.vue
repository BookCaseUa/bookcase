<template>
  <component :is="esMovil ? 'FooterMobile' : 'FooterDesktop'" />
</template>

<script>
import FooterMobile from './FooterMobile.vue';
import FooterDesktop from './FooterDesktop.vue';

export default {
  components: {
    FooterMobile,
    FooterDesktop,
  },
  data() {
    return {
      esMovil: false
    };
  },
  mounted() {
    this.verificarPantalla();
    window.addEventListener('resize', this.verificarPantalla);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.verificarPantalla);
  },
  methods: {
    verificarPantalla() {
      this.esMovil = window.innerWidth <= 768;
    }
  }
};
</script>
