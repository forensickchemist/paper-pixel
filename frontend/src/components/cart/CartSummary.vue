<script setup>
import { computed } from "vue";

const props = defineProps({
    cart: {
        type: Object,
        required: true
    },

    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    "checkout",
    "clear"
]);

const itemCount = computed(() => {
    return props.cart.cartItems?.reduce(
        (total, item) => total + Number(item.quantity),
        0
    ) || 0;
});

const totalPrice = computed(() => {
    return Number(props.cart.totalPrice || 0);
});
</script>

<template>
    <aside class="cart-summary surface">

        <h2 class="cart-summary-title">
            Cart Summary
        </h2>

        <div class="cart-summary-row">
            <span>
                Items
            </span>

            <span>
                {{ itemCount }}
            </span>
        </div>

        <div class="divider"></div>

        <div class="cart-summary-total">
            <span>
                Total
            </span>

            <strong>
                ₱{{ totalPrice.toFixed(2) }}
            </strong>
        </div>

        <button
            type="button"
            class="btn btn-primary w-100"
            :disabled="loading"
            @click="emit('checkout')"
        >
            Checkout
        </button>

        <button
            type="button"
            class="clear-cart-button"
            :disabled="loading"
            @click="emit('clear')"
        >
            Clear Cart
        </button>

    </aside>
</template>

<style scoped>
.cart-summary {
    padding: var(--space-6);
}

.cart-summary-title {
    margin-bottom: var(--space-5);
}

.cart-summary-row,
.cart-summary-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.cart-summary-row {
    margin-bottom: var(--space-4);
    color: var(--color-muted);
}

.cart-summary-total {
    margin-block: var(--space-5);
}

.cart-summary-total strong {
    color: var(--color-heading);
    font-size: var(--fs-xl);
}

.clear-cart-button {
    width: 100%;
    margin-top: var(--space-3);
    color: var(--color-secondary);
    font-weight: var(--fw-semibold);
}

.clear-cart-button:hover:not(:disabled) {
    color: var(--color-primary);
    text-decoration: underline;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>