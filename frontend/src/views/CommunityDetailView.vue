<script setup>
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

import billboardData from "@/data/billboardData";

const route = useRoute();

const promo = computed(() => {
    return billboardData.find(
        (item) => item.slug === route.params.slug
    );
});

const iconClass = computed(() => {
    const icons = {
        event: "bi-calendar-event",
        promotion: "bi-tag",
        award: "bi-trophy",
        author: "bi-person",
        new: "bi-stars",
        announcement: "bi-megaphone",
        spotlight: "bi-bookmark-star"
    };

    return icons[promo.value?.type] || "bi-megaphone";
});
</script>

<template>
    <main class="community-detail-page">
        <div class="container-custom section">

            <!-- Back Navigation -->
            <RouterLink
                to="/community"
                class="community-detail-back"
            >
                <i
                    class="bi bi-arrow-left"
                    aria-hidden="true"
                ></i>

                Back to Community
            </RouterLink>


            <!-- Not Found -->
            <section
                v-if="!promo"
                class="community-detail-not-found surface"
            >
                <i
                    class="bi bi-journal-x"
                    aria-hidden="true"
                ></i>

                <h1 class="text-heading">
                    Community item not found
                </h1>

                <p class="text-body text-muted">
                    The community story or announcement you're
                    looking for may no longer be available.
                </p>

                <RouterLink
                    to="/community"
                    class="btn btn-primary"
                >
                    Browse Community
                </RouterLink>
            </section>


            <!-- Detail -->
            <article
                v-else
                class="community-detail"
            >

                <!-- Header -->
                <header class="community-detail-header">

                    <div class="community-detail-type">
                        <span class="community-detail-icon">
                            <i
                                :class="`bi ${iconClass}`"
                                aria-hidden="true"
                            ></i>
                        </span>

                        <span class="section-label">
                            {{ promo.label }}
                        </span>
                    </div>

                    <h1 class="community-detail-title text-heading">
                        {{ promo.title }}
                    </h1>

                    <p class="community-detail-meta text-muted">
                        {{ promo.meta }}
                    </p>

                </header>


                <!-- Content -->
                <div class="community-detail-content">

                    <!-- Lead -->
                    <p class="community-detail-lead">
                        {{ promo.description }}
                    </p>

                    <div class="divider"></div>

                    <!-- Actual Billboard Content -->
                    <div class="community-detail-body">
                        <p
                            v-for="(paragraph, index) in promo.content"
                            :key="index"
                        >
                            {{ paragraph }}
                        </p>
                    </div>

                </div>

            </article>

        </div>
    </main>
</template>

<style scoped>
.community-detail-page {
    min-height: 100%;
}

.community-detail-back {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-6);

    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;

    transition:
        color var(--transition-fast),
        transform var(--transition-fast);
}

.community-detail-back:hover {
    color: var(--color-heading);
    transform: translateX(-2px);
}

.community-detail-back:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
}

.community-detail {
    max-width: 900px;
    margin: 0 auto;
}

.community-detail-header {
    margin-bottom: var(--space-7);
    text-align: center;
}

.community-detail-type {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
    margin-bottom: var(--space-4);
}

.community-detail-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 2.5rem;
    height: 2.5rem;

    background: var(--color-primary-soft);
    border-radius: 50%;

    color: var(--color-primary);
    font-size: 1.1rem;
}

.community-detail-title {
    max-width: 760px;
    margin: 0 auto;

    font-size: clamp(2.25rem, 5vw, 4rem);
    line-height: 1.05;
}

.community-detail-meta {
    margin-top: var(--space-4);
    margin-bottom: 0;
}

.community-detail-content {
    max-width: 760px;
    margin: 0 auto;

    font-size: 1.05rem;
    line-height: 1.8;
}

.community-detail-lead {
    margin-bottom: var(--space-5);

    font-size: 1.25rem;
    line-height: 1.7;

    color: var(--color-heading);
}

.community-detail-body p {
    margin-bottom: var(--space-5);
}

.community-detail-body p:last-child {
    margin-bottom: 0;
}

.community-detail-not-found {
    max-width: 700px;
    margin: var(--space-8) auto 0;
    padding: var(--space-8);

    text-align: center;
}

.community-detail-not-found > i {
    display: block;
    margin-bottom: var(--space-4);

    color: var(--color-primary);
    font-size: 3rem;
}

.community-detail-not-found h1 {
    margin-bottom: var(--space-3);
}

.community-detail-not-found p {
    max-width: 500px;
    margin: 0 auto var(--space-5);
}

@media (max-width: 767.98px) {
    .community-detail-header {
        text-align: left;
    }

    .community-detail-title {
        margin-left: 0;
    }

    .community-detail-content {
        font-size: 1rem;
    }

    .community-detail-lead {
        font-size: 1.15rem;
    }
}
</style>