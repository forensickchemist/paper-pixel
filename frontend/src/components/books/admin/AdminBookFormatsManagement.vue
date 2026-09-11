<script setup>
import { computed, onMounted, ref, watch } from "vue";

import bookFormatService from "@/services/bookFormatService";
import { getApiError } from "@/utils/apiError";

import DynamicTable from "@/components/tables/DynamicTable.vue";
import DynamicForm from "@/components/forms/DynamicForm.vue";


/* ==========================================
   Props
========================================== */

const props = defineProps({
    book: {
        type: Object,
        required: true
    },

    formatToEdit: {
        type: Object,
        default: null
    }
});


/* ==========================================
   Emits
========================================== */

const emit = defineEmits(["back"]);


/* ==========================================
   Book Formats
========================================== */

const bookFormats = ref([]);
const isLoading = ref(false);
const apiError = ref("");

/* ==========================================
   Form State
========================================== */

const selectedFormat = ref(null);
const isAdding = ref(false);

const form = ref({
    type: "",
    price: "",
    salePrice: "",
    stock: "",
    fileType: "",
    fileUrl: "",
    sku: ""
});

const isSaving = ref(false);
const formError = ref("");
const formSuccess = ref("");

/* ==========================================
   Handle Form Field Changes
========================================== */

const handleFieldChange = ({ name, value }) => {
    form.value[name] = value;
};


/* ==========================================
   Format Fields
========================================== */

const formatFields = computed(() => {
    const fields = [
        {
            name: "type",
            label: "Format Type",
            type: "select",
            placeholder: "Select format type",
            required: true,
            options: [
                {
                    value: "ebook",
                    label: "Ebook"
                },
                {
                    value: "paperback",
                    label: "Paperback"
                },
                {
                    value: "hardbound",
                    label: "Hardbound"
                }
            ]
        },
        {
            name: "price",
            label: "Price",
            type: "number",
            placeholder: "Enter regular price",
            required: true
        },
        {
            name: "salePrice",
            label: "Sale Price",
            type: "number",
            placeholder: "Enter sale price"
        }
    ];

    if (form.value.type === "ebook") {
        fields.push(
            {
                name: "fileType",
                label: "File Type",
                type: "select",
                placeholder: "Select file type",
                required: true,
                options: [
                    {
                        value: "pdf",
                        label: "PDF"
                    },
                    {
                        value: "epub",
                        label: "EPUB"
                    }
                ]
            },
            {
                name: "fileUrl",
                label: "File URL",
                type: "text",
                placeholder: "Enter ebook file URL",
                required: true
            }
        );
    } else if (
        form.value.type === "paperback" ||
        form.value.type === "hardbound"
    ) {
        fields.push({
            name: "stock",
            label: "Stock",
            type: "number",
            placeholder: "Enter stock quantity",
            required: true
        });
    }

    fields.push({
        name: "sku",
        label: "SKU",
        type: "text",
        placeholder: "Enter SKU",
        required: true
    });

    return fields;
});

/* ==========================================
   Watch Format Type
========================================== */

watch(
    () => form.value.type,
    (newType) => {
        if (newType === "ebook") {
            form.value.stock = "";
        } else if (
            newType === "paperback" ||
            newType === "hardbound"
        ) {
            form.value.fileType = "";
            form.value.fileUrl = "";
        }
    }
);

/* ==========================================
   Get Book Formats
========================================== */

const getBookFormats = async () => {
    isLoading.value = true;
    apiError.value = "";

    try {
        const response =
            await bookFormatService.getBookFormatsByBook(props.book._id);

        bookFormats.value = response.data.bookFormats || [];
    } catch (error) {
        const err = getApiError(error);

        /*
         * The backend returns 404 when the book
         * has no formats yet.
         */
        if (error.response?.status === 404) {
            bookFormats.value = [];
        } else {
            apiError.value = err.message;
        }
    } finally {
        isLoading.value = false;
    }
};


/* ==========================================
   Add Format
========================================== */

