<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const authStore = useAuthStore();

const isLoading = ref(false);

const form = ref({
  firstName: "",
  lastName: "",
  mobileNo: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const apiError = ref("");

const handleRegister = async () => {
  apiError.value = "";

  if (form.value.password !== form.value.confirmPassword) {
    apiError.value = "Passwords do not match.";
    return;
  }

  isLoading.value = true;

  const { confirmPassword, ...userData } = form.value;

  try {
    await authStore.register(userData);

    router.push({ name: "login" });
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
      Create your account
    </h2>

    <div
      v-if="apiError"
      class="alert alert-danger"
      role="alert"
    >
      {{ apiError }}
    </div>

    <form @submit.prevent="handleRegister">
      <div class="row">

        <div class="col-md-6 mb-3">
          <label
            for="firstName"
            class="form-label"
          >
            First Name
          </label>

          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            class="form-control"
            placeholder="Your first name"
            autocomplete="given-name"
            :disabled="isLoading"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label
            for="lastName"
            class="form-label"
          >
            Last Name
          </label>

          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            class="form-control"
            placeholder="Your last name"
            autocomplete="family-name"
            :disabled="isLoading"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label
            for="mobileNo"
            class="form-label"
          >
            Mobile Number
          </label>

          <input
            id="mobileNo"
            v-model="form.mobileNo"
            type="tel"
            class="form-control"
            placeholder="Your mobile number"
            autocomplete="tel"
            :disabled="isLoading"
          />
        </div>

        <div class="col-md-6 mb-3">
          <label
            for="registerEmail"
            class="form-label"
          >
            Email
          </label>

          <input
            id="registerEmail"
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="Your email"
            autocomplete="email"
            :disabled="isLoading"
          />
        </div>

      </div>

      <div class="mb-3">
        <label
          for="registerPassword"
          class="form-label"
        >
          Password
        </label>

        <input
          id="registerPassword"
          v-model="form.password"
          type="password"
          class="form-control"
          placeholder="Create password"
          autocomplete="new-password"
          :disabled="isLoading"
        />
      </div>

      <div class="mb-4">
        <label
          for="confirmPassword"
          class="form-label"
        >
          Confirm Password
        </label>

        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="form-control"
          placeholder="Confirm password"
          autocomplete="new-password"
          :disabled="isLoading"
        />
      </div>

      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="isLoading"
      >
        {{ isLoading ? "Registering..." : "Register" }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>
