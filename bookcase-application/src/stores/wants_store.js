import { defineStore } from "pinia";
import { useUserStore } from "@/stores/user_store";
import { get_wants_list, add_want, rmv_want } from "@/controllers/user_controller";

export const useWantsStore = defineStore("wants", {
  state: () => ({
    wants: [],
    userId: null,
  }),

  actions: {
    async init() {
      const userStore = useUserStore();

      if (userStore.logged && userStore.id) {
        this.userId = userStore.id;
        await this.load_wantslist();
      } else {
        // TODO : Cambiar al formato de error de el resto de la app
        console.warn(
          "⚠️ El usuario no está logueado. No se puede cargar deseados."
        );
      }
    },

    async load_wantslist() {
      if (!this.userId) return;
      this.wants = []; // Reiniciar la lista de deseos
      const response = await get_wants_list(this.userId);
      if (response.result === "SUCCESS") { this.wants = response.data; } 
      else { console.error("Error al cargar la lista de deseos:", response.message); }
    },

    is_wanted(bookId) {
      return this.wants.includes(bookId);
    },

    async add_wanted(bookId) {
      if (!this.userId) return;
      const response = await add_want(this.userId, bookId);
      if (response.result === "SUCCESS") {
        this.wants.push(bookId);
      } else {
        console.error("Error al añadir a la lista de deseos:", response.message);
      }
    },

    async remove_wanted(bookId) {
      if (!this.userId) return;
      const response = await rmv_want(this.userId, bookId);
      if (response.result === "SUCCESS") {
        this.wants = this.wants.filter((id) => id !== bookId);
      } else {
        console.error("Error al eliminar de la lista de deseos:", response.message);
      }
    }
  },
});