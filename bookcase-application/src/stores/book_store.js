import { defineStore } from 'pinia'
import { create_book, delete_book, get_books, update_book } from '@/controllers/book_controller'

export const useBookStore = defineStore('book', {
    state: () => ({ books: [] }),

    persist: { storage: window.localStorage, },

    actions: {
        async fetchBooks() {
            try {
                this.books = [] // Reiniciar la lista de libros
                const result = await get_books()
                if(result.result == "SUCCESS") { this.books = result.data }
            }
            catch(error) { console.error(error) }
        },

        async getBooks() {
            try {
                if(this.books.length == 0) { await this.fetchBooks() }
                return {
                    result: "SUCCESS",
                    message: "Libros obtenidos correctamente",
                    data: this.books
                }
            }
            catch(error) { console.error(error) }
        },

        async createBook(title, author, genre, sinopsis, year) {
            try {
                const result = await create_book(title, author, genre, sinopsis, year)
                if(result.result == "SUCCESS") { await this.fetchBooks() }
            }
            catch(error) { console.error(error) }
        },

        async updateBook(id, title = null, author = null, genre = null, sinopsis = null) {
            try {
                const result = await update_book(id, title, author, genre, sinopsis)
                if(result.result == "SUCCESS") { await this.fetchBooks() }
            }
            catch(error) { console.error(error) }
        },

        async deleteBook(id) {
            try {
                const result = await delete_book(id)
                if(result.result == "SUCCESS") { await this.fetchBooks() }
            }
            catch(error) { console.error(error) }
        },

        async getBooksFiltered(title = null, author = null, genre = null, year = null) {

            await this.fetchBooks()

            let filtered_books = await this.getBooks();
        
            if (title && title.trim() !== "") {
                filtered_books.data = filtered_books.data.filter(book => 
                    book.data.title.toLowerCase().includes(title.toLowerCase())
                );
            }
        
            if (author && author.trim() !== "") {
                filtered_books.data = filtered_books.data.filter(book => 
                    book.data.author.toLowerCase().includes(author.toLowerCase())
                );
            }
        
            if (genre && genre.trim() !== "") {
                filtered_books.data = filtered_books.data.filter(book => 
                    book.data.genre.toLowerCase().includes(genre.toLowerCase())
                );
            }
        
            if (year && year !== "") {
                const yearNum = Number(year);
        
                filtered_books.data = filtered_books.data.filter(book => 
                    book.data.primera_publicacion === yearNum
                );
            }
        
            return {
                result: "SUCCESS",
                message: "Libros filtrados correctamente",
                data: filtered_books.data
            };
        }
           
    }
})