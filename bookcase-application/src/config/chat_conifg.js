import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    addDoc,
    serverTimestamp,
    onSnapshot,
    orderBy
} from 'firebase/firestore'

import { db } from '@/config/firebase_config'
  
  // Crear o recuperar un chat entre comprador y vendedor
  export async function getOrCreateChat(buyerId, sellerId, offerId) {
    const chatRef = collection(db, "chats")
    const q = query(chatRef,
      where("buyer_id", "==", buyerId),
      where("seller_id", "==", sellerId),
      where("offer_id", "==", offerId)
    )
  
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      return snapshot.docs[0].id
    }
  
    const newChat = await addDoc(chatRef, {
      buyer_id: buyerId,
      seller_id: sellerId,
      offer_id: offerId,
      participants: [buyerId, sellerId],
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
      last_message: "",
      deletedFor: [],
      unread_buyer: 0,
      unread_seller: 0
    })    
  
    return newChat.id
  }
  
  // Escuchar mensajes en tiempo real
  export function listenToMessages(chatId, callback) {
    const msgRef = collection(db, `chats/${chatId}/messages`)
    const q = query(msgRef, orderBy("timestamp"))
    return onSnapshot(q, callback)
  }
  
  // Enviar mensaje
  export async function sendMessage(chatId, senderId, text) {
    const msgRef = collection(db, `chats/${chatId}/messages`)
    await addDoc(msgRef, {
      sender_id: senderId,
      text,
      timestamp: serverTimestamp(),
      read_by: [] 
    })
  
    // Actualizar contador de no leídos
    const chatDoc = doc(db, "chats", chatId)
    const chatSnapshot = await getDoc(chatDoc)
  
    if (chatSnapshot.exists()) {
      const chatData = chatSnapshot.data()
  
      let fieldToUpdate = ""
      if (senderId === chatData.buyer_id) {
        fieldToUpdate = "unread_seller"
      } else if (senderId === chatData.seller_id) {
        fieldToUpdate = "unread_buyer"
      }
  
      if (fieldToUpdate) {
        await updateDoc(chatDoc, {
          [fieldToUpdate]: (chatData[fieldToUpdate] || 0) + 1,
          updated_at: serverTimestamp()
        })
      }
    }
  }    

  export async function getChatsForUser(userId) {
    const chatRef = collection(db, "chats")
  
    const q = query(chatRef,
      where("participants", "array-contains", userId)
    )
  
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  }

  export async function markMessagesAsRead(chatId, userId) {
    const msgRef = collection(db, `chats/${chatId}/messages`)
    const snapshot = await getDocs(msgRef)
  
    const updates = snapshot.docs.map(async msg => {
      const data = msg.data()
      if (!data.read_by?.includes(userId)) {
        const msgDoc = doc(db, `chats/${chatId}/messages`, msg.id)
        await updateDoc(msgDoc, {
          read_by: [...(data.read_by || []), userId]
        })
      }
    })
  
    await Promise.all(updates)
  }
