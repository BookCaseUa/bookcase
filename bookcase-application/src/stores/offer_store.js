import { defineStore } from 'pinia';
import { create_offer, delete_offer, get_offers, update_offer, add_to_cart, remove_from_cart } from '@/controllers/offer_controller';

export const useOfferStore = defineStore('offer', {
    state: () => ({ offers: [] }),

    persist: { storage: window.localStorage },

    actions: {
        async fetchOffers() {
            try {
                this.offers = []; // Clear the offers array before fetching new data
                const result = await get_offers();
                if (result.result === "SUCCESS") { this.offers = result.data; }
            } catch (error) { console.error(error); }
        },

        async getOffers() {
            await this.fetchOffers(); 
            try {
                if (this.offers.length === 0) { 
                    console.log("Fetching offers from the database...")
                }
                else { console.log("Offers already fetched from the database.") }
                return {
                    result: "SUCCESS",
                    message: "Ofertas obtenidas correctamente",
                    data: this.offers
                }
            } catch (error) { console.error(error); }
        },

        async getOffer(id) {
            try {
                if(this.offers.length === 0) { await this.fetchOffers(); }
                const offer = this.offers.find(offer => offer.id === id);
                if (offer) {
                    return {
                        result: "SUCCESS",
                        message: "Oferta obtenida correctamente",
                        data: offer
                    }
                }
                else {
                    return {
                        result: "ERROR",
                        message: "Oferta no encontrada",
                        data: null
                    }
                }
            } catch (error) { console.error(error); }
        },
        
        async createOffer(edition_id, seller_id, language, condition, price, comment = '') {
            try {
                const result = await create_offer(edition_id, seller_id, language, condition, price, comment);
                if (result.result === "SUCCESS") { await this.fetchOffers(); }
            } catch (error) { console.error(error); }
        },

        async updateOffer(id, status = null, language = null, condition = null, price = null, comment = null) {
            try {
                const result = await update_offer(id, status, language, condition, price, comment);
                if (result.result === "SUCCESS") { await this.fetchOffers(); }
            } catch (error) { console.error(error); }
        },

        async deleteOffer(id) {
            try {
                const result = await delete_offer(id);
                if (result.result === "SUCCESS") { await this.fetchOffers(); }
            } catch (error) { console.error(error); }
        },

        async getOffersForEditionFiltered(edition_id, status = null, language = null, condition = null) {
            // Filtered offers
            var filtered_offers = await this.getOffers();
            var filtered_offers = filtered_offers.data

            // Apply filters
            if (edition_id != null) { filtered_offers = filtered_offers.filter(offer => offer.data.edition_id == edition_id); }
            if (status != null) { filtered_offers = filtered_offers.filter(offer => offer.data.status == status); }
            if (language != null) { filtered_offers = filtered_offers.filter(offer => offer.data.language == language); }
            if (condition != null) { filtered_offers = filtered_offers.filter(offer => offer.data.condition == condition); }

            return {
                result: "SUCCESS",
                message: "Ofertas filtradas correctamente",
                data: filtered_offers
            }
        },

        async getOffersForUserFiltered(user_id, status = null, language = null, condition = null) {

            var filtered_offers = await this.getOffers();
            var filtered_offers = filtered_offers.data;
            

            // Apply filters
            if (user_id != null) { filtered_offers = filtered_offers.filter(offer => offer.data.seller_id == user_id); }
            if (status != null) { filtered_offers = filtered_offers.filter(offer => offer.data.status == status); }
            if (language != null) { filtered_offers = filtered_offers.filter(offer => offer.data.language == language); }
            if (condition != null) { filtered_offers = filtered_offers.filter(offer => offer.data.condition == condition); }

            return {
                result: "SUCCESS",
                message: "Ofertas filtradas correctamente",
                data: filtered_offers
            }
        },

        async add_to_cart(offer_id) {
            try {
                const result = await add_to_cart(offer_id);
                if (result.result === "SUCCESS") { await this.fetchOffers(); }
                return result;
            } catch (error) { console.error(error); }
        },

        async remove_from_cart(offer_id) {
            try {
                console.log("Removing from cart, offer_id:", offer_id); // Debug log
                const result = await remove_from_cart(offer_id);
                if (result.result === "SUCCESS") { await this.fetchOffers(); }
                return result;
            } catch (error) {
                console.error("Error in remove_from_cart:", error); // Improved error logging
            }
        }
    }
})