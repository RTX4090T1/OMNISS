<template>
    <div class="mainBackColor text-white min-vh-100">
        <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
            <h1 class="text-primary">My advertisements</h1>
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

        <div class="container mt-4">
            <div v-if="myAds.length > 0">
                <div class="row">
                    <div class="col-md-4" v-for="(item, index) in myAds" :key="index">
                        <div class="card ad-card mb-4 shadow-sm">
                            <div class="card-body">
                                <div class="card-img-top" v-if="item.images && item.images.length > 0">
                                    <img :src="item.images[0]" class="card-img" alt="Product Image">
                                </div>
                                <h5 class="card-title ad-name">{{ item.name }}</h5>
                                <p class="card-text price">Price: {{ item.price }}</p>
                                <p class="card-text category">Category: {{ item.category }}</p>
                                <p class="card-text description">Description: {{ item.description }}</p>
                                <p class="card-text publisher">Publisher: {{ item.publisher }}</p>
                                <p class="card-text condition">Condition: {{ item.condition }}</p>
                                <p class="card-text orderer">Owner: {{ item.email }}</p>
                                <p class="card-text location">Location: {{ item.region }}</p>
                                <p class="card-text city">City: {{ item.location }}</p>
                            </div>
                            <div class="card-footer text-center">
                                <router-link :id="index"  :to="{ name: 'redact', params: { ids: item.id } }"
                                    class="btn btn-outline-primary btn-sm">Redact</router-link>
                                <button  :id="index" @click="deleteApp(item.id)"
                                    class="btn btn-outline-danger btn-sm ml-2">Delete</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center" style="color:rgb(46, 82, 124);">
                <p>Your store is empty, but you can always add new items.</p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "MyAddsComponent",
    data() {
        return {
            id: "",
            myAds: [],
            tf: false,
        };
    },
    computed: {
        ...mapGetters('auth', ['getUserEmail'])
    },
    methods: {
        ...mapActions('PRODUCT_STORE', ['getItemFromFDB','deleteItemFromFDB']),

        async showMyItems() {
            try {
               let items = await this.getItemFromFDB({collectionName:"PRODUCT_STORE", document:"qnmnilljBNJsRawRgdeU", elementName: "store"})

                if (items) {
                    this.myAds = items.filter(order => order.email === this.getUserEmail);
                } else {
                    console.error("No such document!");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        },
        async deleteApp(id) {
            try {
                let element = this.myAds.find(item => item.id == id)
                await this.deleteItemFromFDB({collectionName:"uFAOS", document:"S64AWHz74Ua8E4ix9iMk", field:"selfAdds", elementName:element})
                await this.deleteItemFromFDB({collectionName:"PRODUCT_STORE", document:"qnmnilljBNJsRawRgdeU", field:"store", elementName:element})
                this.showMyItems();
            } catch (error) {
                console.error("Error removing app:", error);
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
    background-color: #f8f9fa;
    border-radius: 8px;
    border: none;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 20px;
    margin: 20px auto;
    transition: transform 0.3s ease-in-out;
}

.card-body {
    padding: 20px;
}

.ad-name {
    color: #2e527c;
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 15px;
}

.card-text {
    font-size: 1.1rem;
    color: #6c757d;
    margin-bottom: 10px;
}

.price,
.category,
.publisher,
.condition,
.orderer,
.location,
.city {
    color: #495057;
    font-weight: 600;
}

.card-footer {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 15px;
}

.card-footer .btn {
    border-radius: 5px;
}

.card-footer .btn-outline-primary {
    color: #2e527c;
    border-color: #2e527c;
}

.card-footer .btn-outline-danger {
    color: #d9534f;
    border-color: #d9534f;
}

.card-footer .btn:hover {
    background-color: #f0f0f0;
    color: #495057;
}
</style>