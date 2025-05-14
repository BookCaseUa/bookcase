import { defineStore } from 'pinia';
import { useOfferStore } from './offer_store';
import { useOrderStore } from './order_store';
import { useUserStore } from './user_store';
import { return_message } from '@/utils/io';

export const useCartStore = defineStore('cart', {
    state: () => ({ cart: [], }),
    getters: { number_of_items: (state) => state.cart.length, },

    persist: { storage: window.localStorage, },

    actions: {
        loadCart() {
            const userStore = useUserStore();
            if (!userStore.id) return;
        
            const savedCart = localStorage.getItem(`cart_${userStore.id}`);
            this.cart = savedCart ? JSON.parse(savedCart) : [];
            console.log(`[INFO] Loaded cart for user ${userStore.id}:`, this.cart);
        },

        saveCart() {
            const userStore = useUserStore();
            if (!userStore.id) return;
        
            localStorage.setItem(`cart_${userStore.id}`, JSON.stringify(this.cart));
            console.log(`[INFO] Saved cart for user ${userStore.id}:`, this.cart);
        },

        async addToCart(offerId) {
            const existingItem = this.cart.find(item => item === offerId);
            if (existingItem) {
                console.log("[WARNING] Item already in cart");
            } else {
                const offerStore = useOfferStore();
                const adding = await offerStore.add_to_cart(offerId);
                if (adding.result === "ERROR") {
                    console.log("[ERROR] " + adding.message);
                }
                else {
                    this.cart.push(offerId);
                    this.saveCart();
                    console.log("[INFO] Item added to cart");
                }
            }
        },

        async removeFromCart(offerId) {
            const index = this.cart.findIndex(item => item === offerId);
            if (index !== -1) {
                const offerStore = useOfferStore();
                const removing = await offerStore.remove_from_cart(offerId);
                if (removing.result === "ERROR") {
                    console.log("[ERROR] " + removing.message);
                }
                else {
                    this.cart.splice(index, 1);
                    this.saveCart();
                    console.log("[INFO] Item removed from cart");
                }
            } else {
                console.log("[WARNING] Item not found in cart");
            }
        },

        async clearCart() {
            console.log("[INFO] Clearing cart..." + this.cart.length + " items");
            for (const item of this.cart) {
                console.log("[INFO] Removing item from cart: " + item);
                await this.removeFromCart(item);
            }
            this.cart = [];
            this.saveCart();
            console.log("[INFO] Cart cleared");
        },

        async clearBoughtCart() {
            console.log("[INFO] Clearing bought cart..." + this.cart.length + " items");
            for (const item of this.cart) {
                console.log("[INFO] Removing item from cart: " + item);
                await this.removeFromCart(item);
            }
            this.cart = [];
            console.log("[INFO] Cart cleared");
        },

        async getCartItems() {
            const offerStore = useOfferStore();
            const offers = [];

            for (const item of this.cart) {
                const offer = await offerStore.getOffer(item);
                if (offer.result === "SUCCESS") {
                    offers.push(offer.data);
                } else {
                    console.log("[ERROR] " + offer.message);
                }
            }
            return offers;
        },

        async buyCart() {
            const orders_created = [];

            const offers = await this.getCartItems();
            if (offers.length === 0) { return return_message("ERROR", "El carrito está vacío"); }
            console.log(offers)

            // Creamos una lista de todos los IDs de los vendedores diferentes
            const sellers = []
            for (const offer of offers) {
                if (!sellers.includes(offer.data.seller_id)) {
                    sellers.push(offer.data.seller_id);
                }
            }
            console.log("[INFO] Sellers: " + sellers.join(", "));

            // Para cada vendedor creamos una orden con los IDs de las ofertas
            const orderStore = useOrderStore();
            const userStore = useUserStore();

            for(const seller of sellers) {
                // Filtramos las ofertas para el vendedor actual
                const offer_ids = []
                for (const offer of offers) {
                    if (offer.data.seller_id === seller) {
                        offer_ids.push(offer.id);
                    }
                }
                console.log("[INFO] Creating order for seller: " + seller + " with offers: " + offer_ids.join(", "));
                
                // Creamos la orden
                console.log(userStore.id, seller, offer_ids);
                const result = await orderStore.createOrder(userStore.id, seller, offer_ids);
                if (result.result === "SUCCESS") {
                    console.log("[INFO] Order created: " + result.data);
                    orders_created.push(result.data.id);
                } else {
                    console.log("[ERROR] " + result.message);
                }
            }
            
            // Si se han creado todas las órdenes, vaciamos el carrito
            if (orders_created.length === sellers.length) {
                this.cart = [];
                this.saveCart();
                return return_message("SUCCESS", "Órdenes creadas correctamente", orders_created);
            } else {
                return return_message("ERROR", "No se han podido crear todas las órdenes");
            }
        }
    }
})