<template>

    <div>
        <Busqueda />
    </div>

    <div class="container-info">
        <div class = "info">
            <img :src="libro.imagen" alt="imagen" class="libro-img">
            <div class = "separacion1">
                <h1>{{libro.nombre}}</h1>
                <h2>{{libro.autor}}</h2>
                <h2>{{ libro.editorial }}</h2>
            </div>

        </div>
    </div>

    <div class = "vendedores">
        <h1>VENDEDORES</h1>

        <table class = "table-container">
            <thead>
                <tr>
                    <th>Nombre del Vendedor</th>
                    <th>Idioma</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th></th>

                </tr>
            </thead>
            <tbody>
                <tr v-for="vendedor in libro.vendedores" :key="vendedor.id">
                    <td>{{ vendedor.nombre }}</td>
                    <td>{{ vendedor.idioma }}</td>
                    <td>{{ vendedor.precio }}€</td>
                    <td>{{ vendedor.cantidad }}</td>
                    <td>
                        <button>
                            <img width="24" height="24" src="https://img.icons8.com/material-sharp/24/FFFFFF/shopping-cart.png" alt="shopping-cart"/>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>


    </div>
    

    

    

</template>

<script>

import Busqueda from '@/components/Busqueda.vue';

export default{
    props: ["id"],
    data(){
        return {
            libros: [
                {
                    id: 1,
                    nombre: "El principito",
                    autor: "Antoine de Saint-Exupéry",
                    imagen: "/imagenes/images.jpg",
                    editorial: "Editorial",
                    vendedores: [
                        {
                            id: 1,
                            nombre: "Vendedor A",
                            idioma: "Español",
                            precio: 20,
                            cantidad: 1,
                        },
                    ],
                }
            ],
            
            libro: {},
        }
    },
    components: {
    Busqueda,
  },
  mounted() {
    const numeroId = parseInt(this.id, 10);
    this.libro = this.libros.find((libro) => libro.id === numeroId) || {};
  },
}

</script>


<style>


.container-info{
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 8px 8px 8px 8px;
    background-color: #2c3e50;
    color: white;
    margin-top: 50px;
    margin-bottom: 50px;
}

.libro-img{
   border-width: 3px;
   border-color: black;
   border-style: solid;
   width: 300px;
   height: 420px;

}

.info{
    display:flex;
    gap: 20px;
}


.separacion1{
    display:flex;
    flex-direction: column;
}

.vendedores{
    display:flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: auto;
    padding: 8px 8px 8px 8px;
    background-color: #2c3e50;
    color: white;
    margin-top: 50px;
    margin-bottom: 50px;
    flex-direction: column;
}

.table-container {
  width: 100%;
  max-width: 800px;
  border-collapse: collapse;
  margin-top: 20px;
  margin-bottom: 50px;
}

th, td {
  border: 1px solid white;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #34495e;
}

tr:nth-child(even) {
  background-color: #3c4f60;
}




</style>