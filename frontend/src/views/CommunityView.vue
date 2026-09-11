<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

import billboardData from "@/data/billboardData";

const communityItems = computed(() => {
    return billboardData;
});

const getIconClass = (type) => {
    const icons = {
        event: "bi-calendar-event",
        promotion: "bi-tag",
        award: "bi-trophy",
        author: "bi-person",
        new: "bi-stars",
        announcement: "bi-megaphone",
        spotlight: "bi-bookmark-star"
    };

    return icons[type] || "bi-megaphone";
};
</script>

<template>
    <main class="community-page">
        <!-- ==========================================
             Community Header
             ========================================== -->
        <section class="community-header section-sm">
            <div class="container-custom">
                <div class="community-header-content">
                    <p class="section-label text-uppercase">
                        Paper Pixel Community
                    </p>

                    <h1 class="section-title">
                        What's happening at Paper Pixel?
                    </h1>

                    <p class="section-subtitle">
                        Discover upcoming events, special promotions,
                        literary highlights, announcements, and other
                        things worth knowing about our reading community.
                    </p>
                </div>
            </div>
        </section>


        <!-- ==========================================
             Community Items
             ========================================== -->
        <section class="community-list section">
            <div class="container-custom">

                <!-- Items -->
                <div
                    v-if="communityItems.length"
                    class="community-grid"
                >
                    <article
                        v-for="item in communityItems"
                        :key="item.id"
                        class="community-card surface rounded-lg shadow-sm"
                    >
                        <div class="community-card-header">
                            <div class="community-card-type">
                                <span class="community-icon">
                                    <i
                                        :class="`bi ${getIconClass(item.type)}`"
                                        aria-hidden="true"
                                    ></i>
                                </span>

                                <span class="section-label text-uppercase">
                                    {{ item.label }}
                                </span>
                            </div>

                            <span class="community-meta text-muted">
                                {{ item.meta }}
                            </span>
                        </div>

                        <div class="community-card-body">
                            <h2 class="community-card-title text-heading">
                                {{ item.title }}
                            </h2>

                            <p class="community-card-description text-muted">
                                {{ item.description }}
                            </p>
                        </div>

                        <div class="community-card-footer">
                            <RouterLink
                                :to="item.actionTo"
                                class="community-card-link text-primary"
                            >
                                {{ item.actionText }}

                                <i
                                    class="bi bi-arrow-right"
                                    aria-hidden="true"
                                ></i>
                            </RouterLink>
                        </div>
                    </article>
                </div>


                <!-- Empty State -->
                <div
                    v-else
                    class="community-empty surface rounded-lg"
                >
                    <i
                        class="bi bi-megaphone"
                        aria-hidden="true"
                    ></i>

                    <h2 class="text-heading">
                        Nothing new right now.
                    </h2>

                    <p class="text-muted">
                        Check back soon for events, announcements,
                        promotions, and other community news.
                    </p>

                    <RouterLink
                        :to="{ name: 'booksCatalog' }"
                        class="btn btn-primary"
                    >
                        Browse Books
                    </RouterLink>
                </div>

            </div>
        </section>
    </main>
</template>

<style scoped>
.community-page {
    overflow: hidden;
}

.community-header {
    padding-bottom: var(--space-5);
}

.community-header-content {
    max-width: 760px;
}

.community-header-content .section-title {
    margin-bottom: var(--space-3);
}

.community-header-content .section-subtitle {
    max-width: 680px;
}

.community-list {
    padding-top: var(--space-5);
}

.community-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-5);
}

.community-card {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: var(--space-6);

    transition:
        transform var(--transition-fast),
        box-shadow var(--transition-fast);
}

.community-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
}

.community-card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
}

.community-card-type {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.community-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;

    background-color: var(--color-primary-soft);
    border-radius: 50%;

    color: var(--color-primary);
    font-size: 1.1rem;
}

.community-card-type .section-label {
    margin-bottom: 0;
}

.community-meta {
    flex-shrink: 0;
    font-size: var(--fs-sm);
    text-align: right;
}

.community-card-body {
    flex: 1;
}

.community-card-title {
    margin-bottom: var(--space-3);
    font-size: var(--fs-xl);
    line-height: 1.2;
}

.community-card-description {
    margin-bottom: var(--space-5);
    line-height: 1.7;
}

.community-card-footer {
    margin-top: auto;
    padding-top: var(--space-4);
    border-top: var(--border);
}

.community-card-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);

    font-weight: var(--fw-semibold);
    text-decoration: none;

    transition:
        color var(--transition-fast),
        gap var(--transition-fast);
}

.community-card-link:hover {
    gap: var(--space-3);
    color: var(--color-heading);
}

.community-card-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
}

.community-empty {
    max-width: 700px;
    margin: 0 auto;
    padding: var(--space-8);

    text-align: center;
}

.community-empty > i {
    display: block;
    margin-bottom: var(--space-4);

    color: var(--color-muted);
    font-size: 3rem;
}

.community-empty h2 {
    margin-bottom: var(--space-3);
}

.community-empty p {
    max-width: 500px;
    margin: 0 auto var(--space-5);
}

@media (max-width: 767.98px) {
    .community-grid {
        grid-template-columns: 1fr;
    }

    .community-card {
        padding: var(--space-5);
    }

    .community-card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .community-meta {
        text-align: left;
    }
}
</style>