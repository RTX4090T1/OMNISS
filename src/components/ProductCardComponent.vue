<template>
  <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
    <h1 class="text-primary">Omnis</h1>
    <div class="dropdown ms-auto">
      <button
        class="btn btn-light dropdown-toggle"
        type="button"
        id="setting"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
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

  <!-- Wrapper to contain both product card and dialog -->
  <div class="product-wrapper">
    <!-- Product Card -->
    <div v-if="selectedProduct" class="product-card card mb-4 shadow-sm">
      <div :id="'carousel-' + selectedProduct.id" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div
            class="carousel-item"
            :class="{ active: i === 0 }"
            v-for="(photo, i) in selectedProduct.images"
            :key="i"
          >
            <img :src="photo" class="d-block w-100" alt="Product Image" />
          </div>
        </div>
        <button
          class="carousel-control-prev"
          type="button"
          :data-bs-target="'#carousel-' + selectedProduct.id"
          data-bs-slide="prev"
        >
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button
          class="carousel-control-next"
          type="button"
          :data-bs-target="'#carousel-' + selectedProduct.id"
          data-bs-slide="next"
        >
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <div class="card-body text-center">
        <h3 class="card-title product-name">{{ selectedProduct.name }}</h3>
        <div class="product-details d-flex justify-content-between">
          <p class="price">Price: {{ selectedProduct.price }}</p>
          <p class="condition">Condition: {{ selectedProduct.condition }}</p>
          <p class="price-condition">Price Condition: {{ selectedProduct.priceCondition }}</p>
        </div>
        <p class="card-text location">Location: {{ selectedProduct.region }}</p>
        <p class="card-text publisher">Publisher: {{ selectedProduct.publisher }}</p>
        <p class="card-text publisher-phone">Publisher Phone: {{ selectedProduct.phone }}</p>
        <p class="card-text description">Description: {{ selectedProduct.description }}</p>
        <router-link :to="{ name: 'pay', params: { id: id }}" class="btn btn-primary w-100">Order</router-link>
        <button v-if="chatCheck()" @click="chatOnOff" class="btn btn-secondary w-100 mt-2">Chat</button>
        <button @click="addToFavorites" class="btn btn-outline-secondary w-100 mt-2">Add to Favorites</button>
      </div>
    </div>

    <notifications-component v-if="onOff" :id="id" class="notifications-component"></notifications-component>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NotificationsComponent from './NotificationsComponent.vue';

export default {
  name: 'ProductCardComponent',
  components: {
    NotificationsComponent,
  },
  props: ['id'],
  data() {
    return {
      selectedProduct: null,
      photos: [],
      onOff: false,
    };
  },
  computed: {
    ...mapGetters('auth', ['getUserName', 'getUserEmail']),
  },
  methods: {
    ...mapActions('PRODUCT_STORE', ['getItemFromFDB', 'updateItemInFDB']),

    async loadProduct() {
      var selected = await this.getItemFromFDB({
        collectionName: 'PRODUCT_STORE',
        document: 'qnmnilljBNJsRawRgdeU',
        elementName: 'store',
      });
      this.selectedProduct = selected.find((item) => item.id == this.id);

      // Ensure email exists in selectedProduct
      if (!this.selectedProduct.email) {
        this.selectedProduct.email = ''; // Or assign the correct email if available
      }
    },

    async addToFavorites() {
      var favorite = {
        name: this.selectedProduct.name,
        price: this.selectedProduct.price,
        description: this.selectedProduct.description,
        images: this.selectedProduct.images,
        phone: this.selectedProduct.phone,
        publisher: this.getUserName,
        location: this.selectedProduct.location,
        region: this.selectedProduct.region,
        category: this.selectedProduct.category,
        condition: this.selectedProduct.condition,
        priceCondition: this.selectedProduct.priceCondition,
        id: this.selectedProduct.id,
        email: this.getUserEmail,
      };
      await this.updateItemInFDB({
        collectionName: 'uFAOS',
        document: 'S64AWHz74Ua8E4ix9iMk',
        arrayName: 'favorites',
        newElement: favorite,
      });
    },

    signOut() {
      this.$store.commit('auth/CLEAR_USER_DATA');
      this.$router.push('/');
    },
    chatOnOff() {
      this.onOff = !this.onOff;
    },
    chatCheck() {
      return (
        this.selectedProduct &&
        this.getUserEmail &&
        this.selectedProduct.email !== this.getUserEmail
      );
    },
  },
  created() {
    this.loadProduct();
  },
};
</script>

<style scoped>
.product-wrapper {
  position: relative;
  max-width: 700px;
  margin: 20px auto;
}

.product-card {
  position: relative;
  z-index: 1;
  max-width: 700px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  background-color: #fff;
}

.notifications-component {
  position: absolute;
  top: 0;
  right: -320px; /* Adjust this value based on the width of the dialog */
  width: 300px; /* Set the desired width for the dialog */
  z-index: 2;
  background-color: #fff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
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

/* Responsive adjustments */
@media (max-width: 768px) {
  .notifications-component {
    position: fixed;
    top: auto;
    bottom: 0;
    right: 0;
    left: 0;
    width: 100%;
  }
}
</style>