const addFormat = () => {
    selectedFormat.value = null;
    isAdding.value = true;

    form.value = {
        type: "",
        price: "",
        salePrice: "",
        stock: "",
        fileType: "",
        fileUrl: "",
        sku: ""
    };

    formError.value = "";
    formSuccess.value = "";
};



/* ==========================================
   Edit Format
========================================== */

const editFormat = (format) => {
    selectedFormat.value = format;
    isAdding.value = false;

    form.value = {
        type: format.type || "",
        price: format.price ?? "",
        salePrice: format.salePrice ?? "",
        stock: format.stock ?? "",
        fileType: format.fileType || "",
        fileUrl: format.fileUrl || "",
        sku: format.sku || ""
    };

    formError.value = "";
    formSuccess.value = "";
};

/* ==========================================
   Open Format From Inventory
========================================== */

watch(
    () => props.formatToEdit,
    (format) => {
        if (format) {
            editFormat(format);
        }
    },
    { immediate: true }
);

/* ==========================================
   Save Format
========================================== */

const saveFormat = async (formData) => {
    isSaving.value = true;
    formError.value = "";
    formSuccess.value = "";

    try {
        const payload = {
            ...formData
        };

        if (payload.type === "ebook") {
            delete payload.stock;
        } else {
            delete payload.fileType;
            delete payload.fileUrl;
        }

        if (isAdding.value) {
            await bookFormatService.createBookFormat({
                ...payload,
                bookId: props.book._id
            });

            formSuccess.value =
                "Book format created successfully.";
        } else {
            await bookFormatService.updateBookFormat(
                selectedFormat.value._id,
                payload
            );

            formSuccess.value =
                "Book format updated successfully.";
        }

        await getBookFormats();

        selectedFormat.value = null;
        isAdding.value = false;

        form.value = {
            type: "",
            price: "",
            salePrice: "",
            stock: "",
            fileType: "",
            fileUrl: "",
            sku: ""
        };
    } catch (error) {
        const err = getApiError(error);
        formError.value = err.message;
    } finally {
        isSaving.value = false;
    }
};


/* ==========================================
   Activate / Deactivate
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

        await getBookFormats();
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    }
};


/* ==========================================
   Cancel Form
========================================== */

const cancelForm = () => {
    selectedFormat.value = null;
    isAdding.value = false;

    formError.value = "";
    formSuccess.value = "";

    form.value = {
        type: "",
        price: "",
        salePrice: "",
        stock: "",
        fileType: "",
        fileUrl: "",
        sku: ""
    };
};


/* ==========================================
   Back to Books
========================================== */

const goBack = () => {
    emit("back");
};




/* ==========================================
   Initialization
========================================== */

onMounted(() => {
    getBookFormats();
});
</script>


