import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import InfoLibro from "@/components/infoLibro.vue";
import infoEdicion from "@/components/infoEdicion.vue";
import WantedBooks from "@/views/WantedBooks.vue";
import ListaLibros from "@/components/listaLibros.vue";
import ListaLibros2 from "@/components/listaLibros2.vue";
import { useUserStore } from "@/stores/user_store";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/LoginView.vue"),
    },
    {
      path: "/register",
      name: "register",
      component: () => import("../views/RegisterView.vue"),
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../views/AboutView.vue"),
    },
    {
      path: "/infoLibro/1",
      name: "libro",
      component: InfoLibro,
    },
    {
      path: "/contacto",
      name: "contacto",
      component: () => import("../views/ContactView.vue"),
    },
    {
      path: "/AdvSearch",
      name: "Advanced Search",
      component: () => import("../views/AdvancedSearchView.vue"),
    },
    {
      path: "/infoLibro/:id",
      name: "InfoLibro",
      component: InfoLibro,
      props: true,
    },
    {
      path: "/libros-deseados",
      name: "LibrosDeseados",
      component: WantedBooks,
    },
    {
      path: "/infoEdicion/:id",
      name: "infoEdicion",
      component: infoEdicion,
    },
    {
      path: "/carrito",
      name: "CarritoView",
      component: () => import("@/views/CarritoView.vue"),
    },
    {
      path: "/listaLibros",
      name: "listaLibros",
      component: ListaLibros,
    },
    {
      path: "/listaLibros2",
      name: "listaLibros2",
      component: ListaLibros2,
    },
    {
      path: "/search",
      name: "search",
      component: HomeView,
    },
    {
      path: "/perfil/:id",
      name: "Perfil de Usuario",
      component: () => import("../views/ProfileView2.vue"),
    },
    {
      path: "/perfil/editar",
      name: "editar perfil",
      component: () => import("../views/ProfileView.vue"),
    },
    {
      path: "/perfil/GestionarPedido/:id",
      name: "Gestionar Pedido",
      component: () => import("../views/GestionarPedidoView.vue"),
    },
    {
      path: "/perfil/VerPedido/:id",
      name: "Ver Pedido",
      component: () => import("../views/VerPedidoView.vue"),
    },
    {
      path: "/politicas",
      name: "politicas",
      component: () => import("../views/PoliticasLegalesView.vue"),
    },
    {
      path: "/addOffer",
      name: "addOffer",
      component: () => import("../views/AddOfferView.vue"),
    },
    {
      path: "/mis-ofertas",
      name: "MisOfertas",
      component: () => import("../views/OfertasUsuarioView.vue"),
    },
    {
      path: "/editar-oferta/:id",
      name: "editarOferta",
      component: () => import("../views/EditOfferView.vue"),
    },
    {
      path: "/compareEditions/:bookId",
      name: "compareEditions",
      component: () => import("../views/CompareEditionsView.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/admin/users",
      name: "adminUsers",
      component: () => import("../views/AdminUsersView.vue"),
    },
    {
      path: "/admin/books",
      name: "adminBooks",
      component: () => import("../views/AdminBooksView.vue"),
    },
    {
      path: "/admin/orders",
      name: "adminOrders",
      component: () => import("../views/AdminOrdersView.vue"),
    },
    {
      path: "/admin/reports",
      name: "adminReports",
      component: () => import("../views/AdminReportsView.vue"),
    },
    {
      path: "/admin/statistics",
      name: "adminStatistics",
      component: () => import("../views/AdminStatisticsView.vue"),
    },
    {
      path: "/novedades",
      name: "news",
      component: () => import("../views/NewsView.vue"),
    },
    {
      path: "/mis-ventas",
      name: "misVentas",
      component: () => import("../views/VentasUsuarioView.vue"),
    },
    {
      path: "/chat/:chatId",
      name: "ChatView",
      component: () => import("../views/ChatView.vue"),
    },
    {
      path: "/mis-chats",
      name: "ChatList",
      component: () => import("../views/ChatListView.vue"),
    },
    {
      path: "/mis-pedidos",
      name: "misPedidos",
      component: () => import("../views/PedidosUsuarioView.vue"),
    },
    {
      path: '/mis-valoraciones',
      name: 'MisValoraciones',
      component: () => import('@/views/MisValoracionesView.vue'),
      meta: { requiresAuth: true } // si usas protección de rutas
    }    
  ],
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  const rutasProtegidas = [
    "perfil",
    "Perfil de Usuario",
    "MisOfertas",
    "LibrosDeseados",
  ];

  const rutasAdmin = [
    "admin",
    "adminUsers",
    "adminBooks",
    "adminOrders",
    "adminReports",
    "adminStatistics",
  ];

  const requiereAuth = rutasProtegidas.includes(to.name);
  const requiereAdmin = rutasAdmin.includes(to.name);

  if (requiereAuth && !userStore.id) {
    next("/login");
  } else if (requiereAdmin && userStore.email !== "admin@admin.com") {
    next("/");
  } else {
    next();
  }
});

export default router;
