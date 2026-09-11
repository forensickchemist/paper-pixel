<script setup>
import { computed, ref } from "vue";
import cartService from "@/services/cartService";
import { getApiError } from "@/utils/apiError";

const props = defineProps({
    book: {
        type: Object,
        required: true
    }
});

const selectedFormatId = ref("");
const quantity = ref(1);

const isAdding = ref(false);
const successMessage = ref("");
const apiError = ref("");

const formats = computed(() => {
    return (props.book.formats || []).filter(
        (format) => format.isActive
    );
});

const selectedFormat = computed(() => {
    return formats.value.find(
        (format) => format._id === selectedFormatId.value
    );
});

const effectivePrice = computed(() => {
    if (!selectedFormat.value) {
        return 0;
    }

    return selectedFormat.value.salePrice ??
        selectedFormat.value.price;
});

const isEbook = computed(() => {
    return selectedFormat.value?.type === "ebook";
});

const stock = computed(() => {
    if (isEbook.value) {
        return null;
    }

    return selectedFormat.value?.stock ?? 0;
});

const hasStock = computed(() => {
    if (!selectedFormat.value) {
        return false;
    }

    if (isEbook.value) {
        return true;
    }

    return stock.value > 0;
});

const formatLabel = (format) => {
    const labels = {
        ebook: "Ebook",
        paperback: "Paperback",
        hardbound: "Hardbound"
    };

    return labels[format.type] || format.type;
};

const formatPrice = (price) => {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP"
    }).format(price);
};

const addToCart = async () => {
    successMessage.value = "";
    apiError.value = "";

    if (!selectedFormatId.value) {
        apiError.value = "Please select a book format.";
        return;
    }

    if (!hasStock.value) {
        apiError.value = "This format is currently out of stock.";
        return;
    }

    if (quantity.value < 1) {
        apiError.value = "Quantity must be at least 1.";
        return;
    }

    if (
        !isEbook.value &&
        quantity.value > stock.value
    ) {
        apiError.value = `Only ${stock.value} item(s) available.`;
        return;
    }

    isAdding.value = true;

    try {
        await cartService.addToCart(
            selectedFormatId.value,
            quantity.value
        );

        successMessage.value = "Added to cart successfully.";
        quantity.value = 1;
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    } finally {
        isAdding.value = false;
    }
};
</script>

<template>
    <div class="add-to-cart surface">
        <div class="section-label">
            Choose Format
        </div>

        <div
            v-if="formats.length"
            class="format-options"
        >
            <label
                v-for="format in formats"
                :key="format._id"
                class="format-option"
                :class="{
                    selected:
                        selectedFormatId === format._id,
                    disabled:
                        format.type !== 'ebook' &&
                        format.stock <= 0
                }"
            >
                <input
                    v-model="selectedFormatId"
                    type="radio"
                    name="book-format"
                    :value="format._id"
                    :disabled="
                        format.type !== 'ebook' &&
                        format.stock <= 0
                    "
                />

                <span class="format-option-content">
                    <span class="format-name">
                        {{ formatLabel(format) }}
                    </span>

                    <span class="format-price">
                        <template v-if="format.salePrice != null">
                            <span class="original-price">
                                {{ formatPrice(format.price) }}
                            </span>

                            {{ formatPrice(format.salePrice) }}
                        </template>

                        <template v-else>
                            {{ formatPrice(format.price) }}
                        </template>
                    </span>

                    <span
                        v-if="format.type === 'ebook'"
                        class="format-stock"
                    >
                        Available
                    </span>

                    <span
                        v-else-if="format.stock > 0"
                        class="format-stock"
                    >
                        {{ format.stock }} available
                    </span>

                    <span
                        v-else
                        class="format-stock unavailable"
                    >
                        Out of stock
                    </span>
                </span>
            </label>
        </div>

        <div
            v-else
            class="alert alert-warning"
        >
            No formats are currently available for this book.
        </div>

        <div
            v-if="selectedFormat"
            class="selected-format"
        >
            <div class="selected-format-info">
                <span class="meta-label">
                    Selected:
                </span>

                {{ formatLabel(selectedFormat) }}
            </div>

            <div
                v-if="selectedFormat.salePrice != null"
                class="selected-price"
            >
                {{ formatPrice(effectivePrice) }}
            </div>

            <div
                v-else
                class="selected-price"
            >
                {{ formatPrice(effectivePrice) }}
            </div>
        </div>

        <div
            v-if="selectedFormat && !isEbook"
            class="quantity-field"
        >
            <label for="quantity">
                Quantity
            </label>

            <input
                id="quantity"
                v-model.number="quantity"
                type="number"
                min="1"
                :max="stock"
                :disabled="!hasStock"
            />
        </div>

        <div
            v-if="apiError"
            class="alert alert-danger mt-3"
            role="alert"
        >
            {{ apiError }}
        </div>

        <div
            v-if="successMessage"
            class="alert alert-success mt-3"
            role="alert"
        >
            {{ successMessage }}
        </div>

        <button
            type="button"
            class="btn btn-primary w-100 mt-3"
            :disabled="
                isAdding ||
                !selectedFormat ||
                !hasStock
            "
            @click="addToCart"
        >
            <span
                v-if="isAdding"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
            ></span>

            {{ isAdding ? "Adding..." : "Add to Cart" }}
        </button>
    </div>
</template>

<style scoped>
.add-to-cart {
    margin-top: var(--space-5);
    padding: var(--space-5);
}

.format-options {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.format-option {
    display: block;
    padding: var(--space-4);
    border: var(--border);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition:
        border-color var(--transition-fast),
        box-shadow var(--transition-fast),
        background-color var(--transition-fast);
}

.format-option:hover:not(.disabled) {
    box-shadow: var(--shadow-sm);
}

.format-option.selected {
    border-color: var(--color-primary);
    background: var(--color-primary-soft);
}

.format-option.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.format-option input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
}

.format-option-content {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: var(--space-1) var(--space-3);
    align-items: center;
}

.format-name {
    color: var(--color-heading);
    font-weight: var(--fw-semibold);
}

.format-price {
    color: var(--color-primary);
    font-weight: var(--fw-semibold);
    text-align: right;
}

.original-price {
    margin-right: var(--space-2);
    color: var(--color-muted);
    text-decoration: line-through;
    font-weight: var(--fw-normal);
}

.format-stock {
    color: var(--color-muted);
    font-size: var(--fs-sm);
}

.format-stock.unavailable {
    color: var(--color-danger);
}

.selected-format {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: var(--space-3);
    margin-top: var(--space-4);
    padding-top: var(--space-4);
    border-top: var(--border);
}

.meta-label {
    color: var(--color-heading);
    font-weight: var(--fw-semibold);
}

.selected-price {
    color: var(--color-primary);
    font-weight: var(--fw-bold);
}

.quantity-field {
    margin-top: var(--space-4);
}

.quantity-field label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--color-heading);
    font-weight: var(--fw-medium);
}

.quantity-field input {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    border: var(--border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-body);
}

@media (max-width: 575.98px) {
    .add-to-cart {
        padding: var(--space-4);
    }

    .format-option-content {
        grid-template-columns: 1fr;
    }

    .format-price {
        text-align: left;
    }

    .selected-format {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>