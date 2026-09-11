<script setup>
import { reactive } from "vue";

const props = defineProps({
    loading: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    "submit"
]);

const form = reactive({
    recipientName: "",
    street: "",
    city: "",
    province: "",
    zipCode: "",
    mobileNo: ""
});

const submitForm = () => {
    emit("submit", {
        shippingAddress: {
            recipientName: form.recipientName.trim(),
            street: form.street.trim(),
            city: form.city.trim(),
            province: form.province.trim(),
            zipCode: form.zipCode.trim()
        },
        mobileNo: form.mobileNo.trim()
    });
};
</script>

<template>
    <form
        class="checkout-form surface"
        @submit.prevent="submitForm"
    >

        <h2>
            Shipping Information
        </h2>


        <!-- Recipient -->
        <div class="form-group">
            <label for="recipientName">
                Recipient Name
            </label>

            <input
                id="recipientName"
                v-model="form.recipientName"
                type="text"
                required
                autocomplete="name"
            />
        </div>


        <!-- Mobile -->
        <div class="form-group">
            <label for="mobileNo">
                Mobile Number
            </label>

            <input
                id="mobileNo"
                v-model="form.mobileNo"
                type="tel"
                inputmode="numeric"
                pattern="[0-9]{11}"
                minlength="11"
                maxlength="11"
                required
                placeholder="09123456789"
                autocomplete="tel"
            />

            <small>
                Enter exactly 11 digits.
            </small>
        </div>


        <!-- Street -->
        <div class="form-group">
            <label for="street">
                Street
            </label>

            <input
                id="street"
                v-model="form.street"
                type="text"
                required
                autocomplete="street-address"
            />
        </div>


        <!-- City -->
        <div class="form-group">
            <label for="city">
                City
            </label>

            <input
                id="city"
                v-model="form.city"
                type="text"
                required
                autocomplete="address-level2"
            />
        </div>


        <!-- Province -->
        <div class="form-group">
            <label for="province">
                Province
            </label>

            <input
                id="province"
                v-model="form.province"
                type="text"
                required
                autocomplete="address-level1"
            />
        </div>


        <!-- ZIP -->
        <div class="form-group">
            <label for="zipCode">
                ZIP Code
            </label>

            <input
                id="zipCode"
                v-model="form.zipCode"
                type="text"
                required
                autocomplete="postal-code"
            />
        </div>


        <button
            type="submit"
            class="btn btn-primary w-100"
            :disabled="loading"
        >
            {{ loading ? "Processing..." : "Place Order" }}
        </button>

    </form>
</template>

<style scoped>
.checkout-form {
    padding: var(--space-6);
}

.checkout-form h2 {
    margin-bottom: var(--space-6);
}

.form-group {
    margin-bottom: var(--space-4);
}

.form-group label {
    display: block;
    margin-bottom: var(--space-2);
    color: var(--color-heading);
    font-weight: var(--fw-semibold);
}

.form-group input {
    width: 100%;
    padding: var(--space-3);
    border: var(--border);
    border-radius: var(--radius-sm);
    background: var(--color-surface);
    color: var(--color-body);
}

.form-group input:focus {
    border-color: var(--color-primary);
}

.form-group small {
    display: block;
    margin-top: var(--space-1);
}
</style>