import { defineStore } from 'pinia'
import { create_edition, get_editions, update_edition, delete_edition } from '@/controllers/edition_controller'
import { useBookStore } from './book_store'

export const useEditionStore = defineStore('edition', {
    state: () => ({ editions: [] }),

    persist: { storage: window.localStorage, },

    actions: {
        async fetchEditions() {
            try {
                this.editions = [] // Reiniciar la lista de ediciones
                const result = await get_editions()
                if(result.result == "SUCCESS") { this.editions = result.data }
            }
            catch(error) { console.error(error) }
        },

        async getEditions() {
            try {
                if(this.editions.length == 0) { await this.fetchEditions() }
                return {
                    result: "SUCCESS",
                    message: "Ediciones obtenidas correctamente",
                    data: this.editions
                }
            }
            catch(error) { console.error(error) }
        },

        async createEdition(book_id, edition, year, editorial, type, image = null, observations = '') {
            try {
                const result = await create_edition(book_id, edition, year, editorial, type, image, observations)
                if(result.result == "SUCCESS") { await this.fetchEditions() }
            }
            catch(error) { console.error(error) }
        },

        async updateEdition(id, book_id = null, edition = null, year = null, editorial = null, type = null, image = null, observations = null) {
            try {
                const result = await update_edition(id, book_id, edition, year, editorial, type, image, observations)
                if(result.result == "SUCCESS") { await this.fetchEditions() }
            }
            catch(error) { console.error(error) }
        },

        async deleteEdition(id) {
            try {
                const result = await delete_edition(id)
                if(result.result == "SUCCESS") { await this.fetchEditions() }
            }
            catch(error) { console.error(error) }
        },

        async getEditionsFiltered(book_title = null, author = null, genre = null, year = null, type = null, editorial = null ) {

            await this.fetchEditions()
            
            const bookStore = useBookStore();
        
            let filtered_books = await bookStore.getBooksFiltered(book_title, author, genre, year);
        
            let filtered_editions = await this.getEditions();
        
            
        
            if (filtered_books.data.length === 0) {
                return filtered_editions;
            }
        
            filtered_editions = filtered_editions.data.filter(edition => 
                filtered_books.data.some(book => book.id === edition.data.book_id)
            );

        
            if (editorial != null && editorial.trim() !== "") {
                filtered_editions = filtered_editions.filter(ed => 
                    ed.data.editorial.toLowerCase().includes(editorial.toLowerCase())
                );
            }
        
            if (type != null && type.trim() !== "") {
                filtered_editions = filtered_editions.filter(ed => 
                    ed.data.type === type
                );
            }
        

            console.log("Books:", filtered_books);
            console.log("Editions:", filtered_editions);
            return {
                result: "SUCCESS",
                message: "Ediciones filtradas correctamente",
                data: filtered_editions
            };
        }
        
        
    }
})