<script>
import { mapGetters } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
  name: "ProductCardComponent",
  data() {
    return {
      selectedProduct: null
    };
  },
  computed: {
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters('auth', ['getUserName', 'getUserEmail']),
    ...mapGetters(['getLocation', 'getActive']),
  },
  methods: {
    getSelected() {
      this.selectedProduct = this.getProductList.find(
        prod => prod.id === this.getActive
      );
    },
    async addToFavorites(id) {
      try {
        const db = getFirestore();
        const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
        const element = this.getProductList.find(prod => prod.id === id);
        if (element) {
          await updateDoc(docRef, {
            favorites: arrayUnion({
              ...element,
              email: this.getUserEmail
            })
          });
        } else {
          console.log("Product not found in product list.");
        }
      } catch (error) {
        console.error("Error adding to favorites:", error);
      }
    },
    signOut() {
      // Sign out logic (e.g., clear auth data)
      this.$store.commit('auth/CLEAR_USER_DATA');
      this.$router.push('/');
    }
  },
  created() {
    this.getSelected();
  }
};
</script>
<template>
  <header class="mainheader">
    <div class="container d-flex justify-content-center align-items-center" style="height: 50px;">
      <h1 class="text-white me-3">Omnis</h1>
      <span class="ms-auto text-white position-absolute start-0 ms-5">
        <div class="dropdown">
          <button class="btn btn-secondary dropdown-toggle bg-transparent" style="border-color: transparent"
            type="button" id="setting" data-bs-toggle="dropdown" aria-expanded="false">
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
            <li><router-link to="/" class="dropdown-item">Home</router-link></li>
          </ul>
        </div>
      </span>
    </div>
  </header>
  
  <div v-if="selectedProduct" class="product-card card mb-4 shadow-sm mx-auto">
    <div id="carousel-{{ selectedProduct.id }}" class="carousel slide carousel-placeholder" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item" :class="{ active: i === 0 }" v-for="(photo, i) in selectedProduct.photos" :key="i">
          <img :src="photo" class="d-block w-100" alt="Product Image">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" :data-bs-target="'#carousel-' + selectedProduct.id" data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" :data-bs-target="'#carousel-' + selectedProduct.id" data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="card-body text-center">
      <h3 class="card-title product-name">{{ selectedProduct.productName }}</h3>
      <div class="product-details d-flex justify-content-between">
        <p class="price">Price: {{ selectedProduct.price }}</p>
        <p class="condition">Condition: {{ selectedProduct.condition }}</p>
        <p class="price-condition">Price Condition: {{ selectedProduct.priceCondition }}</p>
      </div>
      <p class="card-text location">Location: {{ selectedProduct.region }}</p>
      <p class="card-text publisher">Publisher: {{ selectedProduct.publisher }}</p>
      <p class="card-text publisher-phone">Publisher Phone: {{ selectedProduct.publisherPhone }}</p>
      <p class="card-text description">Description: {{ selectedProduct.description }}</p>
      <router-link to="/pay">Order</router-link>
      <button @click="addToFavorites(selectedProduct.id)">To favorites</button>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  max-width: 700px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  transition: transform 0.3s ease-in-out;
}

.card-body {
  padding: 20px;
}

.product-name {
  color: #2e527c;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 20px;
}

.product-details {
  font-size: 1.2rem;
  color: #6c757d;
  font-weight: 500;
  padding: 10px 0;
}

.price,
.condition,
.price-condition,
.location,
.publisher,
.publisher-phone,
.description {
  color: #6c757d;
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.price {
  font-weight: bold;
  color: #333;
}

.carousel-placeholder {
  height: 200px;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
}
</style>
