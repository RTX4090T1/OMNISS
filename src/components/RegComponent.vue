<template>
  <div class="mainBackColor text-white min-vh-100 d-flex justify-content-center align-items-center">
    <div class="login-container p-5 rounded shadow-lg  text-center">
      <h2 class="mb-4 text-primary">Registration</h2>
      
      <form @submit.prevent="loginWithEmail" class="text-start">
        <div class="mb-3">
          <label for="name" class="form-label text-dark">Username</label>
          <input 
            type="text" 
            v-model="name" 
            id="name" 
            placeholder="Create username" 
            class="form-control bg-transparent text-dark border-secondary" 
          />
        </div>

        <div class="mb-3">
          <label for="email" class="form-label text-dark">Email</label>
          <input 
            type="email" 
            v-model="email" 
            id="email" 
            placeholder="Enter your email" 
            class="form-control bg-transparent text-dark border-secondary" 
          />
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label text-dark">Password</label>
          <input 
            type="password" 
            v-model="password" 
            id="password" 
            placeholder="Enter your password" 
            class="form-control bg-transparent text-dark border-secondary" 
          />
        </div>
        
        <span v-if="error" class="text-danger">{{ error }}</span>
        
        <button type="submit" class="btn btn-outline-primary w-100 mb-3">Create account</button>
      </form>

      <hr class="text-white" />

      <button @click="loginWithGoogle" class="btn btn-outline-light w-100">
        <i class="bi bi-google me-2"></i> Login with Google
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: "RegComponent",
  data() {
    return {
      name: "",
      email: "",
      password: "",
      error: null
    };
  },
  computed: {
    ...mapGetters('auth', ['getError'])
  },
  methods: {
    ...mapActions('auth', ['loginWithGoogle', 'createNewUser']),
    async loginWithEmail() {
      try {
        await this.createNewUser({ email: this.email, password: this.password, name: this.name });

        if (!this.getError) {
          this.$router.push('/');
        } else {
          this.error = "An error occurred during registration.";
        }
      } catch (error) {
        console.error('Registration failed:', error);
        this.error = error.message || "An error occurred while registering.";
      }
    }
  }
};
</script>

<style scoped>
.mainBackColor {
  background-color: #ffffff;
}

.login-container {
  max-width: 400px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);

}

h2 {
  color: #ffd700;
}

.form-control {
  background-color: rgba(255, 255, 255, 0.1);
  color: rgb(0, 0, 0);
  border-color: #020202;
}

.form-label {
  color: #000000;
}

.btn-outline-primary {
  color: #000000;
  border-color: #007bff;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: #030303;
}

.btn-outline-light {
  color: #000000;
  border-color: #007bff;
}

.btn-outline-light:hover {
  background-color: #ffffff;
  color: #2e527c;
}

.text-danger {
  color: #e74a3b;
}
</style>
