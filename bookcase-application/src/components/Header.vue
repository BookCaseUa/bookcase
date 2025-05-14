<!-- Header.vue -->
<template>
    <component :is="esPantallaPequeña ? 'HeaderMobile' : 'HeaderDesktop'" />
  </template>
  
  <script>
  import HeaderMobile from './HeaderMobile.vue';
  import HeaderDesktop from './HeaderDesktop.vue';
  
  export default {
    components: { HeaderMobile, HeaderDesktop },
    data() {
      return {
        esPantallaPequeña: false
      };
    },
    mounted() {
      this.checkSize();
      window.addEventListener('resize', this.checkSize);
    },
    beforeUnmount() {
      window.removeEventListener('resize', this.checkSize);
    },
    methods: {
      checkSize() {
        this.esPantallaPequeña = window.innerWidth <= 768;
      }
    }
  };
  </script>
  