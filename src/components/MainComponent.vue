<template>
  <div class="main-container text-dark min-vh-100">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
    <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
      <h1 class="text-primary">Omnis</h1>
      <span class="text-primary px-4">Where Deals Meet Success.</span>
      <div class="search-section d-flex justify-content-center align-items-center my-3 px-5">
        <form label-for="search" label="Find">
          <input type="text" id="search" v-model="searchString" placeholder="Omnis..."
            class="form-control search-input">
        </form>
      </div>
      
      <router-link to="/comunicate" class="text-decoration-none text-dark fw-bold" ><i class="fa-solid fa-bell text-primary" style="color:blue;"></i></router-link>
      
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


    <div class="filters-container container py-3">
      <div class="row">
        <div class="col-md-3 mb-3">
          <label for="location" class="form-label">Region</label>
          <select id="location" class="form-control" v-model="selectedRegion" @change="updateCities">
            <option v-for="selectedRegion in getLocation" :key="selectedRegion.oblast" :value="selectedRegion.oblast">
              {{ selectedRegion.oblast }}
            </option>
          </select>
        </div>

        <div class="col-md-3 mb-3">
          <label for="city" class="form-label">City</label>
          <select id="city" class="form-control" v-model="city" :disabled="!selectedRegion">
            <option v-for="city in regions" :key="city" :value="city">{{ city }}</option>
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
    <div v-if="!getUserEmail" class="safety-message bg-light text-center p-4 my-5 mx-auto rounded shadow">
      <p class="text-primary fs-5 mb-3">
        Your safety is our priority, and we continuously monitor for fraudulent activity. To continue using the service,
        please
        <router-link to="/login" class="text-decoration-none text-dark fw-bold">register or log in</router-link>.
        If you encounter any issues, feel free to contact us via chat!
      </p>
    </div>
    <div v-if="getUserEmail" class="product-list container py-3">
      <div class="row">
        <div class="col-md-4 mb-4" v-for="(item, index) in filteredItems" :key="index">
          <div class="card product-card shadow-sm border-0">
            <img v-if="item.images && item.images.length" :src="item.images[0]" class="card-img-top product-image">
            <div class="card-body">
              <h5 class="card-title">{{ item.name }}</h5>
              <p class="card-text text-muted">{{ item.description }}</p>
              <h6 class="text-primary">${{ item.price }}</h6>
              <p class="text-muted small">{{ item.region }}</p>
              <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-outline-primary btn-sm" @click="addToFavoritesid(item.id)">Add to
                  Favorites</button>
                <div class="d-flex gap-2">
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


export default {
  name: "MainComponent",

  data() {
    return {
      caseMessage: "Your safety is our priority, and we continuously monitor for fraudulent activity. To continue using the service, please register or log in. If you encounter any issues, feel free to contact us via chat!",
      id: null,
      email: null,
      onOff: false,
      searchString: "",
      items: [],
      regions: [],
      city: null,
      selectedCondition: "",
      minPrice: null,
      maxPrice: null,
      selectedCategory: null,
      selectedRegion: null,
      categories: ['Real Estate', 'Automobile', 'Auto Parts', 'Home & Garden', 'Electronics', 'Baby & Kids', 'Education', 'Sport', 'Clothing', 'Jewelry', 'Antiques', 'Hardware', 'Services', 'Trading']
    };
  },

  computed: {
    ...mapGetters('auth', ['getUserName', 'getUserEmail', 'logout']),
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters(['getLocation']),
    filteredItems() {
      console.log('this.items:', this.items);
      if (this.getUserEmail) {
        return this.items.filter(item => {
          const matchesSearch = !this.searchString || item.name.toLowerCase().includes(this.searchString.toLowerCase());
          const matchesLocation = !this.selectedRegion || item.region === this.selectedRegion;
          const matchesCity = !this.city || item.location === this.city;
          const matchesCondition = this.selectedCondition === "all" || !this.selectedCondition || item.condition === this.selectedCondition;
          const matchesPrice = (!this.minPrice || item.price >= this.minPrice) && (!this.maxPrice || item.price <= this.maxPrice);
          const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;
          return matchesSearch && matchesLocation && matchesCity && matchesCondition && matchesPrice && matchesCategory;
        });
      } else {
        return this.caseMessage
      }
    }
  },

  methods: {
    ...mapActions('PRODUCT_STORE', ['getDocumentFromFDB', 'updateDocumentInFDB', 'getItemFromFDB', 'updateItemInFDB']),
    onOFF(id, email) {
      this.onOff = !this.onOff
      this.id = id
      this.email = email
    },
    updateCities() {
      this.regions = this.selectedRegion ? this.selectedRegion.cities : [];
      this.city = null;
    },
    signOut() {
      this.$store.dispatch('auth/logout');
    },
    async getitems() {
      try {
        const result = await this.getItemFromFDB({
          collectionName: 'PRODUCT_STORE',
          document: 'qnmnilljBNJsRawRgdeU',
          elementName: 'store'
        });
        console.log(result);
        this.items = result
        console.log(this.items);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    },
    setCategory(category) {
      this.selectedCategory = category;
    },

    async addToFavoritesid(id) {
      const liked = this.items.find(item => item.id = id)

      var favorite = {
        name: liked.name,
        price: liked.price,
        description: liked.description,
        images: liked.images,
        phone: liked.phone,
        publisher: this.getUserName,
        location: liked.location,
        region: liked.region,
        category: liked.category,
        condition: liked.condition,
        priceCondition: liked.priceCondition,
        id: liked.id,
        email: this.getUserEmail,
      }
      this.updateItemInFDB({
        collectionName: "uFAOS",
        document: "S64AWHz74Ua8E4ix9iMk",
        arrayName: "favorites",
        newElement: favorite
      })
    },
  },

  created() {
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
