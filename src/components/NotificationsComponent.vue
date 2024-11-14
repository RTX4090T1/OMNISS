<template>
    <div class="container">
      <div v-for="(message, index) in history" :key="index" class="message-container">
        <span :class="{'element-right': email === message.email, 'element-left': email !== message.email}" class="message">{{ message.message }}</span>
      </div>
      <form @submit.prevent="checkBefor" class="form-container">
        <input type="text" v-model="message" placeholder="Message" class="message-input">
        <button type="submit" class="send-button">Send</button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { getFirestore, arrayUnion, doc, updateDoc, getDoc } from "firebase/firestore";
  
  export default {
    name: "NotificationsComponent",
    props: ['id'],
    data() {
      return {
        message: null,
        history: [],
        email: ""
      }
    },
    computed: {
      ...mapGetters('auth', ['getUserEmail'])
    },
    methods: {
        
      async checkBefor() {
        this.email = this.getUserEmail
        try {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const arrayData = docSnap.data();
            var data = arrayData;
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
        if (!data[this.id]) {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          const newArray = {
            email: this.email,
            message: "",
            id:this.id
          };
          await updateDoc(docRef, {
            [this.id]: [newArray]
          });
          this.messeging()
        } else {
          this.messeging()
        }
      },
  
      async messeging() {
        try {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const arrayData = docSnap.data()[this.id];
            this.history = arrayData;
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
        try {
          const db = getFirestore();
          const docRef = doc(db, "messenger", "qYmC5hhIWrJP7rh22bc0");
          console.log(this.id, this.message, this.email);
          
          await updateDoc(docRef, {
            [this.id]: arrayUnion({
              email: this.email,
              message: this.message,
              id:this.id
            })
          });
          
        } catch (error) {
          console.error("Error while sending from:", this.email, error);
        }
      }
    },
    created() {
      this.checkBefor()
    }
  };
  </script>
  
  <style scoped>
  .container {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  .message-container {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  .message {
    padding: 10px;
    border-radius: 5px;
    color: white;
    max-width: 70%;
    word-wrap: break-word;
  }
  
  .element-right {
    background-color: blue;
    margin-left: auto;
  }
  
  .element-left {
    background-color: grey;
    margin-right: auto;
  }
  
  .form-container {
    display: flex;
    margin-top: 20px;
  }
  
  .message-input {
    flex: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .send-button {
    background-color: black;
    color: white;
    border: none;
    padding: 10px 20px;
    margin-left: 10px;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .send-button:hover {
    background-color: darkgrey;
  }
  </style>