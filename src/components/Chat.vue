<template>
    <div id="chat" ref="chat" v-show="active" v-cloak>
      <div :class="{ 'chat-messages_active': typing }" ref="chatMessages" class="chat-messages">
        <ul class="chat-messages__list">
          <li v-for="(item, index) in cutMessages" :key="index" class="chat-messages__text" v-html="item" />
        </ul>
      </div>
      <div class="chat-send" v-if="typing">
        <div class="chat-send__input">
          <input
            type="text"
            placeholder="Введите сообщение..."
            v-model="userMessage"
            @keydown.enter="type"
            @keydown.up="navigateHistoryUp"
            @keydown.down="navigateHistoryDown"
            @keydown.esc="closeChat"
            ref="input"
            class="chat-send__typing"
          />
          <button @click="type" class="chat-send__send-message">
            <img src="/img/send.svg" class="chat-send__icon" />
          </button>
        </div>
        <ul class="chat-send__buttons">
          <div v-for="(item, index) in commands" :key="index" @click="addCommand(item)" class="chat-send__button">
            {{ item }}
          </div>
          <li @click="addCommand()" class="chat-send__button">X</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Chat',
    data() {
      return {
        active: true,
        hasAccess: true,
        typing: false,
        messages: [],
        commands: ['/report', '/r', '/try', '/s', '/me', '/do'],
        userMessage: '',
        messageHistory: [],
        stepList: -1,
        lastTimeMessage: 0,
      };
    },
    methods: {
      addCommand(command) {
        if (!command) {
          this.userMessage = '';
        } else {
          this.userMessage = command + ' ' + this.userMessage;
        }
      },
      type() {
        this.userMessage = this.userMessage.trim();
        this.stepList = -1;
        this.typing = false;
  
        // RAGE:MP integration
        if (window.mp) {
          mp.invoke('focus', false);
          mp.trigger('chat::changeState', false);
        }
  
        if (this.userMessage === '' || new Date().getTime() - 500 < this.lastTimeMessage) return;
  
        if (this.userMessage.length > 100) {
          this.userMessage = this.userMessage.substr(0, 100);
        }
  
        if (this.userMessage[0] === '/' && window.mp) {
          mp.invoke('command', this.userMessage.substr(1));
        } else if (window.mp) {
          mp.invoke('chatMessage', this.userMessage);
        }
  
        if (this.messageHistory.includes(this.userMessage)) {
          this.messageHistory.splice(this.messageHistory.indexOf(this.userMessage), 1);
        }
        if (this.messageHistory.length > 9) {
          this.messageHistory.pop();
        }
        this.messageHistory.unshift(this.userMessage);
  
        this.userMessage = '';
        this.lastTimeMessage = new Date().getTime();
  
        this.$nextTick(() => {
          this.$refs.chatMessages.scrollTop = 9999;
        });
      },
      navigateHistoryUp() {
        if (!this.typing || !this.messageHistory.length) return;
        this.stepList++;
        if (!this.messageHistory[this.stepList]) {
          this.stepList = this.messageHistory.length - 1;
        }
        this.userMessage = this.messageHistory[this.stepList];
      },
      navigateHistoryDown() {
        if (!this.typing || !this.messageHistory.length) return;
        this.stepList--;
        if (!this.messageHistory[this.stepList]) {
          this.userMessage = '';
          this.stepList = -1;
        } else {
          this.userMessage = this.messageHistory[this.stepList];
        }
      },
      closeChat() {
        if (this.typing) {
          this.$nextTick(() => this.$refs.input.blur());
          this.stepList = -1;
          this.typing = false;
          if (window.mp) {
            mp.invoke('focus', false);
            mp.trigger('chat::changeState', false);
          }
        }
      },
    },
    computed: {
      cutMessages() {
        if (this.messages.length > 50) {
          this.messages.splice(0, 1);
        }
        return this.messages;
      },
    },
    mounted() {
      this.$refs.chatMessages.scrollTop = 9999;
  
      window.onkeyup = (event) => {
        switch (event.which) {
          case 84: // T key
            if (!this.hasAccess) return;
            this.typing = true;
            this.$nextTick(() => this.$refs.input.focus());
            if (window.mp) {
              mp.invoke('focus', true);
              mp.trigger('chat::changeState', true);
            }
            break;
        }
      };
  
      // Expose chatAPI globally for RAGE:MP
      window.chatAPI = {
        push: (message) => {
          this.messages.push(message);
          this.$nextTick(() => (this.$refs.chatMessages.scrollTop = 9999));
        },
        clear: () => {
          this.messages = [];
        },
        activate: (toggle) => {
          this.hasAccess = toggle;
        },
        show: (toggle) => {
          this.active = toggle;
        },
      };
  
      // Register RAGE:MP events if mp exists
      if (window.mp && mp.events) {
        const api = {
          'chat:push': window.chatAPI.push,
          'chat:clear': window.chatAPI.clear,
          'chat:activate': window.chatAPI.activate,
          'chat:show': window.chatAPI.show,
        };
        for (let fn in api) {
          mp.events.add(fn, api[fn]);
          console.log(`test: ${fn}`);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  /* External chat.css handles styling */
  </style>