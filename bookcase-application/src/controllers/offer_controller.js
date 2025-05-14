import { db } from '@/config/firebase_config'
import { collection, getDocs, addDoc, query, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { return_message } from '@/utils/io.js'
import { increase_stock, decrease_stock } from '@/controllers/edition_controller.js'

const offer_status = [
    'ACTIVE',
    'IN CART',
    'SOLD'
]

const book_condition = [
    'NEW',
    'LIKE NEW',
    'GOOD',
    'ACCEPTABLE',
    'BAD'
]

async function create_offer(edition_id, seller_id, language, condition, price, comment = '') {
    if(edition_id == '' || seller_id == '' || language == '' || condition == '' || price == '') { return return_message("ERROR", "Hay campos vacíos") }
    if(edition_id == null || seller_id == null || language == null || condition == null || price == null) { return return_message("ERROR", "Faltan campos por rellenar") }
    if(!book_condition.includes(condition)) { return return_message("ERROR", "Condición del libro no válida") }
    if(price <= 0) { return return_message("ERROR", "El precio debe ser mayor que 0") }

    // Check if the edition exists
    const editionRef = doc(db, 'editions', edition_id);
    const editionSnap = await getDoc(editionRef);
    if (!editionSnap.exists()) { return return_message("ERROR", "Edición no encontrada"); }

    // Check if the seller exists
    const sellerRef = doc(db, 'users', seller_id);
    const sellerSnap = await getDoc(sellerRef);
    if (!sellerSnap.exists()) { return return_message("ERROR", "Vendedor no encontrado"); }
    let seller_name = ""
    if(sellerSnap.data().name == '' || sellerSnap.data().name == null) { seller_name = sellerSnap.data().nickname }
    else { seller_name = sellerSnap.data().name }

    // Ensure price is a float
    if (typeof price !== 'number') {
        try { price = parseFloat(price); }
        catch (error) { return return_message("ERROR", "El precio no es un número válido"); }
    }
    if (isNaN(price)) { return return_message("ERROR", "El precio no es un número válido"); }

    const offer = {
        edition_id: edition_id,
        edition_book_name: editionSnap.data().book_title,
        seller_id: seller_id,
        seller_name: seller_name,
        status: offer_status[0],
        language: language,
        condition: condition,
        price: price,
        publication_date: new Date(),
        comment: comment,
    }

    try{
        const offer_ref = await addDoc(collection(db, 'offers'), offer)
        
        // Increase the stock of the edition
        const edition_result = await increase_stock(edition_id)
        if(edition_result.result == "ERROR") return return_message("ERROR", edition_result.message)
        
        return return_message("SUCCESS", "Oferta creada correctamente", offer_ref.id)
    }
    catch(error) {
        return return_message("ERROR", error.message)
    }
}

async function get_offers() {
    try {
        const offers_query = query(collection(db, 'offers'))
        const offers_data = await getDocs(offers_query)

        if(offers_data.empty) return return_message("ERROR", "No hay ofertas en la base de datos")
        else {
            var offers = []
            offers_data.forEach(doc => { offers.push({id: doc.id, data: doc.data()}) })

            return return_message("SUCCESS", "Ofertas obtenidas correctamente", offers)
        }
    }
    catch (error) {
        return return_message("ERROR", error.message)
    }
}

async function get_offer(id) {
    try {
        const offerRef = doc(db, 'offers', id)
        const offerSnap = await getDoc(offerRef)

        if (!offerSnap.exists()) {
            return return_message("ERROR", "Oferta no encontrada")
        } else {
            return return_message("SUCCESS", "Oferta obtenida correctamente", { id: offerSnap.id, data: offerSnap.data() })
        }
    }
    catch (error) { return return_message("ERROR", error.message) }
}

async function update_offer(id, status = null, language = null, condition = null, price = null, comment = null) {
    // Validate status if provided
    if (status != null && !offer_status.includes(status)) {
        return return_message("ERROR", "Estado de oferta no válido");
    }

    // Fetch the offer document
    const offerRef = doc(db, 'offers', id);
    const offerSnap = await getDoc(offerRef);
    if (!offerSnap.exists()) {
        return return_message("ERROR", "Oferta no encontrada");
    }

    // Prepare the updates
    const updates = {};
    if (status != null) updates.status = status;
    if (language != null) updates.language = language;
    if (condition != null) updates.condition = condition;
    if (price != null) updates.price = price;
    if (comment != null) updates.comment = comment;

    // Update the offer document
    await updateDoc(offerRef, updates);

    // If the status is changed to 'SOLD', decrease the stock of the edition
    if (status === 'SOLD') {
        const offerData = offerSnap.data();
        const edition_result = await decrease_stock(offerData.edition_id)
        if(edition_result.result == "ERROR") return return_message("ERROR", edition_result.message)
    }

    return return_message("SUCCESS", "Oferta actualizada correctamente");
}

async function delete_offer(id) {
    // Fetch the offer document
    const offerRef = doc(db, 'offers', id);
    const offerSnap = await getDoc(offerRef);
    if (!offerSnap.exists()) {
        return return_message("ERROR", "Oferta no encontrada");
    }

    // Check if the offer is in the cart or sold
    const offerData = offerSnap.data();
    if (offerData.status === 'IN CART' || offerData.status === 'SOLD') {
        return return_message("ERROR", "No se puede eliminar una oferta en el carrito o vendida");
    }

    // Delete the offer document
    await deleteDoc(offerRef);

    // Decrease the stock of the edition
    const edition_result = await decrease_stock(offerData.edition_id)
    if(edition_result.result == "ERROR") return return_message("ERROR", edition_result.message)
    
    return return_message("SUCCESS", "Oferta eliminada correctamente");
}

async function add_to_cart(offer_id) {
    // Obtenemos la oferta y comprobamos que existe y que no está vendida
    const offerRef = doc(db, 'offers', offer_id);
    const offerSnap = await getDoc(offerRef);
    if (!offerSnap.exists()) {
        return return_message("ERROR", "Oferta no encontrada");
    }
    const offerData = offerSnap.data();
    if (offerData.status === 'SOLD' || offerData.status === 'IN CART') {
        return return_message("ERROR", "No se puede añadir una oferta vendida o ya en el carrito");
    }

    // Actualizamos el estado de la oferta a 'IN CART'
    await updateDoc(offerRef, { status: 'IN CART' });
    return return_message("SUCCESS", "Oferta añadida al carrito correctamente");
}

async function remove_from_cart(offer_id) {
    // Obtenemos la oferta y comprobamos que existe y que está en el carrito
    const offerRef = doc(db, 'offers', offer_id);
    const offerSnap = await getDoc(offerRef);
    if (!offerSnap.exists()) {
        return return_message("ERROR", "Oferta no encontrada");
    }
    const offerData = offerSnap.data();
    console.log(offerData.status)
    if (offerData.status != "IN CART") {
        return return_message("ERROR", "La oferta no está en el carrito");
    }

    // Actualizamos el estado de la oferta a 'ACTIVE'
    await updateDoc(offerRef, { status: 'ACTIVE' });
    return return_message("SUCCESS", "Oferta eliminada del carrito correctamente");
}

export {
    offer_status,
    create_offer,
    get_offers,
    get_offer,
    update_offer,
    delete_offer,
    add_to_cart,
    remove_from_cart,
}