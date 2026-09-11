<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const user = computed(() => authStore.user);

defineProps({
  user: {
    type: Object,
    default: null,
  },
});
</script>

<template>
    <div class="welcome-card surface">

      <div>
        <p class="section-label text-uppercase">
          Welcome
        </p>

        <div class="d-flex align-items-center gap-2">
          <h2 class="mb-0">
            {{ user?.firstName }}
            {{ user?.lastName }}!
          </h2>

          <span class="admin-badge">
            {{ user?.role }}
          </span>
        </div>

        <p class="mb-2">
          You are signed in as an administrator.
        </p>

        <p class="mb-0">
          If you are adding a book for the first time, make sure to check:
        </p>

        <ol style="list-style-type: number">
          <li>That author exists in "Manage Authors". If it doesn't, add the author at "Add Authors".</li>
          <li>That the category is already in the "Manage Categories". If not, add the category/genre at "Add Categories".</li>
          <li>Once author and category are confirmed, add the new book's details in "Add Books". <br>NOTE: If you need to select multiple authors/categories, you have to press Ctrl + Select.</li>
          <li>Lastly, add book format and inventory details by clicking on "Manage Books" and then "Manage Formats" next to the book you're trying to edit.</li>
        </ol>
      </div>

    </div>
</template>

<style scoped>
  .welcome-card {
    margin-top: var(--space-6);
    padding: var(--space-5);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-4);
  }

  .welcome-card h2 {
    margin-bottom: var(--space-2);
  }

  .welcome-card p,
  .welcome-card ol {
    color: var(--color-muted);
  }

  @media (max-width: 575.98px) {
    .welcome-card {
      align-items: flex-start;
      flex-direction: column;
    }
  }
</style>

