<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <article class="book-card surface hover-lift h-100">
    <!-- Book Cover -->
    <div class="book-cover">
      <img
        v-if="book.coverImage?.url"
        :src="book.coverImage.url"
        :alt="`${book.title} cover`"
      />

      <div
        v-else
        class="book-cover-placeholder"
      >
        <i class="bi bi-book"></i>
      </div>
    </div>

    <!-- Book Information -->
    <div class="book-content">

      <h3 class="book-title">
        {{ book.title }}
      </h3>

      <p class="book-author">
        <span
          v-for="(author, index) in book.authors"
          :key="author._id"
        >
          {{ author.firstName }} {{ author.lastName }}<span
            v-if="index < book.authors.length - 1"
          >, </span>
        </span>
      </p>

      <!-- Categories -->
      <div class="book-categories">
        <span
          v-for="category in book.categories"
          :key="category._id"
          class="category-badge"
        >
          {{ category.name }}
        </span>
      </div>

      <!-- Book Formats -->
      <div
        v-if="book.formats?.length"
        class="book-formats"
      >
        <span
          v-for="format in book.formats"
          :key="format._id"
          class="format-badge"
        >
          {{ format.type }}

          <i
            v-if="format.type === 'ebook' || format.stock > 0"
            class="bi bi-check-circle-fill format-icon available"
            aria-label="Available"
          ></i>

          <i
            v-else
            class="bi bi-x-circle-fill format-icon unavailable"
            aria-label="Out of stock"
          ></i>
        </span>
      </div>

      <p class="book-description mt-2">
        {{ book.description }}
      </p>

      <RouterLink
        :to="{ name: 'bookDetails', params: { id: book._id } }"
        class="btn btn-primary w-100"
      >
        View Book
      </RouterLink>

    </div>
  </article>
</template>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
}

.book-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.book-formats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);

  margin-top: var(--space-3);
}

.book-description {
  margin-bottom: var(--space-4);
}

.book-content .btn {
  margin-top: auto;
}
</style>