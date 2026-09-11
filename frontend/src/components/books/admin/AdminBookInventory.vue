<script setup>
import { onMounted, ref } from "vue";

import bookFormatService from "@/services/bookFormatService";
import { getApiError } from "@/utils/apiError";

import DynamicTable from "@/components/tables/DynamicTable.vue";


/* ==========================================
   Emits
========================================== */
const emit = defineEmits([
    "edit",
    "toggle"
]);


/* ==========================================
   Inventory
========================================== */
const inventory = ref([]);
const isLoading = ref(false);
const apiError = ref("");

/* ==========================================
   Get Inventory
========================================== */
const getInventory = async () => {
    isLoading.value = true;
    apiError.value = "";
    try {
        const response =
            await bookFormatService.getAllBookFormats();
        inventory.value =
            response.data.bookFormats || [];
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    } finally {
        isLoading.value = false;
    }
};

/* ==========================================
   Toggle Format Availability
========================================== */
const toggleFormat = async (format) => {
    apiError.value = "";
    try {
        if (format.isActive) {
            await bookFormatService.deactivateBookFormat(
                format._id
            );
        } else {
            await bookFormatService.activateBookFormat(
                format._id
            );
        }
        await getInventory();
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    }
};

/* ==========================================
   Edit Format
========================================== */
const editFormat = (format) => {
    emit("edit", format);
};



/* ==========================================
   Initialization
========================================== */
onMounted(() => {
    getInventory();
});
</script>


<template>
    <section class="book-inventory section-sm">
        <div class="container">
            <!-- ==========================================
                 Section Heading
            =========================================== -->
            <div class="section-heading">
                <p class="section-label text-uppercase">
                    Inventory
                </p>

                <h2 class="section-title">
                    Book Inventory
                </h2>

                <p class="section-subtitle">
                    View prices, availability, and stock
                    levels for all book formats.
                </p>
            </div>

            <!-- ==========================================
                 API Error
            =========================================== -->

            <div
                v-if="apiError"
                class="alert alert-danger"
                role="alert"
            >
                {{ apiError }}
            </div>

            <!-- ==========================================
                 Inventory Table
            =========================================== -->

            <DynamicTable
                :columns="[
                    {
                        key: 'book',
                        label: 'Book'
                    },
                    {
                        key: 'price',
                        label: 'Price'
                    },
                    {
                        key: 'availability',
                        label: 'Availability'
                    },
                    {
                        key: 'stock',
                        label: 'Stocks'
                    }
                ]"
                :items="inventory"
                :loading="isLoading"
                :show-edit="true"
                :show-toggle="true"
                empty-message="There are currently no book formats in your inventory."
                @edit="editFormat"
                @toggle="toggleFormat"
            >


                <!-- ==========================================
                     Book / Format
                =========================================== -->

                <template #cell-book="{ item }">

                    <div class="book-info">

                        <div class="book-thumbnail">

                            <img
                                v-if="item.bookId?.coverImage?.url"
                                :src="item.bookId.coverImage.url"
                                :alt="item.bookId.title"
                            />

                            <i
                                v-else
                                class="bi bi-book"
                                aria-hidden="true"
                            ></i>

                        </div>


                        <div>

                            <h3 class="book-title">
                                {{ item.bookId?.title || "—" }}
                            </h3>

                            <span class="format-badge">
                                {{ item.type }}
                            </span>

                        </div>

                    </div>

                </template>



                <!-- ==========================================
                     Price
                =========================================== -->

                <template #cell-price="{ item }">

                    <div>

                        <div>
                            ₱{{ Number(item.price).toFixed(2) }}
                        </div>

                        <small
                            v-if="item.salePrice !== undefined && item.salePrice !== null"
                            class="text-muted"
                        >
                            Sale: ₱{{ Number(item.salePrice).toFixed(2) }}
                        </small>

                    </div>

                </template>



                <!-- ==========================================
                     Availability
                =========================================== -->

                <template #cell-availability="{ item }">

                    <span
                        class="availability-badge"
                        :class="
                            item.isActive
                                ? 'available'
                                : 'unavailable'
                        "
                    >
                        {{
                            item.isActive
                                ? "Available"
                                : "Unavailable"
                        }}
                    </span>

                </template>



                <!-- ==========================================
                     Stocks
                =========================================== -->

                <template #cell-stock="{ item }">

                    <span v-if="item.type === 'ebook'">
                        —
                    </span>

                    <span v-else>
                        {{ item.stock ?? 0 }}
                    </span>

                </template>


            </DynamicTable>

        </div>

    </section>

</template>


<style scoped>
/* ==========================================
   Book Information
========================================== */

.book-info {
    min-width: 300px;

    display: flex;
    align-items: center;
    gap: var(--space-3);
}


.book-title {
    margin-bottom: var(--space-1);
    font-size: var(--fs-md);
}



/* ==========================================
   Book Thumbnail
========================================== */

.book-thumbnail {
    width: 48px;
    height: 64px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background-color: var(--color-light-background);
    border-radius: var(--radius-sm);

    color: var(--color-secondary);
    font-size: var(--fs-lg);
}


.book-thumbnail img {
    width: 100%;
    height: 100%;

    object-fit: cover;
}


/* ==========================================
   Availability Badge
========================================== */

.availability-badge {
    display: inline-block;

    padding: 0.35rem 0.7rem;

    border-radius: var(--radius-sm);

    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
}


.availability-badge.available {
    color: var(--color-success);
}


.availability-badge.unavailable {
    color: var(--color-danger);
}

</style>