<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import bookService from "@/services/bookService";
import { getApiError } from "@/utils/apiError";
import AddToCart from "@/components/cart/AddToCart.vue";

const route = useRoute();

const book = ref(null);
const isLoading = ref(false);
const apiError = ref("");

const getBook = async () => {
  apiError.value = "";
  isLoading.value = true;

  try {
    const response = await bookService.getBook(route.params.id);
    book.value = response.data.book;
  } catch (error) {
    const err = getApiError(error);
    apiError.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const formatPublicationDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onMounted(() => {
  getBook();
});
</script>

<template>
  <div class="book-details-page">


    <section class="section">
      <div class="container">

        <!-- Back to Catalog -->
        <RouterLink :to="{ name: 'booksCatalog' }" class="back-link">
          <i class="bi bi-arrow-left"></i>
          Back to Books
        </RouterLink>

        <!-- Error -->
        <div v-if="apiError" class="alert alert-danger mt-4" role="alert">
          {{ apiError }}
        </div>

        <!-- Loading -->
        <div v-else-if="isLoading" class="details-message">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">
              Loading book...
            </span>
          </div>

          <p class="mt-3 mb-0">
            Loading book details...
          </p>
        </div>

        <!-- Book Details -->
        <div v-else-if="book" class="book-details surface">
          <div class="row g-5">

            <!-- Cover -->
            <div class="col-md-5 col-lg-4">
              <div class="book-cover">
                <img v-if="book.coverImage?.url" :src="book.coverImage.url" :alt="`Cover of ${book.title}`"/>

                <div v-else class="book-cover-placeholder">
                  <i class="bi bi-book"></i>
                </div>
              </div>
              <AddToCart :book="book" />
            </div>
            

            <!-- Information -->
            <div class="col-md-7 col-lg-8">
              <div class="book-information">

                <p class="book-label text-uppercase">
                  Book Details
                </p>

                <h1 class="book-title">
                  {{ book.title }}
                </h1>

                <!-- Publication Date -->
                <div class="book-meta">
                  <span class="meta-label">
                    Published:
                  </span>
                  {{ formatPublicationDate(book.publicationDate) }}
                </div>

                <!-- Categories -->
                <div class="book-meta">
                  <span class="meta-label">
                    Categories:
                  </span>
                  
                  <span class="book-categories">
                    <span v-for="(category, index) in book.categories" :key="category._id" class="category-badge">
                      {{ category.name }}
                    </span>
                  </span>
                </div>

                <!-- Authors -->
                <div class="book-meta">
                  <div>
                    <span class="meta-label">
                      Author:
                    </span>

                    <span
                      v-for="(author, index) in book.authors"
                      :key="author._id"
                    >
                      {{ author.firstName }} {{ author.lastName }}
                      <span v-if="index < book.authors.length - 1">, </span>
                    </span>
                  </div>

                  <div
                    v-for="author in book.authors"
                    :key="`about-${author._id}`"
                    class="author-about"
                  >
                    <p
                      v-for="(paragraph, index) in author.about?.split(/\n\s*\n/)"
                      :key="index"
                    >
                      {{ paragraph }}
                    </p>
                  </div>
                </div>

                <hr class="details-divider" />

                <!-- Description -->
                <div class="book-description">
                  <h2>About this book</h2>

                  <p
                    v-for="(paragraph, index) in book.description?.split(/\n\s*\n/)"
                    :key="index"
                  >
                    {{ paragraph }}
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>

      </div>
    </section>


  </div>
</template>

<style scoped>
.book-details-page {
  overflow: hidden;
}

/* ==========================================
   Book Cover Override
========================================== */
.book-cover {
  height: 320px;
}

/* ==========================================
   Back Link
========================================== */

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);

  color: var(--color-primary);
  font-weight: var(--fw-medium);
}

.back-link:hover {
  color: var(--color-secondary);
}

/* ==========================================
   Details Container
========================================== */

.book-details {
  margin-top: var(--space-5);
  padding: var(--space-6);
}

/* ==========================================
   Information
========================================== */

.book-information {
  height: 100%;
}

.book-label {
  margin-bottom: var(--space-2);
  color: var(--color-secondary);
  font-size: var(--fs-sm);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.08em;
}

.book-title {
  font-size: clamp(2rem, 4vw, 3rem);
}

.book-meta {
  margin-bottom: var(--space-3);
  color: var(--color-body);
}

.meta-label {
  margin-right: var(--space-2);
  color: var(--color-heading);
  font-weight: var(--fw-semibold);
}

.author-about {
  margin-top: var(--space-2);
  margin-bottom: var(--space-3);
  color: var(--color-body);
  font-size: var(--fs-xs);
  line-height: 1.6;
}

.author-about p {
  margin-bottom: var(--space-3);
}

.author-about p:last-child {
  margin-bottom: 0;
}
/* ==========================================
   Description
========================================== */

.details-divider {
  margin-block: var(--space-5);

  border-color: var(--color-border);
  opacity: 1;
}

.book-description h2 {
  margin-bottom: var(--space-3);
  font-size: var(--fs-xl);
}

.book-description {
  display: block;
  overflow: visible;
}

.book-description p {
  margin-bottom: var(--space-4);
  line-height: 1.6;
  font-size: var(--fs-md);
}

.book-description p:last-child {
  margin-bottom: 0;
}

/* ==========================================
   Loading
========================================== */

.details-message {
  min-height: 400px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;
}

/* ==========================================
   Responsive
========================================== */

@media (max-width: 767.98px) {
  .book-details {
    padding: var(--space-4);
  }
}
</style>
