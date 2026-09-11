<script setup>
import { onMounted, ref } from "vue";

import orderService from "@/services/orderService";
import { getApiError } from "@/utils/apiError";

const orders = ref([]);

const loading = ref(true);
const error = ref("");

const loadOrders = async () => {
    loading.value = true;
    error.value = "";

    try {
        const response =
            await orderService.getMyOrders();

        orders.value = response.data.orders;
    } catch (err) {
        if (err.response?.status === 404) {
            orders.value = [];
        } else {
            error.value = getApiError(err);
        }
    } finally {
        loading.value = false;
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString(
        "en-PH",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
};

onMounted(loadOrders);
</script>

<template>
    <main class="section">
        <div class="container-custom">

            <header class="orders-header">
                <p class="section-label">
                    Account
                </p>

                <h1 class="section-title">
                    Order History
                </h1>

                <p class="section-subtitle">
                    View your previous orders and their
                    current status.
                </p>
            </header>


            <!-- Error -->
            <div
                v-if="error"
                class="orders-error surface"
                role="alert"
            >
                {{ error }}
            </div>


            <!-- Loading -->
            <div
                v-else-if="loading"
                class="orders-loading"
            >
                Loading your orders...
            </div>


            <!-- Empty -->
            <section
                v-else-if="orders.length === 0"
                class="orders-empty surface"
            >
                <div class="orders-empty-icon">
                    <i class="bi bi-receipt"></i>
                </div>

                <h2>
                    No orders yet
                </h2>

                <p>
                    Your completed orders will appear here.
                </p>

                <RouterLink
                    :to="{ name: 'booksCatalog' }"
                    class="btn btn-primary"
                >
                    Browse Books
                </RouterLink>
            </section>


            <!-- Orders -->
            <section
                v-else
                class="orders-list"
            >

                <article
                    v-for="order in orders"
                    :key="order._id"
                    class="order-card surface"
                >

                    <header class="order-card-header">

                        <div>
                            <p class="order-number">
                                Order #{{ order._id }}
                            </p>

                            <small>
                                {{ formatDate(order.createdAt) }}
                            </small>
                        </div>

                        <span
                            class="order-status"
                        >
                            {{ order.status }}
                        </span>

                    </header>


                    <div class="order-card-items">

                        <div
                            v-for="item in order.orderItems"
                            :key="item._id"
                            class="order-card-item"
                        >

                            <div>
                                <strong>
                                    {{ item.titleSnapshot }}
                                </strong>

                                <span>
                                    {{ item.formatSnapshot }}
                                    × {{ item.quantity }}
                                </span>
                            </div>

                            <strong>
                                ₱{{ Number(item.subtotal).toFixed(2) }}
                            </strong>

                        </div>

                    </div>


                    <div class="divider"></div>


                    <footer class="order-card-footer">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₱{{ Number(order.totalPrice).toFixed(2) }}
                        </strong>

                    </footer>

                </article>

            </section>

        </div>
    </main>
</template>

<style scoped>
.orders-header {
    margin-bottom: var(--space-6);
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: var(--space-5);
}

.order-card {
    padding: var(--space-6);
}

.order-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
}

.order-number {
    margin-bottom: var(--space-1);
    color: var(--color-heading);
    font-weight: var(--fw-semibold);
}

.order-status {
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    background: var(--color-background);
    color: var(--color-secondary);
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
}

.order-card-items {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    margin-bottom: var(--space-5);
}

.order-card-item {
    display: flex;
    justify-content: space-between;
    gap: var(--space-4);
}

.order-card-item div {
    display: flex;
    flex-direction: column;
}

.order-card-item span {
    color: var(--color-muted);
    font-size: var(--fs-sm);
}

.order-card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--space-5);
}

.order-card-footer strong {
    color: var(--color-heading);
    font-size: var(--fs-xl);
}

.orders-empty {
    padding: var(--space-8);
    text-align: center;
}

.orders-empty-icon {
    margin-bottom: var(--space-4);
    color: var(--color-secondary);
    font-size: 3rem;
}

.orders-empty h2 {
    margin-bottom: var(--space-2);
}

.orders-empty p {
    color: var(--color-muted);
}

.orders-loading {
    padding: var(--space-8);
    text-align: center;
    color: var(--color-muted);
}

.orders-error {
    padding: var(--space-4);
}

@media (max-width: 600px) {
    .order-card-header,
    .order-card-item {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>