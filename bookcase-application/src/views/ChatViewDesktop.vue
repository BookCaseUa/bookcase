<template>
    <div class="header-skip"></div>
    <v-container
      class="chat-container"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <!-- Header del chat -->
      <div class="chat-header d-flex align-center">
        <v-avatar size="48" class="mr-3">
          <v-img :src="otroUsuario.data?.profile_photo || defaultPhoto" />
        </v-avatar>
        <div>
          <div class="font-weight-bold text-subtitle-1">
            {{ otroUsuario.data?.nickname || $t("chats.usuario") }}
          </div>
          <div v-if="isTyping" class="text-caption grey--text">Escribiendo</div>
        </div>
      </div>
  
      <!-- Mensajes -->
      <div class="chat-messages" ref="chatBox">
        <transition-group name="fade" tag="div">
          <template v-for="(group, index) in groupedMessages" :key="index">
            <div class="date-divider">{{ group.label }}</div>
            <div
              v-for="(msg, idx) in group.messages"
              :key="`${index}-${idx}`"
              class="message-row"
              :class="msg.sender_id === currentUserId ? 'sent' : 'received'"
            >
              <div class="message">
                <div class="message-content">
                  {{ msg.text }}
                  <span class="message-meta">
                    {{ formatHora(msg.timestamp) }}
                    <v-icon
                      v-if="msg.sender_id === currentUserId"
                      size="16"
                      class="status-icon"
                      :class="
                        isLastRead(messages.indexOf(msg))
                          ? 'check-leido'
                          : 'check-no-leido'
                      "
                    >
                      mdi-check-all
                    </v-icon>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </transition-group>
      </div>
  
      <!-- Input mejorado -->
      <div class="chat-input-modern">
        <v-icon class="emoji-icon" @click.stop="toggleEmojiPicker">
          mdi-emoticon-outline
        </v-icon>
        <input
          v-model="newMessage"
          :placeholder="$t('chats.escribirMensaje')"
          class="message-input"
          @keydown="handleTyping"
          @keydown.enter.prevent="enviarMensaje"
        />
        <v-icon class="send-icon" @click="enviarMensaje"> mdi-send </v-icon>
      </div>
  
      <!-- Emoji Picker -->
      <transition name="fade">
        <div
          v-if="showEmojiPicker"
          class="emoji-picker"
          :class="{ 'emoji-picker-mobile': isMobile }"
        >
          <emoji-picker @emoji-click="addEmoji"></emoji-picker>
        </div>
      </transition>
    </v-container>
  </template>
  
  <script setup>
  import {
    ref,
    onMounted,
    onBeforeUnmount,
    nextTick,
    computed,
    watchEffect,
  } from "vue";
  import { useRoute } from "vue-router";
  import { listenToMessages } from "@/config/chat_conifg";
  import { useUserStore } from "@/stores/user_store";
  import {
    doc,
    onSnapshot,
    updateDoc,
    serverTimestamp,
    collection,
    addDoc,
  } from "firebase/firestore";
  import { db } from "@/config/firebase_config";
  import "emoji-picker-element";
  import { markMessagesAsRead } from "@/config/chat_conifg";
  import { useI18n } from "vue-i18n";
  
  const route = useRoute();
  const userStore = useUserStore();
  const { t, locale } = useI18n();
  const chatId = route.params.chatId;
  const currentUserId = userStore.id;
  const newMessage = ref("");
  const messages = ref([]);
  const chatBox = ref(null);
  const otroUsuario = ref({ nickname: "", profile_photo: "" });
  const receptorId = computed(() => otroUsuario.value?.id || null);
  const isTyping = ref(false);
  const defaultPhoto = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const showEmojiPicker = ref(false);
  
  const isMobile = computed(() => window.innerWidth <= 600);
  
  let typingTimeout = null;
  
  function toggleEmojiPicker() {
    showEmojiPicker.value = !showEmojiPicker.value;
  }
  
  function addEmoji(event) {
    newMessage.value += event.detail.unicode;
    // No cerramos aquí el picker para permitir poner varios emojis
  }
  
  function handleClickOutside(event) {
    const picker = document.querySelector(".emoji-picker");
    const toggleButton = document.querySelector(".mdi-emoticon-outline");
    if (
      picker &&
      !picker.contains(event.target) &&
      (!toggleButton || !toggleButton.contains(event.target))
    ) {
      showEmojiPicker.value = false;
    }
  }
  
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
  
  function getDateLabel(date) {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();
  
    if (isSameDay(date, today)) return t("chats.hoy");
    if (isSameDay(date, yesterday)) return t("chats.ayer");
  
    return date.toLocaleDateString(locale.value, {
      day: "numeric",
      month: "long",
      year: "numeric",
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
        map[label] = {
          label,
          messages: [],
        };
        groups.push(map[label]);
      }
  
      map[label].messages.push(msg);
    }
  
    return groups;
  });
  
  async function enviarMensaje() {
    if (!newMessage.value.trim()) return;
  
    const msgRef = collection(db, `chats/${chatId}/messages`);
    await addDoc(msgRef, {
      sender_id: currentUserId,
      text: newMessage.value.trim(),
      timestamp: serverTimestamp(),
      status: "sent",
    });
  
    const chatDoc = doc(db, "chats", chatId);
    await updateDoc(chatDoc, {
      last_message: newMessage.value.trim(),
      updated_at: serverTimestamp(),
      [`typing_${currentUserId}`]: false,
    });
  
    newMessage.value = "";
    scrollToBottom();
  }
  
  function notifyTyping() {
    const chatDoc = doc(db, "chats", chatId);
    updateDoc(chatDoc, {
      [`typing_${currentUserId}`]: true,
    });
  }
  
  function stopTyping() {
    const chatDoc = doc(db, "chats", chatId);
    updateDoc(chatDoc, {
      [`typing_${currentUserId}`]: false,
    });
  }
  
  async function obtenerContraparteYTyping() {
    const chatDocRef = doc(db, "chats", chatId);
    onSnapshot(chatDocRef, async (docSnap) => {
      const data = docSnap.data();
      const otroId =
        data.buyer_id === currentUserId ? data.seller_id : data.buyer_id;
      const usuario = await userStore.fetchUserById(otroId);
      otroUsuario.value = usuario;
      isTyping.value = data[`typing_${otroId}`] === true;
    });
  }
  
  const lastReadIndex = computed(() => {
    for (let i = messages.value.length - 1; i >= 0; i--) {
      const msg = messages.value[i];
      if (
        msg.sender_id === currentUserId &&
        msg.read_by?.includes(receptorId.value)
      ) {
        console.log("Mensaje leído por receptor:", msg.text, i);
        return i;
      }
    }
    return -1;
  });
  
  function isLastRead(index) {
    console.log("index:", index, "lastReadIndex:", lastReadIndex.value);
    return index === lastReadIndex.value;
  }
  
  function formatHora(timestamp) {
    if (!timestamp || !timestamp.toDate) return "";
    const date = timestamp.toDate();
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  
  function aplicarEstilosEmojiPicker() {
    const tema = document.documentElement.getAttribute("data-theme");
    const picker = document.querySelector("emoji-picker");
    if (!picker) return;
  
    if (tema === "light") {
      // Estilos por CSS variables
      picker.style.setProperty("--background", "#ffffff");
      picker.style.setProperty("--color", "#1e1e1e");
      picker.style.setProperty("--border-color", "#ddd");
      picker.style.setProperty("--category-button-color", "#333");
      picker.style.setProperty("--category-button-active-color", "#2c3e50");
      picker.style.setProperty("--indicator-color", "#2c3e50");
      picker.style.setProperty("--search-input-background", "#f8f8f8");
      picker.style.setProperty("--search-input-color", "#1e1e1e");
  
      // ⚠️ Fuerza color de texto y cursor del input de búsqueda
      const input = picker.shadowRoot?.querySelector("input");
      if (input) {
        input.style.color = "#1e1e1e";
        input.style.backgroundColor = "#ffffff";
        input.style.caretColor = "#1e1e1e";
      }
    } else {
      // Estilos para modo oscuro
      picker.style.setProperty("--background", "#1e1e1e");
      picker.style.setProperty("--color", "#f0f0f0");
      picker.style.setProperty("--border-color", "#444");
      picker.style.setProperty("--category-button-color", "#f0f0f0");
      picker.style.setProperty("--category-button-active-color", "#ffffff");
      picker.style.setProperty("--indicator-color", "#f0f0f0");
      picker.style.setProperty("--search-input-background", "#2c2c2c");
      picker.style.setProperty("--search-input-color", "#ffffff");
  
      const input = picker.shadowRoot?.querySelector("input");
      if (input) {
        input.style.color = "#ffffff";
        input.style.backgroundColor = "#2c2c2c";
        input.style.caretColor = "#ffffff";
      }
    }
  }
  
  watchEffect(() => {
    if (showEmojiPicker.value) {
      // Espera a que el componente esté montado
      nextTick(() => {
        setTimeout(aplicarEstilosEmojiPicker, 50);
      });
    }
  });
  
  const backgroundImage = ref("");
  
  function updateBackgroundImage() {
    const theme = document.documentElement.getAttribute("data-theme") || "light";
    backgroundImage.value =
      theme === "dark"
        ? "https://raw.githubusercontent.com/BookCaseUa/bookcase/main/wallapaper-dark.png"
        : "https://raw.githubusercontent.com/BookCaseUa/bookcase/main/wallapaper.png";
  }
  
  // Actualiza inmediatamente
  updateBackgroundImage();
  
  onMounted(() => {
    function setVH() {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }
    setVH();
    window.addEventListener("resize", setVH);
  
    listenToMessages(chatId, async (snapshot) => {
      messages.value = snapshot.docs.map((doc) => doc.data());
      await markMessagesAsRead(chatId, userStore.id);
      scrollToBottom();
    });
  
    obtenerContraparteYTyping();
    document.addEventListener("click", handleClickOutside);
  
    // ✅ Observar cambios en data-theme para fondo reactivo
    const observer = new MutationObserver(updateBackgroundImage);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  
    onBeforeUnmount(() => {
      observer.disconnect();
    });
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener("click", handleClickOutside);
  });
  </script>
  
  <style scoped>
  .header-skip {
    height: 40px;
  }
  
  .chat-container {
    display: flex;
    flex-direction: column;
    height: calc(var(--vh, 1vh) * 100 - 236px);
    max-width: 900px;
    margin: auto;
    padding: 0;
    border-radius: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    box-sizing: border-box;
  
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  
  .chat-header {
    width: 100%;
    padding: 16px;
    background-color: var(--color-background-soft);
    border-bottom: 1px solid var(--color-border);
    box-sizing: border-box;
  }
  
  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
  }
  
  .message-row {
    display: flex;
    margin-bottom: 4px;
  }
  
  .sent {
    justify-content: flex-end;
  }
  .received {
    justify-content: flex-start;
  }
  
  .message {
    max-width: 65%;
    padding: 10px 14px;
    border-radius: 16px;
    word-break: break-word;
  }
  
  .sent .message {
    background-color: #5d6d7e;
    border-bottom-right-radius: 4px;
    color: white;
  }
  .received .message {
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border);
    border-bottom-left-radius: 4px;
    color: var(--color-text);
  }
  
  .check-leido {
    color: white;
  }
  
  .check-no-leido {
    color: grey;
  }
  
  .message-content {
    font-size: 15px;
    position: relative;
    display: inline-block;
    max-width: 100%;
  }
  .message-meta {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    margin-left: 8px;
    font-size: 10px;
    vertical-align: bottom;
  }
  
  .sent .message-content,
  .sent .message-meta {
    color: white;
  }
  .received .message-content {
    color: var(--color-text);
  }
  
  .chat-input {
    width: 100%;
    padding: 12px;
    display: flex;
    align-items: center;
    background-color: var(--color-background-soft);
    border-top: 1px solid var(--color-border);
    box-sizing: border-box;
  }
  
  .input-box {
    flex: 1;
    margin: 0 8px;
  }
  
  .chat-input-modern {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: var(--color-background-soft);
    box-sizing: border-box;
    border-top: 1px solid var(--color-border);
    gap: 10px;
  }
  
  .message-input {
    flex: 1;
    padding: 10px 14px;
    font-size: 15px;
    border: none;
    outline: none;
    background-color: var(--color-background);
    color: var(--color-text);
    border-radius: 24px;
    box-shadow: none;
    transition: background-color 0.3s ease;
  }
  
  .message-input::placeholder {
    color: var(--color-text);
    opacity: 0.5;
  }
  
  .emoji-icon,
  .send-icon {
    cursor: pointer;
    color: var(--color-text);
    transition: color 0.2s ease;
    font-size: 24px;
  }
  
  .emoji-icon:hover,
  .send-icon:hover {
    color: var(--color-primary);
  }
  
  .send-btn {
    min-width: 48px;
    height: 48px;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  }
  
  /* 🎯 Estilo visual del emoji-picker */
  .emoji-picker {
    width: 320px;
    max-height: 400px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    bottom: 150px;
    left: 145px;
    z-index: 20;
    border-radius: 12px;
    border: 1px solid var(--color-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
  
  .emoji-picker-mobile {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }
  
  .emoji-toggle-btn {
    color: var(--color-text) !important;
  }
  
  .emoji-input-icon {
    cursor: pointer;
    color: var(--color-text);
    transition: color 0.2s ease;
  }
  
  .emoji-input-icon:hover {
    color: var(--color-primary);
  }
  
  ::v-deep(.emoji-toggle-btn .v-icon svg path) {
    fill: currentColor !important;
  }
  
  /* 🎯 Estilo principal del separador de fecha */
  .date-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 13px;
    color: var(--color-text);
    margin: 24px 0 16px;
    position: relative;
    opacity: 0;
    transform: translateY(10px);
    animation: fadeInSlideUp 0.3s ease forwards;
    text-transform: capitalize; /* 👈 primera letra mayúscula */
  }
  
  /* 🧩 Líneas a izquierda y derecha del texto */
  .date-divider::before,
  .date-divider::after {
    content: "";
    flex: 1;
    height: 1px;
    background-color: var(--color-border);
    margin: 0 12px;
  }
  
  /* 🎞 Animación de entrada suave */
  @keyframes fadeInSlideUp {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 💬 Opcional: burbuja envolvente del texto (si usas <span class="date-label">) */
  .date-label {
    background-color: var(--color-background-soft);
    padding: 4px 12px;
    border-radius: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    backdrop-filter: blur(4px);
    color: var(--color-text);
    font-weight: 500;
  }
  
  @media (prefers-color-scheme: dark) {
    ::v-deep(.emoji-toggle-btn .v-icon svg path) {
      fill: currentColor !important;
    }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.3s ease;
  }
  .fade-enter-from {
    opacity: 0;
    transform: translateY(10px);
  }
  .fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
  }
  
  @media (max-width: 600px) {
    .message {
      max-width: 75%;
      font-size: 14px;
    }
    .message-meta {
      font-size: 10px;
    }
  }
  
  /* 🎨 Colores fijos para el emoji-picker (modo claro y oscuro) */
  emoji-picker {
    --background: #ffffff;
    --color: #1e1e1e;
    --border-color: #ddd;
    --category-button-color: #333;
    --category-button-active-color: #2c3e50;
    --indicator-color: #2c3e50;
    --search-input-background: #f8f8f8;
    --search-input-color: #1e1e1e;
    --font-family: "Inter", sans-serif;
    --emoji-size: 1.2rem;
  }
  
  @media (prefers-color-scheme: dark) {
    emoji-picker {
      --background: #1e1e1e;
      --color: #f0f0f0;
      --border-color: #444;
      --category-button-color: #f0f0f0;
      --category-button-active-color: #ffffff;
      --indicator-color: #f0f0f0;
      --search-input-background: #2c2c2c;
      --search-input-color: #ffffff;
      --font-family: "Inter", sans-serif;
      --emoji-size: 1.2rem;
    }
  }
  
  /* Asegura que el botón del emoji se vea bien en todos los temas */
  .emoji-icon-btn {
    color: var(--color-text) !important;
    background-color: transparent !important;
  }
  
  /* 🔧 Fuerza que el icono herede el color correctamente */
  ::v-deep(.emoji-icon-btn .v-icon svg) {
    fill: currentColor !important;
  }
  
  /* 🌙 Compatibilidad adicional con modo oscuro */
  @media (prefers-color-scheme: dark) {
    ::v-deep(.emoji-icon-btn .v-icon svg) {
      fill: currentColor !important;
    }
  }
  
  /* Modo claro: scrollbar clara */
  :root[data-theme="light"] emoji-picker::-webkit-scrollbar {
    width: 6px;
  }
  :root[data-theme="light"] emoji-picker::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  }
  :root[data-theme="light"] emoji-picker::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  
  :root[data-theme="light"] emoji-picker {
    scrollbar-color: #ccc #f1f1f1;
    scrollbar-width: thin;
  }
  
  :root[data-theme="light"] emoji-picker::part(search) {
    color: #1e1e1e !important;
    caret-color: #1e1e1e !important;
    background-color: white !important;
  }
  
  :root[data-theme="light"] emoji-picker::part(search-input) {
    color: #1e1e1e !important;
  }
  
  :root[data-theme="light"] emoji-picker input {
    color: #1e1e1e !important;
    background-color: white !important;
    caret-color: #1e1e1e !important;
  }
  
  /* 🌙 Scrollbar en modo oscuro */
  :root[data-theme="dark"] .chat-messages::-webkit-scrollbar {
    width: 8px;
  }
  
  :root[data-theme="dark"] .chat-messages::-webkit-scrollbar-track {
    background: #1c1c1c;
  }
  
  :root[data-theme="dark"] .chat-messages::-webkit-scrollbar-thumb {
    background-color: #666;
    border-radius: 4px;
    border: 1px solid #444;
  }
  
  /* ☀️ Scrollbar en modo claro */
  :root[data-theme="light"] .chat-messages::-webkit-scrollbar {
    width: 8px;
  }
  
  :root[data-theme="light"] .chat-messages::-webkit-scrollbar-track {
    background: #f2f2f2;
  }
  
  :root[data-theme="light"] .chat-messages::-webkit-scrollbar-thumb {
    background-color: #bbb;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
  </style>
  