<script setup>
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

import BookCard from "@/components/books/BookCard.vue";
import PromoCarousel from "@/components/billboard/PromoCarousel.vue";

import billboardData from "@/data/billboardData";

import bookService from "@/services/bookService";
import { getApiError } from "@/utils/apiError";

const featuredBooks = ref([]);
const isLoading = ref(false);
const apiError = ref("");

const promos = billboardData;

const getFeaturedBooks = async () => {
    apiError.value = "";
    isLoading.value = true;

    try {
        const response = await bookService.getFeaturedBooks();

        featuredBooks.value = response.data.books || [];
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    getFeaturedBooks();
});
</script>

<template>
    <div class="bookstore-page">

        <!-- ==========================================
             Hero Section
             ========================================== -->
        <section class="hero-section section">
            <div class="container">
                <div class="row align-items-center g-5">

                    <!-- Hero Content -->
                    <div class="col-lg-7">
                        <p class="hero-eyebrow text-uppercase">
                            Welcome to Paper Pixel
                        </p>

                        <h1 class="hero-title">
                            Find your next
                            <span class="text-primary">
                                favorite book.
                            </span>
                        </h1>

                        <p class="hero-description">
                            Discover stories, ideas, and new perspectives
                            from a carefully curated collection of books.
                        </p>

                        <div class="d-flex flex-wrap gap-3">
                            <a
                                href="#featured-books"
                                class="btn btn-primary btn-lg"
                            >
                                Explore Books
                            </a>

                            <RouterLink
                                class="btn btn-outline btn-lg"
                                :to="{ name: 'booksCatalog' }"
                            >
                                Browse Collection
                            </RouterLink>
                        </div>
                    </div>

                    <!-- Community Teaser -->
                    <div class="col-lg-5">
                        <PromoCarousel
                            v-if="promos.length"
                            :promos="promos"
                        />
                    </div>

                </div>
            </div>
        </section>


        <!-- ==========================================
             Featured Books
             Books are selected and managed by admin.
             ========================================== -->
        <section
            id="featured-books"
            class="featured-books-section section"
        >
            <div class="container">

                <div class="section-heading">
                    <p class="section-label text-uppercase">
                        Discover
                    </p>

                    <h2 class="section-title">
                        Featured Books
                    </h2>

                    <p class="section-subtitle">
                        A few books to get you started.
                    </p>
                </div>


                <!-- Loading State -->
                <div
                    v-if="isLoading"
                    class="text-center py-5"
                >
                    <div
                        class="spinner-border text-primary"
                        role="status"
                    >
                        <span class="visually-hidden">
                            Loading featured books...
                        </span>
                    </div>

                    <p class="mt-3 mb-0 text-muted">
                        Loading featured books...
                    </p>
                </div>


                <!-- Error State -->
                <div
                    v-else-if="apiError"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ apiError }}
                </div>


                <!-- Featured Books -->
                <div
                    v-else-if="featuredBooks.length"
                    class="row g-4"
                >
                    <div
                        v-for="book in featuredBooks"
                        :key="book._id"
                        class="col-md-6 col-lg-4"
                    >
                        <BookCard :book="book" />
                    </div>
                </div>


                <!-- No Featured Books -->
                <div
                    v-else
                    class="text-center py-5"
                >
                    <i
                        class="bi bi-book empty-icon"
                        aria-hidden="true"
                    ></i>

                    <h3 class="mt-3">
                        No featured books right now.
                    </h3>

                    <p class="text-muted mb-0">
                        Check back soon for our featured collection.
                    </p>
                </div>

            </div>
        </section>


        <!-- ==========================================
             Catalog CTA
             ========================================== -->
        <section class="catalog-cta section-sm">
            <div class="container">
                <div class="cta-card">

                    <div>
                        <p class="section-label text-uppercase">
                            Ready to browse?
                        </p>

                        <h2 class="mb-2">
                            Find your next book.
                        </h2>

                        <p class="mb-0">
                            Explore the Paper Pixel collection.
                        </p>
                    </div>

                    <RouterLink
                        class="btn btn-lg cta-button"
                        :to="{ name: 'booksCatalog' }"
                    >
                        Browse Collection
                    </RouterLink>

                </div>
            </div>
        </section>

    </div>
</template>

<style scoped>
.bookstore-page {
    overflow: hidden;
}

.hero-section {
    position: relative;
    min-height: 650px;
    padding-block: var(--space-9);

    display: flex;
    align-items: center;

    background-image: url("@/assets/images/bookstore-hero.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.hero-section::before {
    content: "";
    position: absolute;
    inset: 0;

    background: rgba(245, 238, 238, 0.72);
}

.hero-section .container {
    position: relative;
    z-index: 1;
}

.hero-eyebrow,
.section-label {
    margin-bottom: var(--space-2);

    color: var(--color-secondary);

    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
    letter-spacing: 0.08em;
}

.hero-title {
    max-width: 700px;
    margin-bottom: var(--space-5);

    font-size: clamp(2.5rem, 6vw, 4.5rem);
    line-height: 1.05;
    text-wrap: balance;
}

.hero-description {
    max-width: 600px;
    margin-bottom: var(--space-6);

    color: var(--color-body);
    font-size: var(--fs-md);
}

.section-heading {
    max-width: 650px;
    margin-bottom: var(--space-6);
}

.section-heading .section-title {
    margin-bottom: var(--space-2);
}

.featured-books-section {
    padding-top: var(--space-8);
}

.empty-icon {
    color: var(--color-muted);
    font-size: 3rem;
}

.catalog-cta {
    padding-bottom: var(--space-8);
}

.cta-card {
    padding: var(--space-6);

    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-5);

    background-color: var(--color-primary);
    border-radius: var(--radius-lg);

    color: #fff;
}

.cta-card h2 {
    color: #fff;
}

.cta-card .section-label {
    color: var(--color-accent);
}

.cta-card p {
    color: rgba(255, 255, 255, 0.8);
}

.cta-button {
    flex-shrink: 0;

    background-color: var(--color-accent);
    border-color: var(--color-accent);

    color: var(--color-heading);
}

.cta-button:hover:not(:disabled) {
    background-color: var(--color-surface);
    border-color: var(--color-surface);
    color: var(--color-heading);
}

@media (max-width: 767.98px) {
    .hero-section {
        padding-block: var(--space-7);
    }

    .cta-card {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>