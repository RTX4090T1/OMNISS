<template>
  <div class="container">
    <div v-for="(conv, index) in anotherEmail" :key="index">
      <button :id="index" @click="loadConversation(conv.id)">Conversation with: {{ conv.email }}</button>
    </div>
    <notifications-component :id="ids"></notifications-component>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import NotificationsComponent from './NotificationsComponent.vue';

export default {
  name: "ComunicationComponent",
  components: {
    NotificationsComponent
  },
  props: ['id'],
  data() {
    return {
      ids: null,
      email: "",
      data: [],
      anotherEmail: []
    }
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail'])
  },
  methods: {
    async checkBefor() {
     
    },
  },
  created() {
    this.checkBefor();
  }
};
</script>

