<template>
  <div class="main-container text-dark min-vh-100">
    <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
      <h1 class="text-primary">Favorite</h1>
      <div class="dropdown ms-auto">
        <button class="btn btn-light dropdown-toggle" type="button" id="setting" data-bs-toggle="dropdown"
          aria-expanded="false">
          Options
        </button>
        <ul class="dropdown-menu" aria-labelledby="setting">
          <li v-if="getUserEmail">
            <router-link to="/account" class="dropdown-item">Account</router-link>
          </li>
          <li><a class="dropdown-item" href="#">Support</a></li>
          <li v-if="getUserEmail" @click="signOut"><a class="dropdown-item" href="#">Sign Out</a></li>
          <li v-if="!getUserEmail">
            <router-link to="/login" class="dropdown-item">Sign In / Log In</router-link>
          </li>
          <li>
            <router-link to="/" class="dropdown-item">Home</router-link>
          </li>
        </ul>
      </div>
    </header>

    <div class="container mt-5">
      <div v-if="likedItems.length > 0">
        <div class="row">
          <div class="col-md-4" v-for="(item, index) in likedItems" :key="index">
            <div class="card text-white mb-3">
              <div class="card-img-top">
                <img :src="item.images[0]" class="card-img" alt="Product Image">
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ item.name }}</h5>
                <p class="card-text">Price: {{ item.price }}</p>
                <p class="card-text">Description: {{ item.description }}</p>
                <p class="card-text">Region: {{ item.region }}</p>
                <button class="btn btn-outline-primary mt-3" @click="deleteApp(item.id)">
                  Remove from Favorites
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center" style="color: rgb(46, 82, 124);">
        <p>No favorites yet. Start adding items to your favorites!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "FavoritesComponent",
  data() {
    return {
      arrayData: [],
      likedItems: []
    };
  },
  computed: {
    ...mapGetters('auth', ['getUserEmail'])
  },
  methods: {
    ...mapActions('PRODUCT_STORE', ['deleteItemFromFDB', 'getItemFromFDB', 'updateItemInFDB']),

    async deleteApp(id) {
      const itemToDelete = this.likedItems.find(item => item.id = id)
      this.deleteItemFromFDB({collectionName:"uFAOS", document:"S64AWHz74Ua8E4ix9iMk", field:"favorites",elementName:itemToDelete})
    },
    async showMyItems() {
      this.likedItems = await this.getItemFromFDB({collectionName: "uFAOS",
       document: "S64AWHz74Ua8E4ix9iMk",
        elementName: "favorites"})
      this.likedItems = this.likedItems.filter(item => item.email == this.getUserEmail)
    }
  },
  created() {
    this.showMyItems();
    console.log(this.getUserEmail);
  }
};
</script>

<style scoped>
.main-container {
  background-color: #f8f9fa;
}

.main-header {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.card {
  background-color: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

  border: none;
}

.card-body h5 {
  color: #000000;
}

.card-body p {
  color: #000000;
}

.profile-btn {
  width: 40px;
  height: 40px;
}

.card-img {
  height: 200px;
  object-fit: cover;
}

.card-body button {
  background-color: #004085;
  color: #fff;
}

.card-body button:hover {
  background-color: #0056b3;
}
</style>
