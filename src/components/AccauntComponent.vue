<template>
  <div class="main-back-color min-vh-100 d-flex justify-content-center align-items-center">
    <div class="card profile-card p-4 rounded shadow-lg text-center">
      
      <div class="profile-section mb-3">
        <div class="profile-picture rounded-circle mx-auto d-flex align-items-center justify-content-center">
          <img src="https://via.placeholder.com/140" alt="Profile Picture" class="rounded-circle img-fluid" />
        </div>
        <p class="mt-2 change-picture">Change Picture</p>
      </div>

      <div class="user-info mb-4">
        <p class="user-name">{{ getUserName || 'Guest' }}</p>
        <p class="user-email">{{ getUserEmail || 'Not Logged In' }}</p>
      </div>

      <div class="list-group list-group-flush mb-3">
        <router-link class="list-group-item list-group-item-action text-center fs-5" to="/myAdds">
          <i class="bi bi-folder me-2"></i> My Applications
        </router-link>
        <router-link class="list-group-item list-group-item-action text-center fs-5" to="/ord">
          <i class="bi bi-cart me-2"></i> My Orders
        </router-link>
        <router-link class="list-group-item list-group-item-action text-center fs-5" to="/sale">
          <i class="bi bi-bar-chart me-2"></i> My Sales
        </router-link>
        <router-link class="list-group-item list-group-item-action text-center fs-5" to="/favorites">
          <i class="bi bi-heart me-2"></i> Favorites
        </router-link>
        <router-link class="list-group-item list-group-item-action text-center fs-5" to="/addApplication">
          <i class="bi bi-plus-circle me-2"></i> Publish New Ad
        </router-link>
      </div>
      
      <button @click="signOut" class="btn btn-primary w-100 mb-3">
        <i class="bi bi-box-arrow-right me-2"></i> Sign Out
      </button>
      
      <router-link class="btn btn-outline-primary w-100" to="/">
        <i class="bi bi-house me-2"></i> Home
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  name: "AccountComponent",
  computed: {
    ...mapGetters('auth', ['getUserName', 'getUserEmail'])
  },
  methods: {
    signOut() {
      this.$store.dispatch('auth/logout');
      this.$router.push('/');
    }
  }
};
</script>

<style scoped>

.main-back-color {
  background-color: #f0f2f5;
}

.profile-card {
  width: 100%;
  max-width: 480px;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
}

.profile-picture {
  width: 140px;
  height: 140px;
  background-color: #f9a3a3;
}

.change-picture {
  font-size: 0.875rem;
  color: #007bff;
  cursor: pointer;
}

.user-name {
  font-weight: bold;
  font-size: 1.5rem;
  color: #333333;
}

.user-email {
  font-size: 1rem;
  color: #666666;
}

.list-group-item {
  font-size: 1.1rem;
  font-weight: 500;
  color: #333;
  transition: background-color 0.3s ease;
}

.list-group-item:hover {
  background-color: #f0f0f0;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  font-size: 1rem;
  font-weight: 600;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
  font-size: 1rem;
}

.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}

@media (max-width: 767px) {
  .profile-card {
    width: 90%;
    padding: 2rem;
  }
}
</style>
