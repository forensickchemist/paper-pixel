<script setup>
import PromoCarousel from "./PromoCarousel.vue";
import billboardData from "@/data/billboardData";

const promos = billboardData;
</script>

<template>
    <section
        class="community-billboard"
        aria-labelledby="community-billboard-title"
    >
        <div class="community-billboard-header">
            <p class="section-label text-uppercase">
                Community Billboard
            </p>

            <h2
                id="community-billboard-title"
                class="community-billboard-title"
            >
                What's happening at Paper Pixel?
            </h2>

            <p class="community-billboard-description text-muted">
                Discover events, announcements, literary highlights,
                promotions, and other things worth knowing.
            </p>
        </div>

        <PromoCarousel
            v-if="promos.length"
            :promos="promos"
        />

        <div
            v-else
            class="community-billboard-empty surface"
        >
            <i
                class="bi bi-megaphone"
                aria-hidden="true"
            ></i>

            <h3>
                Nothing new to announce right now.
            </h3>

            <p class="text-muted mb-0">
                Check back soon for updates from the Paper Pixel community.
            </p>
        </div>
    </section>
</template>

<style scoped>
.community-billboard {
    width: 100%;
}

.community-billboard-header {
    margin-bottom: var(--space-5);

    text-align: center;
}

.community-billboard-title {
    margin-bottom: var(--space-2);

    font-size: clamp(1.75rem, 4vw, 2.5rem);
    line-height: 1.1;
}

.community-billboard-description {
    max-width: 560px;
    margin: 0 auto;

    font-size: var(--fs-sm);
}

.community-billboard-empty {
    min-height: 320px;
    padding: var(--space-7);

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    text-align: center;
}

.community-billboard-empty > i {
    margin-bottom: var(--space-3);

    color: var(--color-primary);
    font-size: 2.5rem;
}

.community-billboard-empty h3 {
    margin-bottom: var(--space-2);
}
</style>