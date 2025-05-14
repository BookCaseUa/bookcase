import { defineStore } from 'pinia';
import { create_order, get_orders, update_order, delete_order } from '@/controllers/order_controller';
import { useOfferStore } from './offer_store';

export const useOrderStore = defineStore('order', {
    state: () => ({ orders: [], }),

    persist: { storage: window.localStorage },

    actions: {
        async fetchOrders() {
            try {
                this.orders = []; // Reiniciar la lista de órdenes
                const result = await get_orders();
                if (result.result == "SUCCESS") { this.orders = result.data; }
            } catch (error) { console.error(error); }
        },

        async createOrder(buyer_id, seller_id, offer_ids) {
            try {
                const result = await create_order(buyer_id, seller_id, offer_ids);
                if (result.result == "SUCCESS") { this.orders.push(result.data); } 
                else { console.warn("[WARNING] " + result.message); }

                return result;
            } catch (error) {
                console.error(error);
            }
        },

        async getOrders() {
            try {
                if (this.orders.length == 0) { await this.fetchOrders(); }
                return {
                    result: "SUCCESS",
                    message: "Órdenes obtenidas correctamente",
                    data: this.orders,
                };
            } catch (error) { console.error(error); }
        },

        async getOrder(order_id) {
            try {
                await this.fetchOrders();
                if (this.orders.length == 0) { await this.fetchOrders(); }
                const order = this.orders.find(order => order.id === order_id);
                if (order) {
                    return {
                        result: "SUCCESS",
                        message: "Orden obtenida correctamente",
                        data: order,
                    };
                } else {
                    return {
                        result: "ERROR",
                        message: "La orden no existe",
                    };
                }
            } catch (error) { console.error(error); }
        },

        async getSellsFromUser(user_id) {
            try {
                if (this.orders.length == 0) { await this.fetchOrders(); }
                const sells = this.orders.filter(order => order.seller_id === user_id);
                return {
                    result: "SUCCESS",
                    message: "Ventas obtenidas correctamente",
                    data: sells,
                };
            } catch (error) { console.error(error); }
        },

        async getPurchasesFromUser(user_id) {
            try {
                // if (this.orders.length == 0) { await this.fetchOrders(); }
                const purchases = this.orders.filter(order => order.buyer_id === user_id);
                return {
                    result: "SUCCESS",
                    message: "Compras obtenidas correctamente",
                    data: purchases,
                };
            } catch (error) { console.error(error); }
        },

        async getOffersFromOrder(order_id) {
            try {
                if (this.orders.length == 0) {
                    await this.fetchOrders();
                }
                const order = this.orders.find(order => order.id === order_id);
                if (order) {
                    const offerStore = useOfferStore();
                    const offers = [];
        
                    for (const offer_id of order.offer_ids) {
                        const offer = await offerStore.getOffer(offer_id);
                        if (offer.result == "SUCCESS") {
                            offers.push(offer.data);
                        } else {
                            console.warn("[WARNING] " + offer.message);
                        }
                    }
        
                    return {
                        result: "SUCCESS",
                        data: offers,
                    };
                } else {
                    return {
                        result: "ERROR",
                        message: "La orden no existe",
                    };
                }
            } catch (error) {
                console.error(error);
            }
        },
        

        async confirmShipment(order_id) {
            try {
                const result = await update_order(order_id, new Date());
                if (result.result == "SUCCESS") { await this.fetchOrders(); }
                return result;
            } catch (error) { console.error(error); }
        },

        async confirmArrival(order_id) {
            try {
                const result = await update_order(order_id, null, new Date());
                if (result.result == "SUCCESS") { await this.fetchOrders(); }
                return result;
            } catch (error) { console.error(error); }
        },

        async rateArrivedOrder(order_id, user_rating, book_rating, comment) {
            try {
                const result = await update_order(order_id, null, null, comment, user_rating, book_rating);
                if (result.result == "SUCCESS") { await this.fetchOrders(); }
                return result;
            } catch (error) { console.error(error); }
        },

        async deleteOrder(order_id) {
            try {
                const result = await delete_order(order_id);
                if (result.result == "SUCCESS") { await this.fetchOrders(); }
                return result;
            }
            catch (error) { console.error(error); }
        }
    },
});