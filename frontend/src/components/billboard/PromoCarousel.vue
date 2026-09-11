<script setup>
import {
    computed,
    onBeforeUnmount,
    onMounted,
    ref,
    watch
} from "vue";

import PromoCard from "./PromoCard.vue";

const props = defineProps({
    promos: {
        type: Array,
        default: () => []
    }
});

const activeIndex = ref(0);
const isPaused = ref(false);
const direction = ref("next");

let autoplayTimer = null;

const AUTOPLAY_INTERVAL = 5000;

const hasMultiplePromos = computed(() => {
    return props.promos.length > 1;
});

const activePromo = computed(() => {
    return props.promos[activeIndex.value];
});


/* ==========================================
   Navigation
   ========================================== */

const goTo = (index) => {
    if (!props.promos.length || index === activeIndex.value) {
        return;
    }

    direction.value =
        index > activeIndex.value
            ? "next"
            : "previous";

    activeIndex.value = index;

    restartAutoplay();
};

const previous = () => {
    if (!props.promos.length) {
        return;
    }

    direction.value = "previous";

    activeIndex.value =
        activeIndex.value === 0
            ? props.promos.length - 1
            : activeIndex.value - 1;

    restartAutoplay();
};

const next = () => {
    if (!props.promos.length) {
        return;
    }

    direction.value = "next";

    activeIndex.value =
        activeIndex.value === props.promos.length - 1
            ? 0
            : activeIndex.value + 1;

    restartAutoplay();
};


/* ==========================================
   Autoplay
   ========================================== */

const startAutoplay = () => {
    if (
        !hasMultiplePromos.value ||
        isPaused.value
    ) {
        return;
    }

    clearAutoplay();

    autoplayTimer = window.setInterval(() => {
        if (!isPaused.value) {
            next();
        }
    }, AUTOPLAY_INTERVAL);
};

const clearAutoplay = () => {
    if (autoplayTimer !== null) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
    }
};

const restartAutoplay = () => {
    clearAutoplay();
    startAutoplay();
};

const pauseAutoplay = () => {
    isPaused.value = true;
    clearAutoplay();
};

const resumeAutoplay = () => {
    isPaused.value = false;
    startAutoplay();
};


/* ==========================================
   Keep State Valid
   ========================================== */

watch(
    () => props.promos.length,
    (newLength) => {
        if (newLength === 0) {
            activeIndex.value = 0;
            clearAutoplay();
            return;
        }

        if (activeIndex.value >= newLength) {
            activeIndex.value = 0;
        }

        restartAutoplay();
    }
);


/* ==========================================
   Lifecycle
   ========================================== */

onMounted(() => {
    startAutoplay();
});

onBeforeUnmount(() => {
    clearAutoplay();
});
</script>

<template>
    <div
        v-if="promos.length"
        class="promo-carousel"
        aria-label="Paper Pixel community announcements"
        @mouseenter="pauseAutoplay"
        @mouseleave="resumeAutoplay"
    >
        <div
            class="promo-slide"
            aria-live="polite"
            aria-atomic="true"
        >
            <Transition
                :name="
                    direction === 'next'
                        ? 'page-next'
                        : 'page-previous'
                "
                mode="out-in"
            >
                <PromoCard
                    :key="activePromo?.id ?? activeIndex"
                    :promo="activePromo"
                />
            </Transition>
        </div>


        <template v-if="hasMultiplePromos">

            <!-- Previous -->
            <button
                type="button"
                class="carousel-control carousel-control-prev"
                aria-label="Previous announcement"
                @click="previous"
                @focus="pauseAutoplay"
                @blur="resumeAutoplay"
            >
                <i
                    class="bi bi-chevron-left"
                    aria-hidden="true"
                ></i>
            </button>


            <!-- Next -->
            <button
                type="button"
                class="carousel-control carousel-control-next"
                aria-label="Next announcement"
                @click="next"
                @focus="pauseAutoplay"
                @blur="resumeAutoplay"
            >
                <i
                    class="bi bi-chevron-right"
                    aria-hidden="true"
                ></i>
            </button>


            <!-- Indicators -->
            <div
                class="carousel-indicators"
                aria-label="Announcement navigation"
            >
                <button
                    v-for="(_, index) in promos"
                    :key="index"
                    type="button"
                    class="carousel-indicator"
                    :class="{
                        active: activeIndex === index
                    }"
                    :aria-label="`Go to announcement ${index + 1}`"
                    :aria-current="
                        activeIndex === index
                            ? 'true'
                            : undefined
                    "
                    @click="goTo(index)"
                    @focus="pauseAutoplay"
                    @blur="resumeAutoplay"
                ></button>
            </div>

        </template>
    </div>
