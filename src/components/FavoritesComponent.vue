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
                <img :src="item.photoUrls[0]" class="card-img" alt="Product Image">
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ item.productName }}</h5>
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
import { mapGetters } from 'vuex';
import { getFirestore, doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";

export default {
  name: "FavoritesComponent",
  data() {
    return {
      arrayData: [],
      likedItems: []
    };
  },
  computed: {
    ...mapGetters(['getLiked']),
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters('auth', ['getUserEmail'])
  },
  methods: {
    async deleteApp(id) {
      console.log(id);

      try {
        var element = this.arrayData.find(el => el.id == id);
        if (element) {
          const db = getFirestore();
          const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
          await updateDoc(docRef, {
            favorites: arrayRemove(element)
          });
          this.showMyItems();
        } else {
          console.error("Element not found for deletion");
        }
      } catch (error) {
        console.error("Error removing app:", error);
      }
    },
    async showMyItems() {
      try {
        const db = getFirestore();
        const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (Array.isArray(data.favorites)) {
            this.arrayData = data.favorites.filter(el => el !== null) || [];
          } else {
            this.arrayData = [];
          }
          console.log(this.getUserEmail);
          console.log(this.arrayData);
          this.likedItems = this.arrayData.filter(order => order.email === this.getUserEmail);
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
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
