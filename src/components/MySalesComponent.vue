<template>
    <div class="mainBackColor text-white min-vh-100">
        <header class="mainheader text-center">
            <h3>Orders</h3>
        </header>

        <div class="container mt-4">
            <div v-if="myItems.length > 0">
                <div class="row">
                    <div class="col-md-4" v-for="(item, index) in myItems" :key="index">
                        <div class="card bg-dark text-white mb-3">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.productName }}</h5>
                                <p class="card-text">Price: {{ item.price }}</p>
                                <p class="card-text">Description: {{ item.description }}</p>
                                <p class="card-text">Region: {{ item.region }}</p>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center" style="color:rgb(46, 82, 124);">
                <p>No sales yet.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getFirestore, doc, getDoc } from "firebase/firestore";

export default {
    name: "MySalesComponent",
    data() {
        return {
            id: "",
            myItems: [],
        };
    },
    computed: {
        ...mapGetters('todo', ['getProductList']),
        ...mapGetters(['getMyOrdered']),
        ...mapGetters('auth', ['getUserEmail']),

    },
    methods: {

        async showMyItems() {
            try {
                console.log(this.getUserEmail);
                const db = getFirestore();
                const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const arrayData = docSnap.data().sales || [];
                    this.myItems = arrayData.filter(order => order.email === this.getUserEmail);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        },
    },
    mounted() {
        this.showMyItems();
    },
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