<template>
    <div class="container">
      <div v-for="(message, index) in filteredHistory" :key="index" class="message-container">
        <span :class="{'element-right': email === message.email, 'element-left': email !== message.email}" class="message">
          {{ message.message }}
        </span>
      </div>
      <form @submit.prevent="checkBefor" class="form-container">
        <input type="text" v-model="message" placeholder="Type your message..." class="message-input" />
        <button type="submit" class="send-button">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { getFirestore, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
  
  export default {
    name: "NotificationsComponent",
    props: ['id', 'userEmail'],
    data() {
      return {
        message: null,
        history: [],
        email: ""
      };
    },
    computed: {
      ...mapGetters('auth', ['getUserEmail']),
      filteredHistory() {
        return this.history.filter(msg => msg.email === this.userEmail || msg.email === this.email);
      }
    },
    methods: {
      async checkBefor() {
        this.email = this.getUserEmail;
        let data = {};
        try {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = docSnap.data();
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
        if (!data[this.id]) {
          const newArray = {
            email: this.email,
            message: "",
            id: this.id
          };
          try {
            const db = getFirestore();
            const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
            await updateDoc(docRef, {
              [this.id]: [newArray]
            });
          } catch (error) {
            console.error("Error updating document:", error);
          }
        }
        await this.messeging();
      },
      async messeging() {
        try {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            this.history = docSnap.data()[this.id];
          } else {
            console.error("No such document!");
          }
          await updateDoc(docRef, {
            [this.id]: arrayUnion({
              email: this.email,
              message: this.message,
              id: this.id
            })
          });
        } catch (error) {
          console.error("Error while sending from:", this.email, error);
        }
      }
    },
    created() {
      this.checkBefor();
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
  