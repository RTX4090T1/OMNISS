<template>
  <div class="mainBackColor text-white min-vh-100 d-flex justify-content-center align-items-center">
    <div class="login-container p-4 rounded shadow bg-light text-center">
      <h2 class="mb-4 text-primary">Login</h2>
      
      <form @submit.prevent="loginWithEmaill" class="text-start">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            v-model="email" 
            id="email" 
            placeholder="Enter your email" 
            class="form-control" 
          />
        </div>
        
        <div class="mb-3">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            v-model="password" 
            id="password" 
            placeholder="Enter your password" 
            class="form-control" 
          />
        </div>
        <span v-if="error" class="text-danger">{{ error }}</span>
        
        <button type="submit" class="btn btn-primary w-100 mb-3">Login</button>
      </form>

      <hr />

      <button @click="googleLogin" class="btn btn-outline-primary w-100">
        <i class="bi bi-google me-2"></i> Login with Google
      </button>
      <router-link class="d-flex my-3 justify-content-center align-items-center text-decoration-none text-primary" to="/register">Create new account</router-link>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/firebase-config';

export default {
  name: "LoginComponent",
  data() {
    return {
      email: "",
      password: "",
      error: null
    };
  },
  computed: {
    ...mapGetters('auth', ['getError'])
  },
  methods: {
    ...mapActions('auth', ['loginWithGoogle', 'loginWithEmail']),
    
    async loginWithEmaill() {
      try {
        await this.loginWithEmail({ email: this.email, password: this.password });
        if (!this.getError) {
          this.$router.push('/');   
        } else {
          this.error = "An error occurred while logging in.";
        }
      } catch (error) {
        console.error('Login failed:', error); 
      }
    },

    async googleLogin() {
      const provider = new GoogleAuthProvider();
      try {
        const loginData = await signInWithPopup(auth, provider);
        await this.$store.dispatch('auth/saveLoginDataToUser', loginData);
        this.$router.push('/'); 
      } catch (error) {
        this.error = "An error occurred while logging in with Google.";
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.mainBackColor {
  background-color: #f0f2f5;
}

.login-container {
  max-width: 400px;
  border-radius: 8px;
  background-color: white;
  color: #333;
}

h2 {
  font-size: 1.75rem;
  font-weight: bold;
  color: #0d6efd;
}

.form-control {
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  color: #495057;
}

.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
  border-radius: 8px;
}

.btn-primary:hover {
  background-color: #0b5ed7;
}

.btn-outline-primary {
  color: #0d6efd;
  border: 1px solid #0d6efd;
  border-radius: 8px;
}

.btn-outline-primary:hover {
  background-color: #0d6efd;
  color: white;
}

hr {
  border-color: #ced4da;
}

.text-danger {
  font-size: 0.875rem;
}

.text-primary {
  color: #0d6efd !important;
}

.text-decoration-none {
  text-decoration: none !important;
}

@media (max-width: 576px) {
  .login-container {
    width: 90%;
  }
}
</style>
