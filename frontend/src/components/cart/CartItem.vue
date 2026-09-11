<script setup>
import { computed } from "vue";

const props = defineProps({
    item: {
        type: Object,
        required: true
    }
});

const emit = defineEmits([
    "update-quantity",
    "remove"
]);

const bookFormat = computed(() => props.item.bookFormatId);

const book = computed(() => bookFormat.value?.bookId);

const formatLabel = computed(() => {
    if (!bookFormat.value?.type) {
        return "";
    }

    return bookFormat.value.type.charAt(0).toUpperCase()
        + bookFormat.value.type.slice(1);
});

const unitPrice = computed(() => {
    if (
        bookFormat.value?.salePrice !== undefined &&
        bookFormat.value?.salePrice !== null
    ) {
        return Number(bookFormat.value.salePrice);
    }

    return Number(bookFormat.value?.price || 0);
});

const subtotal = computed(() => {
    return Number(props.item.subtotal || 0);
});

const increaseQuantity = () => {
    emit(
        "update-quantity",
        props.item.quantity + 1
    );
};

const decreaseQuantity = () => {
    if (props.item.quantity <= 1) {
        return;
    }

    emit(
        "update-quantity",
        props.item.quantity - 1
    );
};

const handleQuantityInput = (event) => {
    const quantity = Number(event.target.value);

    if (!Number.isInteger(quantity) || quantity < 1) {
        event.target.value = props.item.quantity;
        return;
    }

    emit("update-quantity", quantity);
};

const handleRemove = () => {
    emit(
        "remove",
        props.item.bookFormatId._id
    );
};
</script>

<template>
    <article class="cart-item surface">

        <!-- Book Cover -->
        <div class="cart-item-cover">

            <img
                v-if="book?.coverImage?.url"
                :src="book.coverImage.url"
                :alt="`${book.title} cover`"
            />

            <div
                v-else
                class="cart-item-cover-placeholder"
            >
                <i class="bi bi-book"></i>
            </div>

        </div>


        <!-- Book Information -->
        <div class="cart-item-information">

            <h3 class="cart-item-title">
                {{ book?.title || "Book unavailable" }}
            </h3>

            <p class="cart-item-format">
                {{ formatLabel }}
            </p>

            <p class="cart-item-price">
                ₱{{ unitPrice.toFixed(2) }}
                <span>each</span>
            </p>

        </div>


        <!-- Quantity -->
        <div class="cart-item-quantity">

            <label
                :for="`quantity-${item._id}`"
                class="quantity-label"
            >
                Quantity
            </label>

            <div class="quantity-control">

                <button
                    type="button"
                    class="quantity-button"
                    :disabled="item.quantity <= 1"
                    aria-label="Decrease quantity"
                    @click="decreaseQuantity"
                >
                    −
                </button>

                <input
                    :id="`quantity-${item._id}`"
                    type="number"
                    min="1"
                    :value="item.quantity"
                    aria-label="Quantity"
                    @change="handleQuantityInput"
                />

                <button
                    type="button"
                    class="quantity-button"
                    aria-label="Increase quantity"
                    @click="increaseQuantity"
                >
                    +
                </button>

            </div>

        </div>


        <!-- Subtotal -->
        <div class="cart-item-subtotal">

            <span class="subtotal-label">
                Subtotal
            </span>

            <strong>
                ₱{{ subtotal.toFixed(2) }}
            </strong>

        </div>


        <!-- Remove -->
        <button
            type="button"
            class="remove-button"
            @click="handleRemove"
        >
            Remove
        </button>

    </article>
</template>

<style scoped>
.cart-item {
    display: grid;
    grid-template-columns:
        100px
        minmax(0, 1fr)
        auto
        minmax(90px, auto)
        auto;

    align-items: center;
    gap: var(--space-4);
    padding: var(--space-5);
    min-width: 0;
}

.cart-item-cover {
    width: 100px;
    aspect-ratio: 2 / 3;
    overflow: hidden;
    border-radius: var(--radius-sm);
    background: var(--color-background);
}

.cart-item-cover img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.cart-item-cover-placeholder {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    color: var(--color-muted);
    font-size: var(--fs-xl);
}

.cart-item-information {
    min-width: 0;
}

.cart-item-title {
    margin-bottom: var(--space-2);
    overflow-wrap: break-word;
}

.cart-item-format {
    margin-bottom: var(--space-2);
    color: var(--color-secondary);
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
}

.cart-item-price {
    margin-bottom: 0;
    color: var(--color-body);
    font-weight: var(--fw-semibold);
}

.cart-item-price span {
    color: var(--color-muted);
    font-size: var(--fs-sm);
    font-weight: normal;
}

.quantity-label,
.subtotal-label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--color-muted);
    font-size: var(--fs-sm);
}

.quantity-control {
    display: flex;
    align-items: center;
    border: var(--border);
    border-radius: var(--radius-sm);
    overflow: hidden;
}

.quantity-button {
    width: 36px;
    height: 36px;
    color: var(--color-heading);
}

.quantity-button:hover:not(:disabled) {
    background: var(--color-background);
    color: var(--color-primary);
}

.quantity-button:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

.quantity-control input {
    width: 45px;
    height: 36px;
    border: none;
    border-inline: var(--border);
    text-align: center;
    color: var(--color-body);
    background: var(--color-surface);
}

.quantity-control input::-webkit-inner-spin-button,
.quantity-control input::-webkit-outer-spin-button {
    margin: 0;
}

.cart-item-subtotal {
    min-width: 0;
}

.cart-item-subtotal strong {
    color: var(--color-heading);
    font-size: var(--fs-lg);
    white-space: nowrap;
}

.remove-button {
    color: var(--color-secondary);
    font-weight: var(--fw-semibold);
    white-space: nowrap;
}

.remove-button:hover {
    color: var(--color-primary);
    text-decoration: underline;
}


/* ==========================================
   Small Screen
========================================== */

@media (max-width: 600px) {
    .cart-item {
        grid-template-columns: 72px minmax(0, 1fr);
        gap: var(--space-3);
    }

    .cart-item-cover {
        width: 72px;
    }

    .cart-item-quantity,
    .cart-item-subtotal,
    .remove-button {
        grid-column: 1 / -1;
    }

    .cart-item-subtotal {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}


/* ==========================================
   Very Small Screen
========================================== */

@media (max-width: 450px) {
    .cart-item {
        grid-template-columns: 60px minmax(0, 1fr);
        padding: var(--space-4);
    }

    .cart-item-cover {
        width: 60px;
    }
}
</style>