<template>
  <div class="mainBackColor text-white min-vh-100">
    <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
      <h1 class="text-primary">Redact</h1>
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
      <form @submit.prevent="handleEdit" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label for="productName" class="form-label">Product Name</label>
          <input type="text" class="form-control" id="productName" v-model="ad.name" required />
        </div>

        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input type="number" class="form-control" id="price" v-model="ad.price" required />
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea class="form-control" id="description" rows="3" v-model="ad.description" required></textarea>
        </div>

        <div class="mb-3">
          <label for="pnumber" class="form-label">Use your phone number or email to contact with clients</label>
          <input type="text" class="form-control" id="pnumber" v-model="ad.phone" required />
        </div>

        <!-- Price Condition Radio Buttons -->
        <div class="mb-3">
          <label class="form-label">Price Condition</label>
          <div>
            <label class="me-3">
              <input type="radio" value="Fixed" v-model="ad.priceCondition" /> Fixed
            </label>
            <label>
              <input type="radio" value="Negotiable" v-model="ad.priceCondition" /> Negotiable
            </label>
          </div>
        </div>

        <!-- Condition Radio Buttons -->
        <div class="mb-3">
          <label class="form-label">Condition</label>
          <div>
            <label class="me-3">
              <input type="radio" value="New" v-model="ad.condition" /> New
            </label>
            <label>
              <input type="radio" value="Used" v-model="ad.condition" /> Used
            </label>
          </div>
        </div>

        <!-- Category Select Menu -->
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <select id="category" class="form-control" v-model="ad.category">
            <option v-for="category in getCategories" :key="category" :value="category">{{ category }}</option>
          </select>
        </div>

        <!-- Location (Oblast) Select Menu -->
        <div class="mb-3">
          <label for="location" class="form-label">Region</label>
          <select id="location" class="form-control" v-model="ad.region" @change="updateCities">
            <option v-for="location in getLocation" :key="location.oblast" :value="location.oblast">
              {{ location.oblast }}
            </option>
          </select>
        </div>

        <!-- City Select Menu (Updates Based on Location) -->
        <div class="mb-3" v-if="filteredCities.length">
          <label for="city" class="form-label">City</label>
          <select id="city" class="form-control" v-model="ad.location">
            <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <!-- Photo Upload Input -->
        <div class="mb-3">
          <label for="photoUpload" class="form-label">Upload Photos</label>
          <input type="file" class="form-control" id="photoUpload" @change="handleFileUpload" multiple />
        </div>

        <!-- Carousel for uploaded photos -->
        <div v-if="ad.images.length > 0" id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item" v-for="(photo, index) in ad.images" :key="index"
              :class="{ active: index === 0 }">
              <img :src="photo" class="d-block w-100" alt="Uploaded Image">
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
            data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>

        <button type="submit" class="btn btn-success mt-3 w-100">Confirm Changes</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';


export default {
  name: "RedactAddsComponent",
  props: ['ids'],
  data() {
    return {
      ad: {
        name: "",
        price: "",
        description: "",
        images: [],
        phone: "",
        publisher: "",
        location: "",
        region: "",
        category: "",
        condition: "",
        priceCondition: "",
        id: "",
        email: "",
      },
      filteredCities: [],
      redactedItem: null,
    };
  },
  computed: {
    ...mapGetters(["getCategories", "getLocation", 'getToRedact']),
    ...mapGetters('auth', ['getUserName', 'getUserEmail', 'setRedact'])
  },
  methods: {
    ...mapActions('PRODUCT_STORE', ['updateElementInArray',]),
    updateCities() {
      const selectedOblast = this.getLocation.find(location => location.oblast === this.ad.region);
      this.filteredCities = selectedOblast ? selectedOblast.location : [];
    },
    async handleEdit() {
      console.log(this.ids);
      
      try {
        this.redactedItem = {
          name: this.ad.name,
          price: this.ad.price,
          description: this.ad.description,
          images: this.ad.images,
          phone: this.ad.phone,
          publisher: this.getUserName,
          location: this.ad.location,
          region: this.ad.region,
          category: this.ad.category,
          condition: this.ad.condition,
          priceCondition: this.ad.priceCondition,
          id: this.ids,
          email: this.getUserEmail,
          date: new Date().toLocaleString()
        }
        await this.updateElementInArray({ collectionName: "PRODUCT_STORE", document: "qnmnilljBNJsRawRgdeU", field: "store", newElement: this.redactedItem })
      } catch (error) {
        console.error("An error occurred while processing your request:", error);
      }
    },
    handleFileUpload(event) {
      const files = event.target.files;
      const fileArray = Array.from(files);
      const photoUrls = [];

      fileArray.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          photoUrls.push(e.target.result);
          this.ad.photos = photoUrls;
        };
        reader.readAsDataURL(file);
      });
    }
  },
  created() {

  }
};
</script>

<style scoped>
.mainheader {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.mainBackColor {
  background-color: rgb(255, 255, 255);
}

form {
  background-color: #f7f7f7;
  padding: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

button {
  width: 100%;
}

.carousel-inner img {
  max-height: 300px;
  object-fit: cover;
}

.carousel-control-prev,
.carousel-control-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
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

.card {
  background-color: #fff;
  padding: 20px;
}

.form-control {
  border: 1px solid #ccc;
}
</style>