<template>
    <section class="book-formats-management section-sm">

        <div class="container">

            <!-- ==========================================
                 Section Heading
            =========================================== -->

            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Book Formats
                </p>

                <h2 class="section-title">
                    {{ book.title }}
                </h2>

                <p class="section-subtitle">
                    Manage the available formats, pricing,
                    stock, and SKUs for this book.
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
                 Add / Edit Format
            =========================================== -->

            <div
                v-if="isAdding || selectedFormat"
                class="surface p-4 mb-4"
            >

                <div class="section-heading mb-4">

                    <p class="section-label text-uppercase">
                        {{ isAdding ? "Add Format" : "Edit Format" }}
                    </p>

                    <h3 class="section-title">
                        {{
                            isAdding
                                ? "New Book Format"
                                : selectedFormat.type
                        }}
                    </h3>

                    <p class="section-subtitle">
                        {{
                            isAdding
                                ? "Add a new format for this book."
                                : "Update the information for this book format."
                        }}
                    </p>

                </div>


                <!-- Form Error -->

                <div
                    v-if="formError"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ formError }}
                </div>


                <!-- Form Success -->

                <div
                    v-if="formSuccess"
                    class="alert alert-success"
                    role="alert"
                >
                    {{ formSuccess }}
                </div>


                <DynamicForm
                    :fields="formatFields"
                    :initial-values="form"
                    :submit-text="
                        isAdding
                            ? 'Add Format'
                            : 'Save Changes'
                    "
                    :loading="isSaving"
                    @submit="saveFormat"
                    @field-change="handleFieldChange"
                />


                <button
                    type="button"
                    class="btn btn-outline mt-3"
                    :disabled="isSaving"
                    @click="cancelForm"
                >
                    Cancel
                </button>

            </div>


            <!-- ==========================================
                 Format Actions
            =========================================== -->

            <div
                v-if="!isAdding && !selectedFormat"
                class="d-flex justify-content-between align-items-center mb-4"
            >

                <button
                    type="button"
                    class="btn btn-primary"
                    @click="addFormat"
                >
                    <i
                        class="bi bi-plus-lg"
                        aria-hidden="true"
                    ></i>

                    Add Format
                </button>


                <button
                    type="button"
                    class="btn btn-outline"
                    @click="goBack"
                >
                    <i
                        class="bi bi-arrow-left"
                        aria-hidden="true"
                    ></i>

                    Back to Books
                </button>

            </div>


            <!-- ==========================================
                 Book Formats Table
            =========================================== -->

            <DynamicTable
                v-if="!isAdding && !selectedFormat"
                :columns="[
                    {
                        key: 'type',
                        label: 'Format'
                    },
                    {
                        key: 'price',
                        label: 'Price'
                    },
                    {
                        key: 'salePrice',
                        label: 'Sale Price'
                    },
                    {
                        key: 'stock',
                        label: 'Stock'
                    },
                    {
                        key: 'sku',
                        label: 'SKU'
                    },
                    {
                        key: 'isActive',
                        label: 'Status'
                    },
                ]"
                :items="bookFormats"
                :loading="isLoading"
                :show-toggle="true"
                empty-message="There are currently no formats for this book."
                @edit="editFormat"
                @toggle="toggleFormat"
            >

                <!-- ==========================================
                     Format Type
                =========================================== -->

                <template #cell-type="{ item }">
                    <span class="text-capitalize">
                        {{ item.type }}
                    </span>
                </template>


                <!-- ==========================================
                     Price
                =========================================== -->

                <template #cell-price="{ item }">
                    ₱{{ Number(item.price).toFixed(2) }}
                </template>


                <!-- ==========================================
                     Sale Price
                =========================================== -->

                <template #cell-salePrice="{ item }">
                    {{
                        item.salePrice !== undefined &&
                        item.salePrice !== null
                            ? `₱${Number(item.salePrice).toFixed(2)}`
                            : "—"
                    }}
                </template>


                <!-- ==========================================
                     Stock
                =========================================== -->

                <template #cell-stock="{ item }">
                    {{
                        item.type === "ebook"
                            ? "—"
                            : item.stock
                    }}
                </template>


                <!-- ==========================================
                     SKU
                =========================================== -->

                <template #cell-sku="{ item }">
                    {{ item.sku }}
                </template>


                <!-- ==========================================
                     Status
                =========================================== -->

                <template #cell-isActive="{ item }">
                    <span
                        class="status-badge"
                        :class="item.isActive ? 'status-active' : 'status-inactive'"
                    >
                        {{ item.isActive ? "Available" : "Unavailable" }}
                    </span>
                </template>

                <!-- ==========================================
                     Actions
                =========================================== -->
                <template #cell-actions="{ item }">
                    <div class="d-flex gap-2">

                        <!-- Edit -->
                        <button type="button" class="btn btn-sm btn-outline" @click="editFormat(item)"
                        >
                            <i class="bi bi-pencil"></i>
                            Edit
                        </button>

                    </div>

                </template>

            </DynamicTable>

        </div>

    </section>
</template>

<style scoped>
.status-badge {
    display: inline-block;
    padding: 0.35rem 0.65rem;
    border-radius: var(--radius-sm);
    font-size: var(--fs-sm);
    font-weight: var(--fw-semibold);
}

.status-active {
    background-color: var(--color-success-light);
    color: var(--color-success);
}

.status-inactive {
    background-color: var(--color-light-background);
    color: var(--color-secondary);
}
</style>