<template>
  <div class="mainBackColor text-white min-vh-100">
    <header class="mainheader">
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
      <div class="container d-flex justify-content-center align-items-center" style="height: 50px;">
        <span class="ms-auto text-white position-absolute start-0 ms-5">
          <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle bg-transparent" style="border-color: transparent"
              type="button" id="setting" data-bs-toggle="dropdown" aria-expanded="false">
              Options
            </button>
            <ul class="dropdown-menu" aria-labelledby="setting">
              <li v-if="getUserEmail">
                <a class="dropdown-item" href="#">
                  <router-link to="/account">Account</router-link>
                </a>
              </li>
              <li>
                <a class="dropdown-item" href="#">Support</a>
              </li>
              <li v-if="getUserEmail" @click="signOut">
                <a class="dropdown-item" href="#">Sign Out</a>
              </li>
              <li v-if="!getUserEmail">
                <a class="dropdown-item" href="#">
                  <router-link to="/login">Sign In / Log In</router-link>
                </a>
              </li>
            </ul>
          </div>
        </span>
        <h1 class="text-white me-3">Omnis</h1>
        <span class="ms-auto text-white position-absolute end-0 me-5">
          <button class="btn btn-primary bg-transparent" style="border-color: transparent">
            <i class="bi bi-person-circle fs-4"></i>
            <figcaption>{{ getUserName || 'Guest' }}</figcaption>
          </button>
        </span>
      </div>
    </header>
    <div class="nav nav-tabs links d-flex justify-content-center align-items-center fw-bold" id="nav-tab">
      <button class="nav-link bg-transparent" id="omnis" data-bs-toggle="tab" data-bs-target="#nav-omnis" type="button"
        aria-controls="nav-omnis" @click="setCategory('Omnis')">Omnis</button>
      <button class="nav-link bg-transparent" id="estate" data-bs-toggle="tab" data-bs-target="#nav-estate"
        type="button" aria-controls="nav-estate" @click="setCategory('Real Estate')">Real Estate</button>
      <button class="nav-link bg-transparent" id="automobile" data-bs-toggle="tab" data-bs-target="#nav-automobile"
        type="button" aria-controls="nav-automobile" @click="setCategory('Automobile')">Automobile</button>
      <button class="nav-link bg-transparent" id="autoparts" data-bs-toggle="tab" data-bs-target="#nav-autoparts"
        type="button" aria-controls="nav-autoparts" @click="setCategory('Auto Parts')">Auto Parts</button>
      <button class="nav-link bg-transparent" id="home" data-bs-toggle="tab" data-bs-target="#nav-home" type="button"
        aria-controls="nav-home" @click="setCategory('Home & Garden')">Home & Garden</button>
      <button class="nav-link bg-transparent" id="electronics" data-bs-toggle="tab" data-bs-target="#nav-electronics"
        type="button" aria-controls="nav-electronics" @click="setCategory('Electronics')">Electronics</button>
      <button class="nav-link bg-transparent" id="baby" data-bs-toggle="tab" data-bs-target="#nav-baby" type="button"
        aria-controls="nav-baby" @click="setCategory('Baby & Kids')">Baby & Kids</button>
      <button class="nav-link bg-transparent" id="education" data-bs-toggle="tab" data-bs-target="#nav-education"
        type="button" aria-controls="nav-education" @click="setCategory('Education')">Education</button>
      <button class="nav-link bg-transparent" id="sport" data-bs-toggle="tab" data-bs-target="#nav-sport" type="button"
        aria-controls="nav-sport" @click="setCategory('Sport')">Sport</button>
      <button class="nav-link bg-transparent" id="clothing" data-bs-toggle="tab" data-bs-target="#nav-clothing"
        type="button" aria-controls="nav-clothing" @click="setCategory('Clothing')">Clothing</button>
      <button class="nav-link bg-transparent" id="jev" data-bs-toggle="tab" data-bs-target="#nav-jev" type="button"
        aria-controls="nav-jev" @click="setCategory('Jewelry')">Jewelry</button>
      <button class="nav-link bg-transparent" id="col" data-bs-toggle="tab" data-bs-target="#nav-col" type="button"
        aria-controls="nav-col" @click="setCategory('Antiques')">Antiques</button>
      <button class="nav-link bg-transparent" id="hardware" data-bs-toggle="tab" data-bs-target="#nav-hardware"
        type="button" aria-controls="nav-hardware" @click="setCategory('Hardware')">Hardware</button>
      <button class="nav-link bg-transparent" id="services" data-bs-toggle="tab" data-bs-target="#nav-services"
        type="button" aria-controls="nav-services" @click="setCategory('Services')">Services</button>
      <button class="nav-link bg-transparent" id="trading" data-bs-toggle="tab" data-bs-target="#nav-trading"
        type="button" aria-controls="nav-trading" @click="setCategory('Trading')">Trading</button>
    </div>

    <div class="searchInput d-flex justify-content-center align-items-center  position-relative my-3">
      <form label-for="search" label="Find">
        <input type="text" id="search" v-model="searchString" placeholder="Omnis..."
          class="form-control bg-transparent border border-dark" style="border-width: 1px; width: 500px;">
      </form>
    </div>

    <div class="container" style="color:rgb(46, 82, 124);">
      <div class="row">
        <!-- Column: Region Select -->
        <div class="col-md-3 mb-3">
          <label for="location" class="form-label">Region</label>
          <select id="location" class="form-control" v-model="location" @change="updateCities">
            <option v-for="location in getLocation" :key="location.oblast" :value="location.oblast">
              {{ location.oblast }}
            </option>
          </select>
        </div>

        <!-- Column: City Select -->
        <div class="col-md-3 mb-3">
          <label for="city" class="form-label">City</label>
          <select id="city" class="form-control" v-model="city" :disabled="!location">
            <option v-for="city in locations" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <!-- Column: Radio Buttons for Condition -->
        <div class="col-md-3 mb-3">
          <label class="form-label ">Condition</label>
          <div class="d-flex">
            <div class="me-3">
              <input type="radio" id="new" value="New" v-model="selectedCondition" class="form-check-input me-2">
              <label for="new" class="form-check-label">New</label>
            </div>
            <div class="me-3">
              <input type="radio" id="used" value="Used" v-model="selectedCondition" class="form-check-input me-2">
              <label for="used" class="form-check-label">Used</label>
            </div>
            <div>
              <input type="radio" id="all" value="all" v-model="selectedCondition" class="form-check-input me-2">
              <label for="all" class="form-check-label">All</label>
            </div>
          </div>
        </div>

        <!-- Column: Price Range Inputs -->
        <div class="col-md-3 mb-3">
          <label for="priceRange" class="form-label d-flex justify-content-center">Price Range</label>
          <div class="d-flex">
            <input type="number" id="minPrice" v-model="minPrice" class="form-control" placeholder="Min Price">
            <span class="mx-2">-</span>
            <input type="number" id="maxPrice" v-model="maxPrice" class="form-control" placeholder="Max Price">
          </div>
        </div>
      </div>

      <div class="optionsContainer  d-flex flex-column align-items-center">
        <div class="scrollable-menu"
          style="width: 1500px; margin-left: 50px;min-height: 700px;border-color: transparent;">

          <div class="row">
            <div class="col-md-6" v-for="(item, index) in filteredItems" :key="index">
              <div class="card my-2">
                <div class="card-body">
                  <h5 class="card-title" style="color:rgb(46, 82, 124)">{{ item.productName }}</h5>
                  <h5 class="card-title" style="color:rgb(46, 82, 124)">{{ item.price }}</h5>
                  <h5 class="card-title" style="color:rgb(46, 82, 124)">{{ item.description }}</h5>
                  <h5 class="card-title" style="color:rgb(46, 82, 124)">{{ item.region }}</h5>
                  <div v-if="item.photoUrls && item.photoUrls.length">
                    <img v-for="(photo, index) in item.photoUrls" :src="photo" :key="index" class="ad-image">
                  </div>
                  <button :id="index" @click="addToFavoritesid(item.id)">To favorites</button>
                  <router-link :id="index"  :to="{name: 'prodCard', params:{id: item.id}}">Link</router-link>
                  <router-link to="/pay" class="mx-3" :id="index" @click="setOrderr(item.id)">Order</router-link>
                  <router-link :id="index"  :to="{name: 'notifications', params:{id: item.id}}">Chat</router-link>
                </div>
              </div>
            </div>
          </div>

          <div class="tab-content mt-3  d-flex justify-content-center text-dark fw-bold" id="nav-tabContent">
            <div class="tab-pane fade" id="nav-omnis" aria-labelledby="nav-omnis"></div>
            <div class="tab-pane fade" id="nav-jev" aria-labelledby="jev"></div>
            <div class="tab-pane fade" id="nav-estate" aria-labelledby="nav-estate"></div>
            <div class="tab-pane fade" id="nav-automobile" aria-labelledby="nav-automobile"></div>
            <div class="tab-pane fade" id="nav-autoparts" aria-labelledby="nav-autoparts"></div>
            <div class="tab-pane fade" id="nav-home" aria-labelledby="nav-home"></div>
            <div class="tab-pane fade" id="nav-electronics" aria-labelledby="nav-electronics"></div>
            <div class="tab-pane fade" id="nav-baby" aria-labelledby="nav-baby"></div>
            <div class="tab-pane fade" id="nav-education" aria-labelledby="nav-education"></div>
            <div class="tab-pane fade" id="nav-sport" aria-labelledby="nav-sport"></div>
            <div class="tab-pane fade" id="nav-clothing" aria-labelledby="nav-clothing"></div>
            <div class="tab-pane fade" id="nav-col" aria-labelledby="nav-col"></div>
            <div class="tab-pane fade" id="nav-hardware" aria-labelledby="nav-hardware"></div>
            <div class="tab-pane fade" id="nav-services" aria-labelledby="nav-services"></div>
            <div class="tab-pane fade" id="nav-trading" aria-labelledby="nav-trading"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
  name: "MainComponent",
  data() {
    return {
      searchString: "",
      items: [],
      locations: [],
      location: null,
      city: null,
      selectedCondition: "",
      minPrice: null,
      maxPrice: null,
      selectedCategory: null,
      email: null
    };
  },

  computed: {
    ...mapGetters('auth', ['getUserName', 'getUserEmail', 'logout']),
    ...mapGetters('todo', ['getProductList']),
    ...mapGetters(['getLocation', 'getActive']),
    loading() {
      return this.$store.state.todo.loading;
    },

    filteredItems() {
      return this.items.filter(item => {
        const matchesSearch = !this.searchString || item.productName.toLowerCase().includes(this.searchString.toLowerCase());
        const matchesLocation = !this.location || item.region === this.location;
        const matchesCity = !this.city || item.city === this.city;
        const matchesCondition = this.selectedCondition === "all" || !this.selectedCondition || item.condition === this.selectedCondition;
        const matchesPrice = (!this.minPrice || item.price >= this.minPrice) &&
          (!this.maxPrice || item.price <= this.maxPrice);
        const matchesCategory = !this.selectedCategory || item.category === this.selectedCategory;

        return matchesSearch && matchesLocation && matchesCity && matchesCondition && matchesPrice && matchesCategory;
      });
    }
  },


  methods: {
    ...mapActions(['setAction', 'setOrder', 'setMyLiked']),
    ...mapActions('todo', ['loadList']),
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
      this.likedItems = this.getProductList.find(item => item.id == id);
      if (this.likedItems) {
        const db = getFirestore();
        const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
        await updateDoc(docRef, {
          favorites: arrayUnion({
            name: this.likedItems.productName || "",
            price: this.likedItems.price || "",
            condition: this.likedItems.condition || "",
            description: this.likedItems.description || "",
            id: this.likedItems.id,
            photoUrls: this.likedItems.photoUrls,
            publisher: this.likedItems.publisher || "",
            pNumber: this.likedItems.phoneNumber || "",
            email: this.getUserEmail || "",
          }),
        });
      }
    },
    setOrderr(id) {
      this.setOrder(id);
    }
  },

  created() {
    this.getitems();
  }
};
</script>

<style>
.mainheader {
  background-color: rgb(46, 82, 124);
  padding: 20px;
}

.mainBackColor {
  background-color: azure;
}

.locsb::-webkit-scrollbar {
  width: 10px;
}

.locsb::-webkit-scrollbar-thumb {
  background-color: darkgrey;
  border-radius: 10px;
}

.scrollable-menu {
  max-height: 300px;
  overflow-y: auto;
  width: 120px;
  border: 1px solid #ccc;
  padding: 10px;
}

.scrollable-menu {
  overflow: auto;
}

.scrollable-menu::-webkit-scrollbar {
  display: none;
}

.scrollable-menu {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.ad-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-right: 10px;
}
</style>