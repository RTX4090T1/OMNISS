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
                    <label for="name" class="form-label">Name</label>
                    <input type="text" class="form-control" id="name" v-model="paymentData.name" required />
                    <p v-if="errors.name" class="text-danger">{{ errors.name }}</p>
                </div>

                <div class="mb-3">
                    <label for="surname" class="form-label">Surname</label>
                    <input type="text" class="form-control" id="surname" v-model="paymentData.surname" required />
                    <p v-if="errors.surname" class="text-danger">{{ errors.surname }}</p>
                </div>

                <div class="mb-3">
                    <label for="cardNumber" class="form-label">Card Number</label>
                    <input type="text" class="form-control" id="cardNumber" v-model="paymentData.cardNumber"
                        maxlength="16" required />
                    <p v-if="errors.cardNumber" class="text-danger">{{ errors.cardNumber }}</p>
                </div>

                <div class="row">
                    <div class="col-6 mb-3">
                        <label for="cvc" class="form-label">CVC</label>
                        <input type="text" class="form-control" id="cvc" v-model="paymentData.cvc" maxlength="3"
                            required />
                        <p v-if="errors.cvc" class="text-danger">{{ errors.cvc }}</p>
                    </div>

                    <div class="col-6 mb-3">
                        <label for="expiryDate" class="form-label">Expiry Date</label>
                        <input type="text" class="form-control" id="expiryDate" v-model="paymentData.expiryDate"
                            placeholder="MM/YY" maxlength="5" required />
                        <p v-if="errors.expiryDate" class="text-danger">{{ errors.expiryDate }}</p>
                    </div>
                </div>

                <div class="col-6 mb-3">
                    <label for="pc" class="form-label">Postal Code</label>
                    <input type="text" class="form-control" id="pc" v-model="paymentData.pc" maxlength="10" required />
                    <p v-if="errors.pc" class="text-danger">{{ errors.pc }}</p>
                </div>

                <button :disabled="isProcessing" type="submit" class="btn btn-primary mt-3 w-100">Pay Now</button>
                <router-link to="/">Home</router-link>
            </form>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { getFirestore, doc, updateDoc, arrayUnion } from "firebase/firestore";

export default {
    name: "PaymentComponent",
    data() {
        return {
            orderedProduct: {
                name: "",
                price: "",
                condition: "",
                description: "",
                publisher: "",
                pNumber: ""
            },
            paymentData: {
                name: "",
                surname: "",
                cardNumber: "",
                cvc: "",
                expiryDate: "",
                pc: "",
                error: "",
            },
            errors: {},
            isProcessing: false,
            product: null
        };
    },
    computed: {
        ...mapGetters('auth', ['getUserEmail']),
        ...mapGetters(['getOrdered']),
        ...mapGetters('todo', ['getProductList']),
    },
    methods: {
        ...mapActions('upay', ['addItem']),
        ...mapActions(['setTotalyOrder']),
        ...mapActions('todo', ['updateItem']),
        ...mapActions('uFAOS', ['addItem']),

        validateForm() {
            this.errors = {}; // Clear previous errors
            let isValid = true;

            if (!this.paymentData.name) {
                this.errors.name = "Name is required.";
                isValid = false;
            }
            if (!this.paymentData.surname) {
                this.errors.surname = "Surname is required.";
                isValid = false;
            }
            if (this.paymentData.cardNumber.length < 16) {
                this.errors.cardNumber = "Card number must be 16 digits.";
                isValid = false;
            }
            if (this.paymentData.cvc.length < 3) {
                this.errors.cvc = "CVC must be 3 digits.";
                isValid = false;
            }
            if (!this.paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(this.paymentData.expiryDate)) {
                this.errors.expiryDate = "Invalid expiry date format. Use MM/YY.";
                isValid = false;
            }
            if (!this.paymentData.pc) {
                this.errors.pc = "Postal code is required.";
                isValid = false;
            }

            return isValid;
        },

        async processPayment() {
            if (!this.validateForm()) {
                return;
            }

            this.isProcessing = true;
            console.log(this.getUserEmail);
            
            this.addItem({
                cardExpdate: this.paymentData.expiryDate,
                cardNumber: this.paymentData.cardNumber,
                owner: this.getUserEmail,
                postCode: this.paymentData.pc,
                cvc: this.paymentData.cvc,
            });

            this.id = this.getOrdered;

            if (this.id) {
                this.setTotalyOrder(this.id);
                this.paymentData.error = "Payment is being processed";
                this.product = this.getProductList.find(prod => prod.id == this.getOrdered);
                console.log(this.product);
                

                if (this.product) {
                    const db = getFirestore();
                    const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                    await updateDoc(docRef, {
                        orders: arrayUnion({
                            name: this.product.productName || "",
                            price: this.product.price || "",
                            condition: this.product.condition || "",
                            description: this.product.description || "",
                            publisher: this.product.publisher || "",
                            pNumber: this.product.phoneNumber || "",
                            email: this.getUserEmail || "",
                        }),
                    });
                    await this.processToMySales();
                    this.$router.push('/');
                } else {
                    console.error("Ordered product not found");
                }
            } else {
                console.error("Invalid Order ID: Could not set myOrder");
            }
        },

        async processToMySales() {
  
            var email = this.getUserEmail;
            console.log(email);
            console.log('====================1111=====');
            console.log(this.product);
            try {
                if (this.product.publishedBy == email) {
                    const db = getFirestore();
                    const docRef = doc(db, "uFAOS", "S64AWHz74Ua8E4ix9iMk");
                    console.log("=====================================================")
                    await updateDoc(docRef, {
                        sales: arrayUnion({
                            name: this.product.productName || "",
                            price: this.product.price || "",
                            description: this.product.description || "",
                            region: this.product.region,
                            phoneNumber: this.product.phoneNumber || "",
                            email: email || "",
                            id: this.id
                        }),
                    });
                } else {
                    console.error("Product does not include the email or is not an array");
                }
            } catch (error) {
                console.error("Error updating sales in Firestore:", error);
            }
        }
    },
};
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