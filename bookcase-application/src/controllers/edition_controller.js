import { db } from '@/config/firebase_config'
import { collection, getDocs, addDoc, query, doc, getDoc, updateDoc } from 'firebase/firestore'
import { return_message } from '@/utils/io'

const types = [
    'Tapa blanda',
    'Tapa dura',
    'Bolsillo',
    'Box Set',
    'Otro'
]

async function create_edition(book_id, edition_type, year, editorial, type, image = null, observations = '') {
    if(book_id == '' || edition_type == '' || year == '' || editorial == '' || type == '') { return return_message("ERROR", "Hay campos vacíos"); }
    if(book_id == null || edition_type == null || year == null || editorial == null || type == null) { return return_message("ERROR", "Faltan campos por rellenar"); }
    if(!types.includes(type)) { return return_message("ERROR", "Tipo de edición no válido"); }

    const book = await getDoc(doc(db, 'books', book_id)); // Fixed line
    if(!book.exists()) return return_message("ERROR", "Libro no encontrado");

    const edition = {
        book_id: book_id,
        book_title: book.data().title,
        edition: edition_type,
        year: year,
        editorial: editorial,
        type: type,
        observations: observations,
        disponibles: 0,
        ventas_totales: 0
    };

    if(image != null) edition.image = image;
    else edition.image = "https://placehold.co/400x600";

    try {
        const edition_ref = await addDoc(collection(db, 'editions'), edition);
        return return_message("SUCCESS", "Edición creada correctamente", edition_ref.id);
    } catch(error) { 
        return return_message("ERROR", error.message); 
    }
}

async function get_editions() {
    try {
        const editions_query = query(collection(db, 'editions'))
        const editions_data = await getDocs(editions_query)

        if(editions_data.empty) return return_message("ERROR", "No hay ediciones en la base de datos")
        else {
            var editions = []
            editions_data.forEach(doc => { editions.push({id: doc.id, data: doc.data()}) })

            return return_message("SUCCESS", "Ediciones obtenidas correctamente", editions)
        }
    }
    catch (error) { return return_message("ERROR", error.message) }
}

async function update_edition(id, book_id = null, edition = null, year = null, editorial = null, type = null, image = null, observations = null) {
    // Validate type if provided
    if (type != null && !types.includes(type)) {
        return return_message("ERROR", "Tipo de edición no válido");
    }

    // Fetch the edition document
    const editionRef = doc(db, 'editions', id);
    const editionSnap = await getDoc(editionRef);
    if (!editionSnap.exists()) {
        return return_message("ERROR", "Edición no encontrada");
    }

    // Prepare the updates
    const updates = {};
    if (book_id != null) updates.book_id = book_id;
    if (edition != null) updates.edition = edition;
    if (year != null) updates.year = year;
    if (editorial != null) updates.editorial = editorial;
    if (type != null) updates.type = type;
    if (image != null) updates.image = image;
    if (observations != null) updates.observations = observations;

    // Update the document
    try {
        await updateDoc(editionRef, updates);
        return return_message("SUCCESS", "Edición actualizada correctamente");
    } catch (error) {
        return return_message("ERROR", error.message);
    }
}

async function delete_edition(id) {
    try {
        await deleteDoc(collection(db, 'editions'), id)
        return return_message("SUCCESS", "Edición eliminada correctamente")
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function stock(id, amount) {
    if (amount != 1 && amount != -1) { return return_message("ERROR", "Cantidad no válida, debe ser 1 o -1"); }

    const editionRef = doc(db, 'editions', id);
    const editionSnap = await getDoc(editionRef);
    if (!editionSnap.exists()) {
        return return_message("ERROR", "Edición no encontrada");
    }

    const currentStock = editionSnap.data().disponibles || 0;
    const newStock = currentStock + amount;
    await updateDoc(editionRef, { disponibles: newStock });
    return return_message("SUCCESS", "Stock actualizado correctamente", newStock);
}

async function increase_stock(id) {
    const result = await stock(id, 1)
    return result
}

async function decrease_stock(id) {
    const result = await stock(id, -1)
    return result
}

async function total_sales(id) {
    const editionRef = doc(db, 'editions', id);
    const editionSnap = await getDoc(editionRef);
    if (!editionSnap.exists()) {
        return return_message("ERROR", "Edición no encontrada");
    }

    const currentSales = editionSnap.data().ventas_totales || 0;
    const newSales = currentSales + 1;
    await updateDoc(editionRef, { ventas_totales: newSales });
    return return_message("SUCCESS", "Ventas totales actualizadas correctamente", newSales);
}

export {
    types,
    create_edition, get_editions, update_edition, delete_edition, 
    increase_stock, decrease_stock, total_sales
}