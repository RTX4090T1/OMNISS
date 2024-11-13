<template>
    <div class="mainBackColor text-white min-vh-100">
        <header class="mainheader text-center">
            <h3>My Adds</h3>
        </header>

        <div class="container mt-4">
            <div v-if="myOrders.length > 0">
                <div class="row">
                    <div class="col-md-4" v-for="(item, index) in myOrders" :key="index">
                        <div class="card bg-dark text-white mb-3">
                            <div class="card-body">
                                <h5 class="card-title">{{ item.productName }}</h5>
                                <p class="card-text">Price: {{ item.price }}</p>
                                <p class="card-text">Category: {{ item.category }}</p>
                                <p class="card-text">Description: {{ item.description }}</p>
                                <p class="card-text">Publisher: {{ item.publisher }}</p>
                                <p class="card-text">Condition: {{ item.condition }}</p>
                                <p class="card-text">Orderer: {{ item.email }}</p>
                                <p class="card-text">Location: {{ item.location }}</p>
                                <p class="card-text">City: {{ item.city }}</p>
                            </div>
                            <router-link :id="index" @click="setId(item.id)" to="/redact">Redact</router-link>
                            <button :id="index" @click="deletee()">Delete App</button>
                            <button v-if="tf" :id="index" @click="deleteApp(index)">Delete App</button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center" style="color:rgb(46, 82, 124);">
                <p>Your store is emty, butb you always can extend it.</p>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import { getFirestore, arrayRemove, doc, updateDoc, getDoc } from "firebase/firestore";

export default {
    name: "MyAppsComponent",
    data() {
        return {
            id: "",
            myOrders: [],
            tf:false,
        };
    },
    computed: {
        ...mapGetters('todo', ['getProductList']),
        ...mapGetters(['getTotalyOrdered']),
        ...mapGetters('uFAOS', ['getOrdered']),
        ...mapGetters('auth', ['getUserEmail'])
    },

    methods: {
        ...mapActions('todo', ['deleteItem']),
        ...mapActions(['setRedact']),
        
        async showMyItems() {
            try {
                const db = getFirestore();
                const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const arrayData = docSnap.data().selfAdds || [];
                    this.myOrders = arrayData.filter(order => order.email === this.getUserEmail);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        },
        async deleteApp(index) {
            try {
                const itemToDelete = this.myOrders[index];
                const db = getFirestore();
                const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                await updateDoc(docRef, {
                    selfAdds: arrayRemove(itemToDelete)
                });
                this.showMyItems(); 
                this.deleteItem(itemToDelete.id);
            } catch (error) {
                console.error("Error removing app:", error);
            }
        },
        deletee(){
            this.tf = !this.tf
        },
        setId(id) {
            this.setRedact(id)
        },
    },
    created() {
        this.showMyItems();
    }
}
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
