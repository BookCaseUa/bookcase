<template>
    <section>
        <swiper
        :modules="[Autoplay, Navigation]"
        :slides-per-view="1"
        :loop="true"
        :autoplay="{ delay: 5000 }"
        :navigation="true"
        class="swiper-container">
            <swiper-slide  v-for="(anuncio, index) in anuncios" :key="index">
              <div class="anuncio-card">
                <a target="_blank" class="anuncio-link">
                  <img :src="anuncio.imagen" alt="Anuncio" class="img-auto"/>
                </a>
              </div>
            </swiper-slide>
        </swiper>
    </section>
</template>


<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { ref, onMounted, computed } from 'vue'

const anuncios = [
  {
    imagen: 'https://i.ibb.co/1GWdx5rx/anuncio1.png',
  },
  {
    imagen: 'https://i.ibb.co/mFJRxrVY/anuncio2.png',
  },
  {
    imagen: 'https://i.ibb.co/qLNdNjQ4/anuncio3.png',
  },
  {
    imagen: 'https://i.ibb.co/xKkLfLRZ/anuncio4.png',
  },
  {
    imagen: 'https://i.ibb.co/VYHJCjZy/anuncio5.png',
  },
  {
    imagen: 'https://i.ibb.co/7HwKG2V/anuncio6.png'
  }
  
];




</script>


<style scoped>
.anuncios-section {
  padding: 2rem;
  background-color: #f8f8f8;
}

.anuncio-card {
  width: 100%;
  height: 400px;
  overflow: hidden;
  position: relative;
}

.anuncio-link {
  display: block;
  width: 100%;
  height: 100%;
}

.img-auto {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  image-rendering: auto;
}

:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #ffffff;
  font-size: 20px;
}


</style>
