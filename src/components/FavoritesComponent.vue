<template>
  <div class="container mt-4">
    <div v-if="likedItems.length > 0">
      <div class="row">
        <div class="col-md-4" v-for="(item, index) in likedItems" :key="index">
          <div class="card bg-dark text-white mb-3">
            <div id="carousel-{{ index }}" class="carousel slide" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div class="carousel-item" :class="{ active: i === 0 }" v-for="(photo, i) in item.photos" :key="i">
                  <img :src="photo" class="d-block w-100" alt="...">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" :data-bs-target="'#carousel-' + index" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" :data-bs-target="'#carousel-' + index" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
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
    <div v-else class="text-center" style="color:rgb(46, 82, 124);">
      <p>No favorites yet. Start adding items to your favorites!</p>
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
      arrayData:[],
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
    },
  },
  created() {
    this.showMyItems();
    console.log(this.getUserEmail);
  }
};
</script>

<style scoped>
.mainBackColor {
  background-color: azure;
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
