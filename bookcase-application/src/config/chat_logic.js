import {
    ref,
    computed,
    watchEffect,
    nextTick,
    onMounted,
    onBeforeUnmount
  } from 'vue';
  import {
    doc,
    onSnapshot,
    updateDoc,
    serverTimestamp,
    collection,
    addDoc
  } from 'firebase/firestore';
  import { useRoute } from 'vue-router';
  import { useUserStore } from '@/stores/user_store';
  import { db } from '@/config/firebase_config';
  import { useI18n } from 'vue-i18n';
  import { listenToMessages, markMessagesAsRead } from '@/config/chat_conifg';
  
  export function useChatLogic() {
    const route = useRoute();
    const userStore = useUserStore();
    const { t, locale } = useI18n();
  
    const chatId = route.params.chatId;
    const currentUserId = computed(() => userStore.id);
    const newMessage = ref('');
    const messages = ref([]);
    const chatBox = ref(null);
    const otroUsuario = ref({});
    const isTyping = ref(false);
    const showEmojiPicker = ref(false);
    const defaultPhoto =
      'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  
    const receptorId = computed(() => otroUsuario.value?.id || null);
    let typingTimeout = null;
  
    function scrollToBottom() {
      nextTick(() => {
        if (chatBox.value) {
          chatBox.value.scrollTop = chatBox.value.scrollHeight;
        }
      });
    }
  
    function handleTyping() {
      notifyTyping();
      clearTimeout(typingTimeout);
      typingTimeout = setTimeout(() => {
        stopTyping();
      }, 1500);
    }
  
    function notifyTyping() {
      const chatDoc = doc(db, 'chats', chatId);
      updateDoc(chatDoc, {
        [`typing_${currentUserId.value}`]: true
      });
    }
  
    function stopTyping() {
      const chatDoc = doc(db, 'chats', chatId);
      updateDoc(chatDoc, {
        [`typing_${currentUserId.value}`]: false
      });
    }
  
    async function enviarMensaje() {
      if (!newMessage.value.trim()) return;
  
      const msgRef = collection(db, `chats/${chatId}/messages`);
      await addDoc(msgRef, {
        sender_id: currentUserId.value,
        text: newMessage.value.trim(),
        timestamp: serverTimestamp(),
        status: 'sent'
      });
  
      const chatDoc = doc(db, 'chats', chatId);
      await updateDoc(chatDoc, {
        last_message: newMessage.value.trim(),
        updated_at: serverTimestamp(),
        [`typing_${currentUserId.value}`]: false
      });
  
      newMessage.value = '';
      scrollToBottom();
    }
  
    function getDateLabel(date) {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
  
      const isSameDay = (d1, d2) =>
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear();
  
      if (isSameDay(date, today)) return t('chats.hoy');
      if (isSameDay(date, yesterday)) return t('chats.ayer');
  
      return date.toLocaleDateString(locale.value, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  
    const groupedMessages = computed(() => {
      const groups = [];
      const map = {};
  
      for (const msg of messages.value) {
        if (!msg.timestamp?.toDate) continue;
        const date = msg.timestamp.toDate();
        const label = getDateLabel(date);
  
        if (!map[label]) {
          map[label] = { label, messages: [] };
          groups.push(map[label]);
        }
        map[label].messages.push(msg);
      }
      return groups;
    });
  
    const lastReadIndex = computed(() => {
      for (let i = messages.value.length - 1; i >= 0; i--) {
        const msg = messages.value[i];
        if (
          msg.sender_id === currentUserId.value &&
          msg.read_by?.includes(receptorId.value)
        ) {
          return i;
        }
      }
      return -1;
    });
  
    function isLastRead(index) {
      return index === lastReadIndex.value;
    }
  
    function formatHora(timestamp) {
      if (!timestamp || !timestamp.toDate) return '';
      const date = timestamp.toDate();
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  
    function toggleEmojiPicker() {
      showEmojiPicker.value = !showEmojiPicker.value;
    }
  
    function addEmoji(event) {
      newMessage.value += event.detail.unicode;
    }
  
    async function obtenerContraparteYTyping() {
      const chatDocRef = doc(db, 'chats', chatId);
      onSnapshot(chatDocRef, async (docSnap) => {
        const data = docSnap.data();
        const otroId =
          data.buyer_id === currentUserId.value ? data.seller_id : data.buyer_id;
        const usuario = await userStore.fetchUserById(otroId);
        otroUsuario.value = usuario;
        isTyping.value = data[`typing_${otroId}`] === true;
      });
    }
  
    onMounted(() => {
      listenToMessages(chatId, async (snapshot) => {
        messages.value = snapshot.docs.map((doc) => doc.data());
        await markMessagesAsRead(chatId, currentUserId.value);
        scrollToBottom();
      });
      obtenerContraparteYTyping();
    });
  
    return {
      newMessage,
      messages,
      otroUsuario,
      isTyping,
      showEmojiPicker,
      chatBox,
      defaultPhoto,
      groupedMessages,
      isLastRead,
      formatHora,
      enviarMensaje,
      handleTyping,
      toggleEmojiPicker,
      addEmoji,
      currentUserId,
      receptorId
    };
  }
  