<template>
  <component :is="esMovil ? 'anunciosMobile' : 'anunciosDesktop'" />
</template>

<script>
import anunciosMobile from './anunciosMobile.vue'
import anunciosDesktop from './anunciosDesktop.vue'

export default {
  components: { anunciosMobile, anunciosDesktop },
  data() {
    return {
      esMovil: false
    }
  },
  mounted() {
    this.verificarPantalla()
    window.addEventListener('resize', this.verificarPantalla)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.verificarPantalla)
  },
  methods: {
    verificarPantalla() {
      this.esMovil = window.innerWidth <= 768
    }
  }
}
</script>
