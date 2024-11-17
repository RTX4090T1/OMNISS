<template>
    <div class="mainBackColor text-white min-vh-100">
        <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
      <h1 class="text-primary">Orders</h1>
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
      <div v-if="myOrders.length > 0">
        <div class="row">
          <div class="col-md-4" v-for="(item, index) in myOrders" :key="index">
            <div class="card text-white mb-3">
              <div class="card-img-top">
                <!-- Display the first image in the item.photos array -->
                <img :src="item.photoUrls[0]" class="card-img" alt="Product Image">
              </div>
              <div class="card-body">
                <h5 class="card-title">{{ item.productName }}</h5>
                <p class="card-text">Price: {{ item.price }}</p>
                <p class="card-text">Description: {{ item.description }}</p>
                <p class="card-text">Condition: {{ item.condition }}</p>
                <p class="card-text">Phone: {{ item.pNumber }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center" style="color: rgb(46, 82, 124);">
        <p>No orders yet.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: "MyOrdersComponent",
    data() {
        return {
            id: "",
            myOrders: [],
        };
    },
    computed: {
        ...mapGetters('todo', ['getProductList']),
        ...mapGetters(['getTotalyOrdered', 'setAction']),
        ...mapGetters('uFAOS', ['getOrdered']),
        ...mapGetters('auth', ['getUserEmail'])
    },

    methods: {
        async showMyItems() {
            try {
                console.log(this.getUserEmail);
                const db = getFirestore();
                const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const arrayData = docSnap.data().orders || [];
                    this.myOrders = arrayData.filter(order => order.email === this.getUserEmail);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        },
    },
    created() {
        this.showMyItems();
    }
}
</script>

<style scoped>
.mainBackColor {
    background-color: rgb(255, 255, 255);
}

.mainheader {
    background-color: rgb(46, 82, 124);
    padding: 20px;
    color: white;
}

.card {
    background-color: #333;
    border: none;
}

.card-body h5 {
    color: #ffd700;
}

.card-body p {
    color: #ddd;
}
</style>