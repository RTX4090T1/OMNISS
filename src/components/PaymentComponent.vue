<template>
    <div class="mainBackColor text-white min-vh-100">
        <header class="main-header d-flex justify-content-between align-items-center px-4 py-3 shadow">
            <h1 class="text-primary">Payment Form</h1>
            <div class="dropdown ms-auto">
                <button class=" dropdown-toggle" type="button" id="setting" data-bs-toggle="dropdown"
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
            <form @submit.prevent="processPayment" class="card p-4 shadow-sm">
                <div class="mb-3">
                    <label for="name" class="form-label">Card owner</label>
                    <input type="text" class="form-control" id="name" v-model="paymentData.owner" required />
                    <p v-if="errors.owner" class="text-danger">{{ errors.owner }}</p>
                </div>

                <div class="mb-3">
                    <label for="email" class="form-label">Email</label>
                    <input type="text" class="form-control" id="email" v-model="paymentData.email" required />
                    <p v-if="errors.email" class="text-danger">{{ errors.email }}</p>
                </div>

                <div class="mb-3">
                    <label for="phone" class="form-label">Phone</label>
                    <input type="text" class="form-control" id="phone" v-model="paymentData.phone" required />
                    <p v-if="errors.phone" class="text-danger">{{ errors.phone }}</p>
                </div>

                <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" v-model="paymentData.card" maxlength="16"
                        required />
                    <p v-if="errors.card" class="text-danger">{{ errors.card }}</p>
                </div>

                <div class="row">
                    <div class="col-6 mb-3">
                        <label for="cvc" class="form-label">CVC</label>
                        <input type="text" class="form-control" id="cvc" v-model="paymentData.cvc" maxlength="3"
                            required />
                        <p v-if="errors.cvc" class="text-danger">{{ errors.cvc }}</p>
                    </div>

                    <div class="col-6 mb-3">
                        <label for="expiryDate" class="form-label">Expire Date</label>
                        <input type="text" class="form-control" id="expiryDate" v-model="paymentData.exp"
                            placeholder="MM/YY" maxlength="5" required />
                        <p v-if="errors.exp" class="text-danger">{{ errors.exp }}</p>
                    </div>
                </div>

                <div class="col-6 mb-3">
                    <label for="street" class="form-label">Street</label>
                    <input type="text" class="form-control" id="street" v-model="paymentData.street" maxlength="10"
                        required placeholder="optional" />
                </div>

                <div class="col-6 mb-3">
                    <label for="pc" class="form-label">Postal Code</label>
                    <input type="text" class="form-control" id="pc" v-model="paymentData.postcode" maxlength="10"
                        required />
                    <p v-if="errors.postcode" class="text-danger">{{ errors.postcode }}</p>
                </div>

                <button :disabled="isProcessing" type="submit" class="btn btn-primary mt-3 w-100">Pay Now</button>
                <p v-if="fail">{{ errorMessage }}</p>
                <router-link to="/">Home</router-link>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
    name: "PaymentComponent",
    props: ['id'],
    data() {
        return {
            paymentData: {
                owner: "",
                card: "",
                cvc: "",
                exp: "",
                cost: "",
                email: "",
                location: "",
                phone: "",
                postcode: "",
                street: "",
                id: "",
            },
            order: null,
            errors: {},
            product: null,
            fail: false,
            errorMessage: null,
        };
    },
    computed: {
        ...mapGetters('auth', ['getUserEmail', 'getUserName']),
    },
    methods: {
        ...mapActions('PRODUCT_STORE', ['getDocumentFromFDB', 'updateDocumentInFDB', 'getItemFromFDB', 'updateItemInFDB']),
        validateForm() {
            this.errors = {};
            let isValid = true;

            if (!this.paymentData.owner) {
                this.errors.owner = "Name is required.";
                isValid = false;
            }
            if (this.paymentData.card.length < 16) {
                this.errors.card = "Card number must be 16 digits.";
                isValid = false;
            }
            if (this.paymentData.cvc.length < 3) {
                this.errors.cvc = "CVC must be 3 digits.";
                isValid = false;
            }
            if (!this.paymentData.exp || !/^\d{2}\/\d{2}$/.test(this.paymentData.exp)) {
                this.errors.exp = "Invalid expiry date format. Use MM/YY.";
                isValid = false;
            }
            if (!this.paymentData.postcode) {
                this.errors.postcode = "Postal code is required.";
                isValid = false;
            }
            if (!this.paymentData.email || !(this.paymentData.email.includes("@gmail.com"))) {
                this.errors.email = "Email is required.";
                isValid = false;
            }
            if (!this.paymentData.phone || /^\d{2}\/\d{2}$/.test(this.paymentData.phone) || this.paymentData.phone.length < 10) {
                this.errors.phone = "Phone number is required.";
                isValid = false;
            }

            return isValid;
        },

        async processPayment() {
            try {
                var selected = await this.getItemFromFDB({
                    collectionName: 'PRODUCT_STORE',
                    document: 'qnmnilljBNJsRawRgdeU',
                    elementName: 'store'
                })
                this.product = selected.find(item => item.id == this.id)
                console.log(this.getUserEmail+"eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
                console.log(this.product.email + "KKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK");

                await this.updateItemInFDB({
                    collectionName: "paymentHistory",
                    document: "E7vayXDEfba6LKaMctS0",
                    arrayName: "payments",
                    newElement: {
                        owner: this.getUserName,
                        card: this.paymentData.card,
                        cvc: this.paymentData.cvc,
                        exp: this.paymentData.exp,
                        cost: this.product.price,
                        email: this.getUserEmail,
                        location: this.product.region,
                        phone: this.product.phone,
                        postcode: this.paymentData.postcode,
                        street: this.paymentData.street,
                        id: this.product.id,
                        date: new Date().toLocaleString()
                    }
                })
                if (this.fail == true) {
                    this.errorMessage == "An errr occured while processing yor payment."
                }
                else {
                    this.$router.push("/")
                    if (this.getUserEmail == this.product.email) {
                        this.processToMySales()
                    }
                    this.processToMyOrders()
                }
            } catch (fail) {
                this.fail = true
            }
        },
        async processToMySales() {
            await this.updateItemInFDB({
                collectionName: "uFAOS",
                document: "S64AWHz74Ua8E4ix9iMk",
                arrayName: "sales",
                newElement: {
                    owner: this.getUserName,
                    card: this.paymentData.card,
                    cvc: this.paymentData.cvc,
                    exp: this.paymentData.exp,
                    cost: this.product.price,
                    email: this.getUserEmail,
                    location: this.product.location,
                    phone: this.product.phone,
                    postcode: this.paymentData.postcode,
                    street: this.paymentData.street,
                    id: this.product.id,
                    date: new Date().toLocaleString(),
                    name: this.product.name,
                    condition: this.product.condition,
                    priceCondition: this.product.priceCondition,
                    images: this.product.images,
                    category: this.product.category,
                }
            })
        },
        async processToMyOrders() {
            await this.updateItemInFDB({
                collectionName: "uFAOS",
                document: "S64AWHz74Ua8E4ix9iMk",
                arrayName: "orders",
                newElement: {
                    name: this.product.name,
                    price: this.product.price,
                    description: this.product.description,
                    images: this.product.images,
                    phone: this.product.phone,
                    publisher: this.getUserName,
                    location: this.product.location,
                    region: this.product.region,
                    category: this.product.category,
                    condition: this.product.condition,
                    priceCondition: this.product.priceCondition,
                    id: this.product.id,
                    email: this.getUserEmail,
                    date: new Date().toLocaleString(),
                }
            })
        }
    }
}
</script>


<style scoped>
.mainBackColor {
    background-color: #f4f4f9;
}

.mainheader {
    background-color: #2e527c;
    padding: 15px 0;
    text-align: center;
}

h1 {
    font-size: 1.8rem;
    font-weight: bold;
    color: #ffffff;
}

.card {
    max-width: 600px;
    margin: 0 auto;
    border: none;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-label {
    font-size: 1rem;
    color: #333;
}

.form-control {
    border-radius: 5px;
    border: 1px solid #ccc;
}

button {
    background-color: transparent;
    border-color: transparent;
    border-radius: 5px;
    padding: 10px 0;
    font-size: 1rem;
    font-weight: bold;
    color: #000000;
}

.text-danger {
    font-size: 0.875rem;
}
</style>