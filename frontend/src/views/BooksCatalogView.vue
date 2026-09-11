<script setup>
import { onMounted, ref } from "vue";
import BookCard from "@/components/books/BookCard.vue";
import bookService from "@/services/bookService";
import { getApiError } from "@/utils/apiError";

const books = ref([]);
const searchTitle = ref("");
const isLoading = ref(false);
const apiError = ref("");
const isSearching = ref(false);

const getBooks = async () => {
  apiError.value = "";
  isLoading.value = true;

  try {
    const response = await bookService.getBooks();
    // console.log("Books response:", response.data);
    books.value = response.data.books;
    
  } catch (error) {
    const err = getApiError(error);
    apiError.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const searchBooks = async () => {
  const title = searchTitle.value.trim();

  if (!title) {
    await getBooks();
    isSearching.value = false;
    return;
  }

  apiError.value = "";
  isLoading.value = true;
  isSearching.value = true;

  try {
    const response = await bookService.searchBooksByTitle(title);
    books.value = response.data.books;
  } catch (error) {
    const err = getApiError(error);
    apiError.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const clearSearch = async () => {
  searchTitle.value = "";
  isSearching.value = false;

  await getBooks();
};

onMounted(() => {
  getBooks();
});
</script>

<template>
  <div class="catalog-page">


<!-- Catalog Header -->
<section class="catalog-header section-sm">
  <div class="container">
    <p class="section-label text-uppercase">
      Paper Pixel Collection
    </p>

    <h1 class="section-title">Books Catalog</h1>

    <p class="section-subtitle">
      Discover stories, ideas, and perspectives worth keeping.
    </p>

    <!-- Search -->
    <form class="search-form" @submit.prevent="searchBooks">
      <div class="input-group">

        <input
          v-model="searchTitle"
          type="search"
          class="form-control search-input"
          placeholder="Search books by title..."
          aria-label="Search books by title"
          :disabled="isLoading"
        />

        <button
          type="submit" class="btn btn-primary search-button" :disabled="isLoading">
          <i class="bi bi-search"></i>
          Search
        </button>

      </div>

      <button
        v-if="isSearching"
        type="button"
        class="btn btn-outline clear-button"
        :disabled="isLoading"
        @click="clearSearch"
      >
        <i class="bi bi-x-lg"></i>
        Clear Search
      </button>
    </form>
  </div>
</section>

<!-- Books -->
<section class="books-section section">
  <div class="container">

    <!-- API Error -->
    <div v-if="apiError" class="alert alert-danger" role="alert">
      {{ apiError }}
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading" class="catalog-message">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">
          Loading books...
        </span>
      </div>

      <p class="mt-3 mb-0">
        {{ isSearching ? "Searching books..." : "Loading books..." }}
      </p>
    </div>

    <!-- No Results -->
    <div v-else-if="books.length === 0" class="catalog-message surface">
      <i class="bi bi-book"></i>

      <h2>
        {{ isSearching ? "No books found" : "No books available" }}
      </h2>

      <p class="mb-0">
        {{
          isSearching
            ? "No books matched your search."
            : "There are currently no books in the collection."
        }}
      </p>
    </div>

    <!-- Books Grid -->
    <div v-else class="row g-4">
      <div v-for="book in books" :key="book._id" class="col-md-6 col-lg-4">
        <BookCard :book="book" />
      </div>
    </div>

  </div>
</section>


  </div>
</template>

<style scoped>
.catalog-page {
  overflow: hidden;
}

/* ==========================================
   Catalog Header
========================================== */

.catalog-header {
  padding-top: var(--space-7);
  padding-bottom: var(--space-5);
}

.section-label {
  margin-bottom: var(--space-2);

  color: var(--color-secondary);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.08em;
}

.section-title {
  margin-bottom: var(--space-2);
}

.section-subtitle {
  margin-bottom: var(--space-5);

  color: var(--color-muted);
}

/* ==========================================
   Search
========================================== */

.search-form {
  max-width: 700px;
}

.search-form .input-group {
  display: flex;
}

.search-input {
  min-height: 46px;

  border-color: var(--color-border);
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);

  color: var(--color-body);
}

.search-input:focus {
  border-color: var(--color-secondary);
  box-shadow: 0 0 0 0.2rem rgba(166, 124, 82, 0.15);
}

.search-button {
  min-width: 110px;
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.search-button:hover:not(:disabled) {
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);

  color: #fff;
}

.clear-button {
  margin-top: var(--space-3);
  padding-inline: var(--space-3);
}

.clear-button:hover:not(:disabled) {
  background-color: var(--color-surface);
  border-color: var(--color-primary);
}

/* ==========================================
   Catalog Messages
========================================== */

.catalog-message {
  min-height: 300px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

.catalog-message.surface {
  padding: var(--space-6);
}

.catalog-message i {
  margin-bottom: var(--space-3);

  color: var(--color-secondary);
  font-size: 3rem;
}
</style>
