<script setup>
import { computed } from "vue";

const props = defineProps({
    cart: {
        type: Object,
        required: true
    }
});

const totalPrice = computed(() => {
    return Number(props.cart.totalPrice || 0);
});
</script>

<template>
    <aside class="order-summary surface">

        <h2>
            Order Summary
        </h2>


        <div class="order-items">

            <div
                v-for="item in cart.cartItems"
                :key="item._id"
                class="order-item"
            >
                <div>
                    <strong>
                        {{ item.bookFormatId?.bookId?.title }}
                    </strong>

                    <span>
                        {{ item.bookFormatId?.type }}
                        × {{ item.quantity }}
                    </span>
                </div>

                <strong>
                    ₱{{ Number(item.subtotal).toFixed(2) }}
                </strong>
            </div>

        </div>


        <div class="divider"></div>


        <div class="order-total">
            <span>
                Total
            </span>

            <strong>
                ₱{{ totalPrice.toFixed(2) }}
            </strong>
        </div>

    </aside>
</template>

<style scoped>
.order-summary {
    padding: var(--space-6);
}

.order-summary h2 {
    margin-bottom: var(--space-5);
}

.order-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
}

.order-item {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
}

.order-item div {
    display: flex;
    flex-direction: column;
}

.order-item strong {
    color: var(--color-heading);
}

.order-item span {
    color: var(--color-muted);
    font-size: var(--fs-sm);
}

.order-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-5);
}

.order-total strong {
    font-size: var(--fs-xl);
    color: var(--color-heading);
}
</style>