<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import cartService from "@/services/cartService";
import { getApiError } from "@/utils/apiError";

import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import CartEmptyState from "@/components/cart/CartEmptyState.vue";

const router = useRouter();

const cart = ref(null);

const loading = ref(false);
const error = ref("");

const loadCart = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response = await cartService.getCart();

        cart.value = response.data.cart;
    } catch (err) {
        /*
         * The backend returns 404 when the user has
         * never created a cart. For the UI, that means
         * an empty cart rather than an error.
         */
        if (err.response?.status === 404) {
            cart.value = {
                cartItems: [],
                totalPrice: 0
            };
        } else {
            error.value = getApiError(err);
        }
    } finally {
        loading.value = false;
    }
};

const updateQuantity = async (
    bookFormatId,
    newQuantity
) => {
    loading.value = true;
    error.value = "";

    try {
        const response =
            await cartService.updateCartQuantity(
                bookFormatId,
                newQuantity
            );

        const updatedCart = response.data.updatedCart;

        /*
         * Preserve the populated bookFormatId/bookId
         * information from the current cart.
         *
         * The quantity-update endpoint may return
         * unpopulated cart items, so we merge the
         * updated quantity into the existing items.
         */
        if (cart.value && updatedCart?.cartItems) {
            cart.value = {
                ...updatedCart,

                cartItems: updatedCart.cartItems.map(
                    (updatedItem) => {
                        const existingItem =
                            cart.value.cartItems.find(
                                (item) =>
                                    item.bookFormatId?._id ===
                                    updatedItem.bookFormatId?._id
                            );

                        if (
                            existingItem &&
                            existingItem.bookFormatId
                        ) {
                            return {
                                ...existingItem,
                                ...updatedItem,

                                // Keep the populated book format
                                bookFormatId:
                                    existingItem.bookFormatId
                            };
                        }

                        return updatedItem;
                    }
                )
            };
        } else {
            cart.value = updatedCart;
        }
    } catch (err) {
        error.value = getApiError(err);
    } finally {
        loading.value = false;
    }
};

const removeItem = async (bookFormatId) => {
    loading.value = true;
    error.value = "";

    try {
        const response =
            await cartService.removeFromCart(
                bookFormatId
            );

        cart.value = response.data.updatedCart;
    } catch (err) {
        error.value = getApiError(err);
    } finally {
        loading.value = false;
    }
};

const clearCart = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response =
            await cartService.clearCart();

        cart.value = response.data.updatedCart;
    } catch (err) {
        error.value = getApiError(err);
    } finally {
        loading.value = false;
    }
};

const proceedToCheckout = () => {
    router.push({
        name: "checkout"
    });
};

onMounted(loadCart);
</script>

<template>
    <main class="section">
        <div class="container-custom">

            <!-- Page Heading -->
            <header class="cart-header">
                <p class="section-label">
                    Shopping
                </p>

                <h1 class="section-title">
                    Your Cart
                </h1>

                <p class="section-subtitle">
                    Review the books you've selected
                    before checkout.
                </p>
            </header>


            <!-- Error -->
            <div
                v-if="error"
                class="cart-error surface"
                role="alert"
            >
                <i class="bi bi-exclamation-circle"></i>

                <span>
                    {{ error }}
                </span>

                <button
                    type="button"
                    @click="loadCart"
                >
                    Try Again
                </button>
            </div>


            <!-- Loading -->
            <div
                v-else-if="loading && !cart"
                class="cart-loading"
            >
                Loading your cart...
            </div>


            <!-- Empty Cart -->
            <CartEmptyState
                v-else-if="
                    cart &&
                    (!cart.cartItems ||
                    cart.cartItems.length === 0)
                "
            />


            <!-- Cart -->
            <div
                v-else-if="cart"
                class="cart-layout"
            >

                <!-- Items -->
                <section class="cart-items">

                    <div class="cart-items-header">
                        <h2>
                            Cart Items
                        </h2>

                        <span>
                            {{ cart.cartItems.length }}
                            product{{ cart.cartItems.length !== 1 ? "s" : "" }}
                        </span>
                    </div>

                    <div class="cart-items-list">

                        <CartItem
                            v-for="item in cart.cartItems"
                            :key="item._id"
                            :item="item"
                            @update-quantity="
                                updateQuantity(
                                    item.bookFormatId._id,
                                    $event
                                )
                            "
                            @remove="removeItem"
                        />

                    </div>

                </section>


                <!-- Summary -->
                <CartSummary
                    :cart="cart"
                    :loading="loading"
                    @checkout="proceedToCheckout"
                    @clear="clearCart"
                />

            </div>

        </div>
    </main>
</template>

<style scoped>
.cart-header {
    margin-bottom: var(--space-6);
}

.cart-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
    gap: var(--space-6);
}

.cart-items {
    min-width: 0;
}

.cart-items-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: var(--space-4);
}

.cart-items-header h2 {
    margin-bottom: 0;
}

.cart-items-header span {
    color: var(--color-muted);
    font-size: var(--fs-sm);
}

.cart-items-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.cart-loading {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-muted);
}

.cart-error {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-6);
    padding: var(--space-4);
}

.cart-error i {
    color: var(--color-secondary);
}

.cart-error span {
    flex: 1;
}

.cart-error button {
    color: var(--color-primary);
    font-weight: var(--fw-semibold);
}


/* ==========================================
   Small Screen
========================================== */

@media (max-width: 900px) {
    .cart-layout {
        grid-template-columns: 1fr;
    }
}
</style>
