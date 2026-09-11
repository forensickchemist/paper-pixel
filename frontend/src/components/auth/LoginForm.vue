<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");

const isLoading = ref(false);
const apiError = ref("");

const handleLogin = async () => {
  apiError.value = "";

  if (!email.value || !password.value) {
    apiError.value = "Please enter your email and password.";
    return;
  }

  isLoading.value = true;

  try {
    await authStore.login({
      email: email.value,
      password: password.value,
    });

    if(authStore.user?.role === "admin") {
      router.push({ name: "admin-dashboard" });
    } else {
      router.push({ name: "home" });
    }
    
  } catch (err) {
    apiError.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="auth-form">
    <h2 class="form-title">
      Login to your account
    </h2>

    <div
      v-if="apiError"
      class="alert alert-danger"
      role="alert"
    >
      {{ apiError }}
    </div>

    <form @submit.prevent="handleLogin">
      <div class="mb-3">
        <label
          for="loginEmail"
          class="form-label"
        >
          Email address
        </label>

        <input
          id="loginEmail"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter your email"
          autocomplete="email"
          :disabled="isLoading"
        />
      </div>

      <div class="mb-4">
        <label
          for="loginPassword"
          class="form-label"
        >
          Password
        </label>

        <input
          id="loginPassword"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
          autocomplete="current-password"
          :disabled="isLoading"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="isLoading"
      >
        {{ isLoading ? "Logging in..." : "Login" }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>