</template>

<style scoped>
.promo-carousel {
    position: relative;

    perspective: 1200px;
}

.promo-slide {
    position: relative;

    overflow: visible;
}


/* ==========================================
   Page Turn — Next
   ========================================== */

.page-next-enter-active,
.page-next-leave-active {
    transition:
        transform 600ms ease,
        opacity 600ms ease;

    transform-origin: left center;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.page-next-enter-from {
    opacity: 0;
    transform: rotateY(25deg) translateX(35px);
}

.page-next-leave-to {
    opacity: 0;
    transform: rotateY(-25deg) translateX(-35px);
}


/* ==========================================
   Page Turn — Previous
   ========================================== */

.page-previous-enter-active,
.page-previous-leave-active {
    transition:
        transform 600ms ease,
        opacity 600ms ease;

    transform-origin: right center;

    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
}

.page-previous-enter-from {
    opacity: 0;
    transform: rotateY(-25deg) translateX(-35px);
}

.page-previous-leave-to {
    opacity: 0;
    transform: rotateY(25deg) translateX(35px);
}


/* ==========================================
   Carousel Controls
   ========================================== */

.carousel-control {
    position: absolute;
    top: 50%;
    z-index: 2;

    width: 2.75rem;
    height: 2.75rem;

    display: flex;
    align-items: center;
    justify-content: center;

    transform: translateY(-50%);

    background: rgba(255, 255, 255, 0.82);
    border: var(--border);
    border-radius: 50%;

    color: var(--color-heading);

    box-shadow: var(--shadow-sm);

    transition:
        background-color var(--transition-fast),
        transform var(--transition-fast);
}

.carousel-control:hover {
    background: var(--color-surface);
    transform: translateY(-50%) scale(1.05);
}

.carousel-control:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 3px;
}

.carousel-control-prev {
    left: var(--space-3);
}

.carousel-control-next {
    right: var(--space-3);
}


/* ==========================================
   Indicators
   ========================================== */

.carousel-indicators {
    position: absolute;
    bottom: var(--space-3);
    left: 50%;
    z-index: 2;

    display: flex;
    gap: var(--space-2);

    transform: translateX(-50%);
}

.carousel-indicator {
    width: 0.55rem;
    height: 0.55rem;
    padding: 0;

    background: var(--color-muted);
    border: 0;
    border-radius: 50%;

    opacity: 0.45;

    transition:
        opacity var(--transition-fast),
        transform var(--transition-fast);
}

.carousel-indicator:hover {
    opacity: 0.75;
}

.carousel-indicator.active {
    opacity: 1;
    transform: scale(1.2);
}

.carousel-indicator:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 3px;
}


/* ==========================================
   Mobile
   ========================================== */

@media (max-width: 767.98px) {
    .carousel-control {
        width: 2.35rem;
        height: 2.35rem;
    }

    .carousel-control-prev {
        left: var(--space-2);
    }

    .carousel-control-next {
        right: var(--space-2);
    }

    .carousel-indicators {
        bottom: var(--space-2);
    }
}


/* ==========================================
   Reduced Motion
   ========================================== */

@media (prefers-reduced-motion: reduce) {
    .page-next-enter-active,
    .page-next-leave-active,
    .page-previous-enter-active,
    .page-previous-leave-active,
    .carousel-control,
    .carousel-indicator {
        transition: none;
    }
}
</style>