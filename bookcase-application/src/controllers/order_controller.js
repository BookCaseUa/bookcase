import { db } from '@/config/firebase_config'
import { collection, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { return_message } from '@/utils/io'
import { get_offer, update_offer, offer_status } from '@/controllers/offer_controller'
import { getUserById, SumarCompra, SumarVenta } from '@/controllers/user_controller'
import { total_sales } from '@/controllers/edition_controller'

/*
    Order status:
    - PENDING: Order created, waiting for payment
    - PAID: Order paid, waiting for shipment
    - SHIPPED: Order shipped, waiting for delivery
    - DELIVERED: Order delivered, completed
    - CANCELLED: Order cancelled, not completed
*/
const status = [
    'PAID',
    'SHIPPED',
    'ARRIVED',
]

/*
    Order atributes:
    - buyer_id: ID of the user who bought the book
    - buyer_name: Name of the user who bought the book
    - seller_id: ID of the user who sold the book
    - seller_name: Name of the user who sold the book
    - offer_ids: IDs of the offers that were bought
    - status: Status of the order (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
    - payment_date: Date of the payment
    - shipment_date: Date of the shipment
    - delivery_date: Date of the delivery
    - cancellation_date: Date of the cancellation
    - comment: Comment of the order
    - rating: Rating of the order (1-5)
    - total_price: Total price of the order
    - shipping_address: Shipping address of the order
    - shipping_cost: Shipping cost of the order
    - buying_date: Date of the order creation
*/
async function create_order(buyer_id, seller_id, offer_ids) {
    if(buyer_id == '' || seller_id == '') { return return_message("ERROR", "Hay campos vacíos") }
    if(buyer_id == null || seller_id == null) { return return_message("ERROR", "Faltan campos por rellenar") }
    if(buyer_id == seller_id) { return return_message("ERROR", "El comprador no puede ser el vendedor") }

    // Check if the buyer exists
    let buyer = await getUserById(buyer_id)
    if(buyer.result == "ERROR") { return return_message("ERROR", buyer.message) }
    buyer = buyer.data
    let buyer_name = ""
    if(buyer.data.name == '' || buyer.data.name == null) { buyer_name = buyer.data.nickname }
    else { buyer_name = buyer.data.name }

    // Check if the buyer has a valid address
    for(const key in buyer.data.direccion) {
        if(buyer.data.direccion[key] == '' || buyer.data.direccion[key] == null) {
            if(key != 'piso') { return return_message("ERROR", "La dirección del comprador no es válida") }
        }
    }

    // Check if the seller exists
    let seller = await getUserById(seller_id)
    if(seller.result == "ERROR") { return return_message("ERROR", seller.message) }
    seller = seller.data
    let seller_name = ""
    if(seller.data.name == '' || seller.data.name == null) { seller_name = seller.data.nickname }
    else { seller_name = seller.data.name }

    const order = {
        buyer_id: buyer_id,
        buyer_name: buyer_name,
        seller_id: seller_id,
        seller_name: seller_name,
        offer_ids: [],
        status: status[0],
        shipment_date: null,
        delivery_date: null,
        comment: null,
        user_rating: null,
        book_rating: null,
        total_price: 0,
        shipping_address: buyer.data.direccion,
        shipping_cost: 1.50,
        buying_date: new Date(),
    }
    
    // Check if the offers exist
    for(const offer_id of offer_ids) {
        const offer = await get_offer(offer_id)
        if(offer.result == "ERROR") { console.warn("[WARNING]" + offer.message) }
        else if(offer.data.status == "SOLD") { return return_message("ERROR", "La oferta no está disponible") }
        else if(offer.data.status == "ACTIVE") { return return_message("ERROR", "La oferta no está en el carrito") }
        else {
            order.offer_ids.push(offer_id)

            // Asegurar que el precio es un float
            if (typeof offer.data.price !== 'number') {
                try { offer.data.price = parseFloat(offer.data.data.price) }
                catch (error) { return return_message("ERROR", "El precio no es un número válido") }
            }
            if (isNaN(offer.data.price)) { return return_message("ERROR", "El precio no es un número válido") }

            order.total_price += offer.data.data.price

            // Increase the sales of the book
            const result = await total_sales(offer.data.data.edition_id)
        }
    }

    try{
        const order_ref = await addDoc(collection(db, 'orders'), order)

        // Update the offers with the order id
        for(const offer_id of order.offer_ids) {
            const result = await update_offer(offer_id, offer_status[2])
            if(result.result == "ERROR") { console.warn("[WARNING]" + result.message) }
        }

        // Update seller and buyer selling history
        const result_buyer = await SumarCompra(buyer_id)
        if(result_buyer.result == "ERROR") { console.warn("[WARNING]" + result_buyer.message) }
        const result_seller = await SumarVenta(seller_id)
        if(result_seller.result == "ERROR") { console.warn("[WARNING]" + result_seller.message) }

        return return_message("SUCCESS", "Orden creada correctamente", order_ref.id)
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function get_orders() {
    try {
        const orders_ref = collection(db, 'orders')
        const orders_query = await getDocs(orders_ref)
        const orders = orders_query.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        return return_message("SUCCESS", "Órdenes obtenidas correctamente", orders)
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function get_order(order_id) {
    if(order_id == '' || order_id == null) { return return_message("ERROR", "Faltan campos por rellenar") }

    try {
        const order_ref = doc(db, 'orders', order_id)
        const order_query = await getDoc(order_ref)
        if(!order_query.exists()) { return return_message("ERROR", "La orden no existe") }
        const order = { id: order_query.id, ...order_query.data() }
        return return_message("SUCCESS", "Orden obtenida correctamente", order)
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function update_order(order_id, shipment_date = null, delivery_date = null, comment = null, user_rating = null, book_rating = null) {
    if(order_id == '' || order_id == null) { return return_message("ERROR", "Faltan campos por rellenar") }

    try {
        const order_ref = doc(db, 'orders', order_id)
        const order_query = await getDoc(order_ref)
        if(!order_query.exists()) { return return_message("ERROR", "La orden no existe") }
        const order = { id: order_query.id, ...order_query.data() }

        // Update the order with the new values
        if(shipment_date != null) { 
            order.shipment_date = shipment_date
            order.status = status[1]
        }
        if(delivery_date != null) { 
            order.delivery_date = delivery_date
            order.status = status[2]
         }
        if(comment != null) { order.comment = comment }
        if(user_rating != null) { order.user_rating = user_rating }
        if(book_rating != null) { order.book_rating = book_rating }

        await updateDoc(order_ref, order)

        return return_message("SUCCESS", "Orden actualizada correctamente")
    }
    catch(error) { return return_message("ERROR", error.message) }
}

async function delete_order(order_id) {
    if(order_id == '' || order_id == null) { return return_message("ERROR", "Faltan campos por rellenar") }

    try {
        const order_ref = doc(db, 'orders', order_id)
        const order_query = await getDoc(order_ref)
        if(!order_query.exists()) { return return_message("ERROR", "La orden no existe") }
        await deleteDoc(order_ref)
        return return_message("SUCCESS", "Orden eliminada correctamente")
    }
    catch(error) { return return_message("ERROR", error.message) }
}

export {
    status,
    create_order,
    get_orders,
    get_order,
    update_order,
    delete_order,
}