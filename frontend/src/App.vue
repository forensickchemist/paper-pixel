<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "@/stores/authStore";
import { RouterView } from "vue-router";
import AppNavbar from "@/components/layout/AppNavbar.vue";

const authStore = useAuthStore();

onMounted(async () => {
  if(authStore.accessToken) {
    try {
      await authStore.getCurrentUser();
    } catch (err) {
      authStore.logout();
      console.error(err);
    }
  }
});

</script>

<template>
  <AppNavbar />

  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
