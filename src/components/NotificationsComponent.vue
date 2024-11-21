<template>
  <div class="container">
    <div v-for="(msg, index) in conversation" :key="index" class="message-container">
      <span :class="{ 'element-right': email === msg.email, 'element-left': email !== msg.email }"
        class="message">
        {{ msg.message }}
      </span>
    </div>
    <form @submit.prevent="messeging" class="form-container">
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
      uid:null,
      email:""
    };
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail']),

  },
  methods: {
    ...mapActions('PRODUCT_STORE', ['getItemFromFDB','updateItemInFDB','updateDocumentInFDB']),

    async createID() {
      let items = await this.getItemFromFDB({collectionName:"PRODUCT_STORE", document:"qnmnilljBNJsRawRgdeU", elementName:"store"})
      this.item = items.filter(el => el.id == this.id)
      this.uid = String(this.item.email) + String(this.id) + String(this.getUserEmail)
    },
    async checkBefor(){
      this.email = this.getUserEmail
      console.log(this.email);
      
      this.createID()
      let items = await this.getItemFromFDB({collectionName:"PRODUCT_STORE", document:"qnmnilljBNJsRawRgdeU", elementName:"store"})
      if(!(items.includes(this.uid))){
        this.conversation = {
          date: new Date().toLocaleString(),
          email: this.getUserEmail,
          id: this.uid,
          message: null
        }
        await this.updateDocumentInFDB({document:'qYmC5hhIWrJP7rh22bc0', newElement:this.uid, collectionName:'messenger' , data:this.conversation})
      }
      if(items.includes(this.uid)){
        this.conversation = await this.getItemFromFDB( {collectionName:'messenger', document:'qYmC5hhIWrJP7rh22bc0', arrayName:this.uid})
      }
    },
    async messeging(){
      let message = {
        date: new Date().toLocaleString(),
        email: this.getUserEmail,
        id: this.uid,
        message: this.message
      }
      await this.updateItemInFDB({collectionName:'messenger', document:'qYmC5hhIWrJP7rh22bc0', arrayName:this.uid, newElement:message})
    }
  },
  created(){
    this.checkBefor()
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
  justify-content: space-between;
  padding: 5px 0;
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