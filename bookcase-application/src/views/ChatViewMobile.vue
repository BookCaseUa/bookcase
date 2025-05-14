<template>
    <v-container
      class="chat-mobile-container"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    >
      <!-- Header -->
      <div class="chat-mobile-header d-flex align-center">
        <v-avatar size="40" class="mr-2">
          <v-img :src="otroUsuario.data?.profile_photo || defaultPhoto" />
        </v-avatar>
        <div>
          <strong class="text-subtitle-2">
            {{ otroUsuario.data?.nickname || $t("chats.usuario") }}
          </strong>
          <div v-if="isTyping" class="text-caption text-grey">
            {{ $t("chats.escribiendo") }}
          </div>
        </div>
      </div>
  
      <!-- Chat messages -->
      <div class="chat-mobile-messages" ref="chatBox">
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
                        :class="isLastRead(messages.indexOf(msg)) ? 'check-leido' : 'check-no-leido'"
                    >
                        mdi-check-all
                    </v-icon>
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
  
      <!-- Input fijo -->
      <div class="chat-mobile-input-fixed">
        <v-icon class="emoji-icon" @click.stop="toggleEmojiPicker">mdi-emoticon-outline</v-icon>
        <input
            v-model="newMessage"
            :placeholder="$t('chats.escribirMensaje')"
            class="message-input"
            @keydown="handleTyping"
            @keydown.enter.prevent="enviarMensaje"
        />
        <v-icon class="send-icon" @click="enviarMensaje">mdi-send</v-icon>
      </div>

      <!-- Emoji Picker -->
      <transition name="fade">
        <div v-if="showEmojiPicker" class="emoji-picker emoji-picker-mobile">
          <emoji-picker @emoji-click="addEmoji"></emoji-picker>
        </div>
      </transition>
    </v-container>
  </template>
  
  <script setup>
  import { useChatLogic } from '@/config/chat_logic.js';
  const {
    currentUserId,
    otroUsuario,
    defaultPhoto,
    isTyping,
    groupedMessages,
    messages,
    newMessage,
    showEmojiPicker,
    chatBox,
    backgroundImage,
    toggleEmojiPicker,
    addEmoji,
    handleTyping,
    enviarMensaje,
    isLastRead,
    formatHora,
  } = useChatLogic();
  </script>
  
  <style scoped>
  .chat-mobile-container {
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 56px;
    bottom: 60px;
    left: 0;
    right: 0;
    background-size: cover;
    background-position: center;
    overflow: hidden;
    z-index: 0;
  }
  
  .chat-mobile-header {
    padding: 12px;
    background-color: var(--color-background-soft);
    border-bottom: 1px solid var(--color-border);
    position: fixed;
    top: 56px;
    left: 0;
    right: 0;
    z-index: 2;
  }
  
  .chat-mobile-messages {
    flex: 1;
    overflow-y: auto;
    padding: 80px 12px 72px;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .chat-mobile-input {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    border-top: 1px solid var(--color-border);
    background-color: var(--color-background-soft);
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
  }
  
  .message-input {
    flex: 1;
    border: none;
    border-radius: 20px;
    padding: 8px 12px;
    font-size: 14px;
    background-color: var(--color-background);
    color: var(--color-text);
  }
  
  .message-row {
    display: flex;
    margin-bottom: 6px;
  }
  .sent {
    justify-content: flex-end;
  }
  .received {
    justify-content: flex-start;
  }
  
  .message {
    max-width: 75%;
    padding: 8px 12px;
    border-radius: 16px;
    word-break: break-word;
    font-size: 14px;
  }
  
  .sent .message {
    background-color: #5d6d7e;
    color: white;
    border-bottom-right-radius: 4px;
  }
  .received .message {
    background-color: var(--color-background-soft);
    border: 1px solid var(--color-border);
    color: var(--color-text);
    border-bottom-left-radius: 4px;
  }
  
  .message-meta {
    font-size: 10px;
    margin-left: 8px;
  }
  .check-leido {
    color: white;
  }
  .check-no-leido {
    color: grey;
  }
  
  .emoji-picker-mobile {
  position: absolute;
  bottom: 72px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

  width: calc(100vw - 24px);
  max-width: 340px;
  box-sizing: border-box;
}
  
  .date-divider {
    text-align: center;
    font-size: 12px;
    margin: 12px 0;
    color: var(--color-text);
  }
  .chat-mobile-input-fixed {
  position: fixed;
  bottom: 50px; /* justo encima del footer */
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background-color: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  z-index: 10;
}

.chat-mobile-messages {
  /* ya lo tienes, solo ajusta padding-bottom */
  padding-bottom: 80px; /* espacio suficiente para que los últimos mensajes no queden ocultos */
}

/* 🎨 Variables de emoji-picker en modo claro */
:root[data-theme="light"] emoji-picker {
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

:root[data-theme="light"] emoji-picker::part(search) {
  color: #1e1e1e !important;
  caret-color: #1e1e1e !important;
  background-color: white !important;
}

:root[data-theme="light"] emoji-picker input {
  color: #1e1e1e !important;
  background-color: white !important;
  caret-color: #1e1e1e !important;
}

:root[data-theme="dark"] emoji-picker {
  --background: #1e1e1e;
  --color: #f0f0f0;
  --border-color: #444;
  --category-button-color: #f0f0f0;
  --category-button-active-color: #ffffff;
  --indicator-color: #f0f0f0;
  --search-input-background: #2c2c2c;
  --search-input-color: #ffffff;
}

  </style>
  