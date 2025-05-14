<template>

    <Busqueda />

    <div class = "container-lista">
        <h1 class = "title-1">LIBROS DISPONIBLES</h1>
        <!-- Minimo 6 - Maximo 30 (paginacion 5 * 6)? -->
        <div class = "separacion-libros"> 
        <ul class = "lista-libros">
            <li
                class="container-libro"
                v-for="(libro, index) in librosFiltrados"
                :key="index"
            >
            <router-link :to="{ name: 'InfoLibro', params: { id: libro.id } }" class="router-link">
                <img :src="libro.imagen" alt="imagen" class="imagen-libro" />
                <h2>{{ libro.nombre }}</h2>
                <p>{{ libro.autor }}</p>
          </router-link>
        </li>
        </ul>
        </div>
    </div>

</template>

<script>
import router from '@/router';
import Busqueda from '@/components/Busqueda.vue';

export default {
    components: {
        Busqueda, // Regístralo aquí
    },
    data() {
        return {
            searchQuery: "", // Almacena el texto ingresado por el usuario
            libros: [
                { id: 1, nombre: "El principito", autor: "Antoine de Saint-Exupéry", imagen: "/imagenes/images.jpg" },
                { id: 2, nombre: "Cenicienta", autor: "Blabla", imagen: "/imagenes/images.jpg" },
                { id: 3, nombre: "1984", autor: "George Orwell", imagen: "/imagenes/images.jpg" },
                { id: 4, nombre: "Harry Potter", autor: "J.K. Rowling", imagen: "/imagenes/images.jpg" },
                { id: 5, nombre: "Don Quijote de la Mancha", autor: "Miguel de Cervantes", imagen: "/imagenes/images.jpg" },
                { id: 6, nombre: "La sirenita", autor: "Disney", imagen: "/imagenes/images.jpg" }
            ]
        };
    },
    computed: {
        librosFiltrados() {
            const query = this.$route.query.q?.toLowerCase().trim() || "";

            return query
            ? this.libros.filter(libro =>
                libro.nombre.toLowerCase().includes(query) ||
                libro.autor.toLowerCase().includes(query)
                )
            : this.libros;
        }
    }
};



</script>




<style>

.router-link{
    text-decoration: none;
    color: inherit;

}

.title-1{
    color: white;
}

.separacion-libros{
    justify-content: center;
    display: flex;
    
    
}

.container-lista{
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 8px 8px 8px 8px;
    background-color: #2a3a4b;
    margin-top: 50px;
    margin-bottom: 50px;
}


.container-libro{
    justify-content: center;
    align-items: center;
    width: 16.6%;
    height: auto;
    background-color: #2a3a4b;
    margin-top: 20px;
    list-style-type: none;
    padding: 10px;
    text-align: center;
    margin-bottom: 20px;
    color: white;
    
}


.img-libro{
    width: 100%;
    height: 100%;
    
}

.lista-libros {
    display: flex;
    flex-wrap: wrap; /* Permite que los libros se ajusten a múltiples filas */
    justify-content: flex-start;
    width: 100%;
    gap: 50px;
    margin-left: 50px;
    
}



</style>