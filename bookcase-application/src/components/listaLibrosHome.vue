<template>
  <component
    :is="esMovil ? 'listaLibrosHomeMobile' : 'listaLibrosHomeDesktop'"
  />
</template>

<script>
import listaLibrosHomeDesktop from './listaLibrosHomeDesktop.vue'
import listaLibrosHomeMobile from './listaLibrosHomeMobile.vue'

export default {
  components: {
    listaLibrosHomeDesktop,
    listaLibrosHomeMobile
  },
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
