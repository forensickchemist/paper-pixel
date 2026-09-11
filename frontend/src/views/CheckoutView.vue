<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import cartService from "@/services/cartService";
import orderService from "@/services/orderService";
import { getApiError } from "@/utils/apiError";

import CheckoutForm from "@/components/checkout/CheckoutForm.vue";
import OrderSummary from "@/components/checkout/OrderSummary.vue";
import CartEmptyState from "@/components/cart/CartEmptyState.vue";

const router = useRouter();

const cart = ref(null);

const loading = ref(false);
const loadingCart = ref(true);
const error = ref("");

const loadCart = async () => {
    loadingCart.value = true;
    error.value = "";

    try {
        const response = await cartService.getCart();

        cart.value = response.data.cart;
    } catch (err) {
        if (err.response?.status === 404) {
            cart.value = {
                cartItems: [],
                totalPrice: 0
            };
        } else {
            error.value = getApiError(err);
        }
    } finally {
        loadingCart.value = false;
    }
};


const checkout = async (orderData) => {
    loading.value = true;
    error.value = "";

    try {
        await orderService.checkout(orderData);

        router.push({
            name: "orders"
        });
    } catch (err) {
        error.value = getApiError(err);
    } finally {
        loading.value = false;
    }
};


onMounted(loadCart);
</script>

<template>
    <main class="section">
        <div class="container-custom">

            <header class="checkout-header">
                <p class="section-label">
                    Checkout
                </p>

                <h1 class="section-title">
                    Complete Your Order
                </h1>

                <p class="section-subtitle">
                    Enter your shipping information
                    to place your order.
                </p>
            </header>


            <!-- Error -->
            <div
                v-if="error"
                class="checkout-error surface"
                role="alert"
            >
                <i class="bi bi-exclamation-circle"></i>

                <span>
                    {{ error }}
                </span>
            </div>


            <!-- Loading -->
            <div
                v-if="loadingCart"
                class="checkout-loading"
            >
                Loading your order...
            </div>


            <!-- Empty Cart -->
            <CartEmptyState
                v-else-if="
                    !cart ||
                    !cart.cartItems ||
                    cart.cartItems.length === 0
                "
            />


            <!-- Checkout -->
            <div
                v-else
                class="checkout-layout"
            >

                <CheckoutForm
                    :loading="loading"
                    @submit="checkout"
                />

                <OrderSummary
                    :cart="cart"
                />

            </div>

        </div>
    </main>
</template>

<style scoped>
.checkout-header {
    margin-bottom: var(--space-6);
}

.checkout-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 360px;
    align-items: start;
    gap: var(--space-6);
}

.checkout-error {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    padding: var(--space-4);
}

.checkout-loading {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-muted);
}

@media (max-width: 900px) {
    .checkout-layout {
        grid-template-columns: 1fr;
    }
}
</style>