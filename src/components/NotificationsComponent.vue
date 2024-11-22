<template>
  <div class="container">
    <div v-for="(msg, index) in conversation" :key="index" class="message-container" style="height:700px">
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: "NotificationsComponent",
  props: ['id'],
  data() {
    return {
      message: null,
      conversation: [],
      item: null,
      uid: "",
      email: ""
    };
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail']),
  },
  methods: {
    ...mapActions('PRODUCT_STORE', ['getItemFromFDB', 'updateItemInFDB', 'updateDocumentInFDB', 'getDocumentFromFDB']),
    async createID() {
      let items = await this.getItemFromFDB({ collectionName: "PRODUCT_STORE", document: "qnmnilljBNJsRawRgdeU", elementName: "store" });
      this.item = items.find(el => el.id == this.id);
      this.email = this.getUserEmail;
      this.uid = String(this.item.email + this.id + this.email).replace(/\./g, "");
    },
    async checkBefore() {
      await this.createID();
      let itemsList = await this.getDocumentFromFDB({ collectionName: 'messenger', document: 'qYmC5hhIWrJP7rh22bc0' });
      itemsList = Object.values(itemsList);

      if (!Object.keys(itemsList).includes(this.uid)) {
        this.update();
      } else {
        this.conversation.push({
          date: new Date().toLocaleString(),
          email: this.email,
          id: this.uid,
          message: null,
        });
        await this.updateDocumentInFDB({ document: 'qYmC5hhIWrJP7rh22bc0', newElement: this.uid, collectionName: 'messenger', data: this.conversation });
      }
    },
    async messaging() {
      let message = {
        date: new Date().toLocaleString(),
        email: this.email,
        id: this.uid,
        message: this.message
      };
      await this.updateItemInFDB({ collectionName: 'messenger', document: 'qYmC5hhIWrJP7rh22bc0', arrayName: this.uid, newElement: message });
      this.update();
      this.message = '';
    },
    async update() {
      this.conversation = [];
      this.conversation.push(await this.getItemFromFDB({ collectionName: 'messenger', document: 'qYmC5hhIWrJP7rh22bc0', elementName: this.uid }));
    }
  },
  created() {
    this.checkBefore();
  }
};
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