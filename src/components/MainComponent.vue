<template>
  <div class="main-container text-dark min-vh-100">
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
        </ul>
      </div>
      <button class="btn btn-light rounded-circle profile-btn ms-3">
        <i class="bi bi-person-circle fs-4"></i>
        <figcaption>{{ getUserName || 'Guest' }}</figcaption>
      </button>
    </header>

    <div class="nav nav-tabs links d-flex justify-content-center fw-bold" id="nav-tab">
      <button class="nav-link text-primary bg-transparent" v-for="category in categories" :key="category" :id="category"
        @click="setCategory(category)">{{ category }}</button>
    </div>

    <div class="search-section d-flex justify-content-center align-items-center my-3">
      <form label-for="search" label="Find">
        <input type="text" id="search" v-model="searchString" placeholder="Omnis..." class="form-control search-input">
      </form>
    </div>

    <div class="filters-container container py-3">
      <div class="row">
        <div class="col-md-3 mb-3">
          <label for="location" class="form-label">Region</label>
          <select id="location" class="form-control" v-model="location" @change="updateCities">
            <option v-for="location in getLocation" :key="location.oblast" :value="location.oblast">
              {{ location.oblast }}
            </option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label for="city" class="form-label">City</label>
          <select id="city" class="form-control" v-model="city" :disabled="!location">
            <option v-for="city in locations" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label class="form-label">Condition</label>
          <div class="d-flex">
            <input type="radio" id="new" value="New" v-model="selectedCondition" class="form-check-input me-2">
            <label for="new" class="form-check-label">New</label>
            <input type="radio" id="used" value="Used" v-model="selectedCondition" class="form-check-input ms-3 me-2">
            <label for="used" class="form-check-label">Used</label>
            <input type="radio" id="all" value="all" v-model="selectedCondition" class="form-check-input ms-3 me-2">
            <label for="all" class="form-check-label">All</label>
          </div>
        </div>

        <div class="col-md-3 mb-3">
          <label for="priceRange" class="form-label d-flex justify-content-center">Price Range</label>
          <div class="d-flex">
            <input type="number" id="minPrice" v-model="minPrice" class="form-control price-input" placeholder="Min">
            <span class="mx-2">-</span>
            <input type="number" id="maxPrice" v-model="maxPrice" class="form-control price-input" placeholder="Max">
          </div>
        </div>
      </div>
    </div>

    <div class="product-list container py-3">
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(item, index) in filteredItems" :key="index">
          <div class="card product-card shadow-sm border-0">
            <img v-if="item.photoUrls && item.photoUrls.length" :src="item.photoUrls[0]"
              class="card-img-top product-image">
            <div class="card-body">
              <h5 class="card-title">{{ item.productName }}</h5>
              <p class="card-text text-muted">{{ item.description }}</p>
              <h6 class="text-primary">${{ item.price }}</h6>
              <p class="text-muted small">{{ item.region }}</p>
              
              <!-- Only show NotificationsComponent for the selected product -->
              <notifications-component v-if="onOff && id === item.id" :id="id" :userEmail="email"></notifications-component>
              
              <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-outline-primary btn-sm" @click="addToFavoritesid(item.id)">Add to Favorites</button>
                <div class="d-flex gap-2">
                  <button :id="item.id" class="btn btn-primary btn-sm" @click="onOFF(item.id, item.email)">Chat</button>
                  <router-link :to="{ name: 'prodCard', params: { id: item.id } }"
                    class="btn btn-primary btn-sm">View</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";
import NotificationsComponent from './NotificationsComponent.vue';

export default {
  name: "MainComponent",
  components: {
    NotificationsComponent
  },
  data() {
    return {
      id: null,
      email: null,
      onOff: false,
      searchString: "",
      items: [],
      locations: [],
      location: null,
      city: null,
      selectedCondition: "",
      minPrice: null,
      maxPrice: null,
      selectedCategory: null,
      categories: ['Real Estate', 'Automobile', 'Auto Parts', 'Home & Garden', 'Electronics', 'Baby & Kids', 'Education', 'Sport', 'Clothing', 'Jewelry', 'Antiques', 'Hardware', 'Services', 'Trading']
    };
  },

  computed: {
    ...mapGetters('auth', ['getUserName', 'getUserEmail', 'logout']),
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters(['getLocation']),
    filteredItems() {
      return this.items.filter(item => {
        const matchesSearch = !this.searchString || item.productName.toLowerCase().includes(this.searchString.toLowerCase());
        const matchesLocation = !this.location || item.region === this.location;
        const matchesCity = !this.city || item.city === this.city;
        const matchesCondition = this.selectedCondition === "all" || !this.selectedCondition || item.condition === this.selectedCondition;
        const matchesPrice = (!this.minPrice || item.price >= this.minPrice) && (!this.maxPrice || item.price <= this.maxPrice);
        const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
        return matchesSearch && matchesLocation && matchesCity && matchesCondition && matchesPrice && matchesCategory;
      });
    }
  },

  methods: {
    ...mapActions(['setOrder', 'setMyLiked']),
    ...mapActions('todo', ['loadList']),
    onOFF(id, email) {
      this.onOff = !this.onOff;
      this.id = id;
      this.email = email;
    },
    updateCities() {
      const selectedRegion = this.getLocation.find(location => location.oblast === this.location);
      this.locations = selectedRegion ? selectedRegion.cities : [];
      this.city = null;
    },
    signOut() {
      this.$store.dispatch('auth/logout');
    },
    async getitems() {
      await this.loadList();
      this.items = this.getProductList.map(item => ({
        ...item,
        photoUrls: item.photoUrls || []
      }));
    },
    setCategory(category) {
      this.selectedCategory = category;
    },
    async addToFavoritesid(id) {
      this.setMyLiked(id);
      const db = getFirestore();
      const userRef = doc(db, "users", this.email);
      await updateDoc(userRef, {
        favorites: arrayUnion(id)
      });
    }
  },
  
  mounted() {
    this.getitems();
  }
};
</script>


<style>
.main-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
}

.main-container {
  background-color: #f5f5f5;
}

.search-section .search-input {
  width: 100%;
  max-width: 500px;
}

.filters-container {
  background-color: #fff;
  border-radius: 5px;
}

.product-card {
  border-radius: 10px;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
</style>
