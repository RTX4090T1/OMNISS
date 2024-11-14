<template>
    <div class="container">
      <div v-for="(conv, index) in anotherEmail" :key="index">
        <button :id="index" @click="loadConversation(conv.id)">Conversation with: {{ conv[index].email }}</button>
      </div>
      <notifications-component :id="ids"></notifications-component>
    </div>
  </template>
  
  <script>
  import { mapGetters } from 'vuex';
  import { getFirestore, doc, getDoc } from "firebase/firestore";
  import NotificationsComponent from './NotificationsComponent.vue';
  export default {
    name: "ComunicationComponent",
    components:{
        NotificationsComponent
    },
    props: ['id'],
    data() {
      return {
        ids:null,
        message: null,
        history: [],
        email: "",
        data:[],
        anotherEmail:[]
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
            this.data = arrayData
            this.anotherEmail = Object.keys(arrayData).filter(key => key == this.email).map(key => ({ id: key, email: arrayData[key][0].email }));
          } else {
            console.error("No such document!");
          }
        } catch (error) {
          console.error("Error fetching document:", error);
        }
      },
      loadConversation(id){
        this.ids = id
      }
    },
    created() {
      this.checkBefor()
    }
  };
  </script>
  
  <style scoped>
 
  </style>