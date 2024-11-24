<template>
  <div>
    <div v-for="(conversations, index) in Object.keys(myConversations)" :key="index">

      <button :id="index" @submit.prevent="selectConversation(conversations)">{{ conversations }}</button>
    </div>
  </div>
  <div class="container">
    <div v-for="(msg, index) in selestedConversation" :key="index" class="message-container" style="height:700px">
      <div v-for="(m, index) in msg" :key="index" class="message-block my-3">
        <span :class="{ 'element-left': email === m.email, 'element-right': email !== m.email }" class="message">
          {{ m.message }}
        </span>
      </div>
    </div>
    <form @submit.prevent="messaging" class="form-container">
      <input type="text" v-model="message" placeholder="Type your message..." class="message-input" />
      <button type="submit" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
export default {
  name: "ComunicationComponent",
  data() {
    return {
      myConversations: [],
      selestedConversation: [],
      message:"",
      activeConversation:""
    }
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail'])
  },
  methods: {
    ...mapActions("PRODUCT_STORE", ['getDocumentFromFDB','updateItemInFDB']),

    async loadConversation() {
      if (!this.getUserEmail) {
        setTimeout(() => this.loadConversation(), 100);
        return;
      }

      try {
        console.log("User email:", this.getUserEmail);

        const conversations = await this.getDocumentFromFDB({
          collectionName: "messenger",
          document: "qYmC5hhIWrJP7rh22bc0"
        });

        this.myConversations = Object.fromEntries(
          Object.entries(conversations).filter(([key]) => {
            const cleanKey = key.toLowerCase().replace(/[@.]/g, '');
            const cleanEmail = this.getUserEmail.toLowerCase().replace(/[@.]/g, '');
            return cleanKey.includes(cleanEmail);
          })
        );
        console.log('Filtered conversations:', this.myConversations);
      } catch (error) {
        console.error('Error loading conversations:', error);
      }
    },
    async selectConversation(keyyy) {
      this.activeConversation = keyyy
      const sconversations = await this.getDocumentFromFDB({
        collectionName: "messenger",
        document: "qYmC5hhIWrJP7rh22bc0"
      });
      this.selestedConversation = Object.fromEntries(
        Object.entries(sconversations).filter(([key]) => {
          const cleanKey = key.toLowerCase().replace(/[@.]/g, '');
          const cleanEmail = keyyy.toLowerCase().replace(/[@.]/g, '');
          return cleanKey.includes(cleanEmail);
        })
      );
    },
    async messaging() {
      let message = {
        date: new Date().toLocaleString(),
        email: this.email,
        id: this.uid,
        message: this.message
      };
      await this.updateItemInFDB({ collectionName: 'messenger', document: 'qYmC5hhIWrJP7rh22bc0', arrayName: this.activeConversation, newElement: message });
      this.message = '';
    },
  },
  watch: {
    getUserEmail: {
      immediate: true,
      handler(newEmail) {
        if (newEmail) {
          this.loadConversation();
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;
}

.message-container {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  height: 500px; /* Set a fixed height for the container */
  overflow-y: auto; /* Enable vertical scrolling */
}

.message-block {
  margin-bottom: 5px;
}

.message {
  padding: 10px;
  border-radius: 5px;
  color: white;
  max-width: 70%;
  word-wrap: break-word;
  font-size: 14px;
  line-height: 1.4;
}

.element-right {
  background-color: #0061F2;
  margin-left: auto;
  border-radius: 20px 0 20px 20px;
}

.element-left {
  background-color: #B0B0B0;
  margin-right: auto;
  border-radius: 0 20px 20px 20px;
}

.form-container {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
}

.message-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

.send-button {
  background-color: #0061F2;
  color: white;
  border: none;
  padding: 10px 20px;
  margin-left: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.send-button:hover {
  background-color: #0051c2;
}
</style>