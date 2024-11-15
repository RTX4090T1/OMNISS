<template>
  <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
    <h1 class="text-primary">Omnis</h1>
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

  <div v-if="selectedProduct" class="product-card card mb-4 shadow-sm mx-auto">
    <div :id="'carousel-' + selectedProduct.id" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item" :class="{ active: i === 0 }" v-for="(photo, i) in photos" :key="i">
          <img :src="photo" class="d-block w-100" alt="Product Image">
        </div>
      </div>
      <button class="carousel-control-prev" type="button" :data-bs-target="'#carousel-' + selectedProduct.id"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" :data-bs-target="'#carousel-' + selectedProduct.id"
        data-bs-slide="next">
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
      <p class="card-text publisher-phone">Publisher Phone: {{ selectedProduct.phoneNumber }}</p>
      <p class="card-text description">Description: {{ selectedProduct.description }}</p>
      <router-link to="/pay" class="btn btn-primary w-100">Order</router-link>
      <button @click="addToFavorites" class="btn btn-outline-secondary w-100 mt-2">Add to Favorites</button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";

export default {
  name: "ProductCardComponent",
  props: ['id'],
  data() {
    return {
      products: [],
      selectedProduct: null,
      photos: []
    };
  },
  computed: {
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters('auth', ['getUserName', 'getUserEmail']),
    ...mapGetters(['getLocation', 'getActive']),
  },
  methods: {
    async loadProducts() {
      try {
        const db = getFirestore();
        const docRef = doc(db, "todo", "AHZWnRmOg9CQtYZmf2bA");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const arrayData = docSnap.data().allAds || [];
          this.products = arrayData;
          this.getSelected();
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    },
    getSelected() {
      this.selectedProduct = this.products.find(
        prod => prod.id == this.id
      );
      if (this.selectedProduct) {
        this.photos = this.selectedProduct.photoUrls;
      } else {
        console.error("Product not found.");
      }
    },
    async addToFavorites() {
      try {
        const db = getFirestore();
        const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
        const element = this.getProductList.find(prod => prod.id === this.id);
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
      this.$store.commit('auth/CLEAR_USER_DATA');
      this.$router.push('/');
    }
  },
  created() {
    this.loadProducts();
  }
};
</script>

<style scoped>
.product-card {
  max-width: 700px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin: 20px auto;
  background-color: #fff;
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

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  width: 5%;
}

.carousel-control-prev {
  left: 0;
}

.carousel-control-next {
  right: 0;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: rgba(0, 0, 0, 0.5);
}

.btn {
  margin-top: 10px;
}
</style>
