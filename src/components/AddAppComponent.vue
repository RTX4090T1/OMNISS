<template>
  <div class="mainBackColor text-white min-vh-100">
    <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
      <h1 class="text-primary">Post an advertisement</h1>
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
      <form @submit.prevent="publishProduct" class="card p-4 shadow-sm">
        <div class="mb-3">
          <label for="productName" class="form-label">Product Name</label>
          <input type="text" class="form-control" id="productName" v-model="ad.productName" required />
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
          <input type="text" class="form-control" id="pnumber" v-model="ad.phoneNumber" required />
        </div>

        <div class="mb-3">
          <label for="images" class="form-label">Upload Images (1-8 images)</label>
          <input type="file" class="form-control" id="images" @change="uploadImage" multiple accept="image/*" />
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
          <select id="location" class="form-control" v-model="ad.location" @change="updateCities">
            <option v-for="location in getLocation" :key="location.oblast" :value="location.oblast">
              {{ location.oblast }}
            </option>
          </select>
        </div>

        <!-- City Select Menu (Updates Based on Location) -->
        <div class="mb-3" v-if="filteredCities.length">
          <label for="city" class="form-label">City</label>
          <select id="city" class="form-control" v-model="ad.city">
            <option v-for="city in filteredCities" :key="city" :value="city">{{ city }}</option>
          </select>
        </div>

        <div v-if="ad.photoUrls.length > 0" id="carouselExampleIndicators" class="carousel slide"
          data-bs-ride="carousel">
          <div class="carousel-inner">
            <div class="carousel-item" v-for="(image, index) in ad.photoUrls" :key="index"
              :class="{ active: index === 0 }">
              <img :src="image" class="d-block w-100" alt="Uploaded Image">
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


        <button type="submit" class="btn btn-primary mt-3 w-100">Publish</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
  name: "AddAppComponent",
  data() {
    return {
      error: null,
      ad: {
        category: "",
        state: "",
        productName: "",
        price: null,
        condition: "",
        priceCondition: "",
        description: "",
        phoneNumber: null,
        location: "",
        city: "",
        photoUrls: []
      },
      filteredCities: [],
      ids: null
    };
  },
  computed: {
    ...mapGetters(["getCategories", "getLocation"]),
    ...mapGetters('auth', ['getUserName', 'getUserEmail'])
  },
  methods: {
    ...mapActions('todo', ['addItem']),
    updateCities() {
      const selectedOblast = this.getLocation.find(location => location.oblast === this.ad.location);
      this.filteredCities = selectedOblast ? selectedOblast.cities : [];
    },
    generateRandomId() {
      var length = 10;
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    },
    async publishProduct() {
      var ids = this.generateRandomId();
      try {
        await this.addItem(
          {
            productName: this.ad.productName,
            price: this.ad.price,
            description: this.ad.description,
            photoUrls: this.ad.photoUrls,
            phoneNumber: this.ad.phoneNumber,
            publisher: this.getUserName,
            city: this.ad.city,
            region: this.ad.location,
            category: this.ad.category,
            condition: this.ad.condition,
            priceCondition: this.ad.priceCondition,
            id: ids,
            email: this.getUserEmail,
          },
        );
        this.addToMyAdds(ids);
      }
      catch {
        this.error = "An error occurred while processing your request. We are solving your issue.";
      }
    },
    async addToMyAdds(ids) {
      ids = ids.toString();
      const db = getFirestore();
      const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
      await updateDoc(docRef, {
        selfAdds: arrayUnion({
          productName: this.ad.productName,
          price: this.ad.price,
          description: this.ad.description,
          phoneNumber: this.ad.phoneNumber,
          publisher: this.getUserName,
          city: this.ad.city,
          region: this.ad.location,
          category: this.ad.category,
          condition: this.ad.condition,
          priceCondition: this.ad.priceCondition,
          email: this.getUserEmail,
          id: ids,
          photoUrls: this.ad.photoUrls
        }),
      });
      this.$router.push('/account');
    },
    async uploadImage(event) {
      const files = event.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await fetch('https://api.imgbb.com/1/upload?key=ac0d9207d7ff1b4cdc79bae575943ac6', {
            method: 'POST',
            body: formData,
          });
          const data = await response.json();
          this.ad.photoUrls.push(data.data.url);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    },
  }
};
</script>
<style scoped>
.mainheader {
  background-color: #f7f7f7;
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