import { db } from '@/config/firebase_config'
import { collection, getDocs, addDoc, query, where, doc, getDoc, updateDoc } from 'firebase/firestore'
import { return_message } from '@/utils/io'
import { delete_edition } from '@/controllers/edition_controller'

// -- Enum de generos -- //
const generos = [
    'Ciencia Ficción',  // 2
    'Fantasía',         // 2
    'Terror',           // 1
    'Romance',          // 2
    'Aventura',         // 2
    'Misterio',         // 3
    'Histórico',        // 2
    'Biográfico',       // 1
    'Policiaco',        // 1
    'Drama',            // 1
    'Comedia',          // 1
    'Acción',           // 1
    'Suspense',         // 1
    'Otra'              // 0
]

async function create_book(title, author, genre, sinopsis, publicacion) {
    if(title == '' || author == '' || genre == '' || sinopsis == '') { return return_message("ERROR", "Hay campos vacíos") }
    if(title == null || author == null || genre == null || sinopsis == null) { return return_message("ERROR", "Faltan campos por rellenar") }
    if(!generos.includes(genre)) { return return_message("ERROR", "Género no válido") }

    const book = {
        title: title,
        author: author,
        genre: genre,
        sinopsis: sinopsis,
        primera_publicacion: publicacion
    }

    try{
        const book_ref = await addDoc(collection(db, 'books'), book)
        return return_message("SUCCESS", "Libro creado correctamente", book_ref.id)
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

async function get_books() {
    try {
        const books_query = query(collection(db, 'books'))
        const books_data = await getDocs(books_query)

        if(books_data.empty) return return_message("ERROR", "No hay libros en la base de datos")
        else {
            var books = []
            books_data.forEach(doc => { books.push({id: doc.id, data: doc.data()}) })

            return return_message("SUCCESS", "Libros obtenidos correctamente", books)
        }
    }
    catch (error) {
        return return_message("ERROR", error.message)
    }
}

async function update_book(id, title = null, author = null, genre = null, sinopsis = null, publicacion = null) {
    // Validate genre if provided
    if (genre != null && !generos.includes(genre)) {
        return return_message("ERROR", "Género no válido");
    }

    // Fetch the book document
    const bookRef = doc(db, 'books', id);
    const bookSnap = await getDoc(bookRef);
    if (!bookSnap.exists()) {
        return return_message("ERROR", "Libro no encontrado");
    }

    // Prepare the updates
    const updates = {};
    if (title != null) updates.title = title;
    if (author != null) updates.author = author;
    if (genre != null) updates.genre = genre;
    if (sinopsis != null) updates.sinopsis = sinopsis;
    if (publicacion != null) updates.primera_publicacion = publicacion;

    // Update the document
    try {
        await updateDoc(bookRef, updates);
        return return_message("SUCCESS", "Libro actualizado correctamente");
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function delete_book(id) {
    try {
        await deleteDoc(collection(db, 'books'), id)

        const editions_query = query(collection(db, 'editions'), where('book_id', '==', id))
        const editions_data = await getDocs(editions_query)

        if(!editions_data.empty) {
            editions_data.forEach(doc => { delete_edition(doc.id) })
        }

        return return_message("SUCCESS", "Libro eliminado correctamente")
    }
    catch(error) { return return_message("ERROR", error.message) }
}

export {
    generos,
    create_book, get_books, update_book, delete_book
}