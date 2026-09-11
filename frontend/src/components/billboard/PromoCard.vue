<script setup>
import { computed } from "vue";
import { RouterLink } from "vue-router";

const props = defineProps({
    promo: {
        type: Object,
        required: true
    }
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

    return icons[props.promo.type] || "bi-megaphone";
});
</script>

<template>
    <article class="promo-card surface">

        <div class="promo-icon-wrapper">
            <i
                :class="['bi', iconClass]"
                aria-hidden="true"
            ></i>
        </div>

        <p class="promo-label section-label">
            {{ promo.label }}
        </p>

        <h2 class="promo-title">
            {{ promo.title }}
        </h2>

        <p class="promo-description text-body">
            {{ promo.description }}
        </p>

        <p
            v-if="promo.meta"
            class="promo-meta text-muted"
        >
            <i
                class="bi bi-calendar3"
                aria-hidden="true"
            ></i>

            <span>{{ promo.meta }}</span>
        </p>

        <RouterLink
            v-if="promo.actionText && promo.actionTo"
            :to="promo.actionTo"
            class="btn btn-primary promo-action"
        >
            {{ promo.actionText }}

            <i
                class="bi bi-arrow-right"
                aria-hidden="true"
            ></i>
        </RouterLink>

    </article>
</template>

<style scoped>
.promo-card {
    min-height: 320px;
    padding: var(--space-7);

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-align: center;

    /* Hero-specific glass treatment */
    background: rgba(255, 255, 255, 0.78);
    border-color: rgba(255, 255, 255, 0.6);
    box-shadow: var(--shadow-md);

    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
}

.promo-icon-wrapper {
    width: 3.5rem;
    height: 3.5rem;
    margin-bottom: var(--space-3);

    display: flex;
    align-items: center;
    justify-content: center;

    color: var(--color-primary);
    font-size: 1.75rem;
}

.promo-label {
    margin-bottom: var(--space-2);
}

.promo-title {
    max-width: 420px;
    margin-bottom: var(--space-3);

    font-size: clamp(1.75rem, 3vw, 2.5rem);
    line-height: 1.1;
}

.promo-description {
    max-width: 420px;
    margin-bottom: var(--space-4);
}

.promo-meta {
    margin-bottom: var(--space-5);

    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);

    font-size: var(--fs-sm);
}

.promo-action {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
}

@media (max-width: 767.98px) {
    .promo-card {
        min-height: 240px;
        padding: var(--space-5);
    }

    .promo-title {
        font-size: 1.9rem;
    }
}
</style>