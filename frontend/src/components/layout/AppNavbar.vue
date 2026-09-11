<script setup>
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

const logout = () => {
  authStore.logout();
  router.replace({ name: "home" });
};
</script>

<template>
  <nav class="navbar navbar-expand-lg app-navbar">
    <div class="container">

      <!-- Brand -->
      <RouterLink class="navbar-brand brand-name" :to="{ name: 'home' }">
        Paper Pixel
      </RouterLink>

      <!-- Mobile Toggle -->
      <button
        class="navbar-toggler mobile-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarMenu"
        aria-controls="navbarMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <i class="bi bi-list"></i>
      </button>

      <!-- Navigation -->
      <div id="navbarMenu" class="collapse navbar-collapse">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-3">

          <li class="nav-item">
            <RouterLink
              class="nav-link"
              :to="{ name: 'booksCatalog' }"
            >
              Books
            </RouterLink>
          </li>

          <RouterLink
              to="/community"
              class="nav-link"
          >
              Community
          </RouterLink>

          <!-- My Orders -->
          <li
            v-if="
              authStore.isAuthenticated &&
              authStore.user?.role !== 'admin'
            "
            class="nav-item"
          >
            <RouterLink
              class="nav-link"
              :to="{ name: 'orders' }"
            >
              My Orders
            </RouterLink>
          </li>

          <!-- My Cart -->
          <li
            v-if="
              authStore.isAuthenticated &&
              authStore.user?.role !== 'admin'
            "
            class="nav-item"
          >
            <RouterLink
              class="nav-link"
              :to="{ name: 'cart' }"
            >
              My Cart
            </RouterLink>
          </li>

          <li
            v-if="
              authStore.isAuthenticated &&
              authStore.user?.role === 'admin'
            "
            class="nav-item"
          >
            <RouterLink
              class="nav-link"
              :to="{ name: 'admin-dashboard' }"
            >
              Admin Dashboard
            </RouterLink>
          </li>

          <li
            v-if="!authStore.isAuthenticated"
            class="nav-item"
          >
            <RouterLink
              class="nav-link"
              :to="{ name: 'login' }"
            >
              Login
            </RouterLink>
          </li>

          <li
            v-if="!authStore.isAuthenticated"
            class="nav-item"
          >
            <RouterLink
              class="btn btn-primary"
              :to="{ name: 'register' }"
            >
              Register
            </RouterLink>
          </li>

          <li
            v-if="authStore.isAuthenticated"
            class="nav-item"
          >
            <button
              class="btn btn-primary"
              type="button"
              @click="logout"
            >
              Logout
            </button>
          </li>

        </ul>
      </div>

    </div>
  </nav>
</template>

<style scoped>
.app-navbar {
  background-color: var(--color-surface);
  border-bottom: var(--border);
  padding-block: var(--space-4);
}

/* Brand */

.brand-name {
  margin: 0;
  padding: 0;

  color: var(--color-primary);

  font-family: var(--font-heading);
  font-size: var(--fs-xl);
  font-weight: var(--fw-semibold);
}

.brand-name:hover {
  color: var(--color-secondary);
}

/* Navigation */

.nav-link {
  color: var(--color-body);
  transition: color var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-primary);
}

/* Mobile Toggle */

.mobile-toggle {
  padding: var(--space-2);

  border: none;

  color: var(--color-primary);
  font-size: var(--fs-xl);
}

.mobile-toggle:focus {
  box-shadow: none;
}

.mobile-toggle:hover {
  color: var(--color-secondary);
}

/* Mobile Navigation */

@media (max-width: 991.98px) {
  .navbar-collapse {
    padding-top: var(--space-4);
  }

  .navbar-nav {
    align-items: flex-start !important;
  }
}
</style>