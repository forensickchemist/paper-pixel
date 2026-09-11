<template>
    <section class="cart-empty surface">

        <div class="cart-empty-icon">
            <i class="bi bi-cart"></i>
        </div>

        <h2>
            Your cart is empty
        </h2>

        <p>
            Browse our collection and add some books
            to your cart.
        </p>

        <RouterLink
            :to="{ name: 'booksCatalog' }"
            class="btn btn-primary"
        >
            Browse Books
        </RouterLink>

    </section>
</template>

<style scoped>
.cart-empty {
    padding: var(--space-8);
    text-align: center;
}

.cart-empty-icon {
    margin-bottom: var(--space-4);
    color: var(--color-secondary);
    font-size: 3rem;
}

.cart-empty h2 {
    margin-bottom: var(--space-2);
}

.cart-empty p {
    margin-bottom: var(--space-6);
    color: var(--color-muted);
}
</style>