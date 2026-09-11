<script setup>
import { computed, ref, watch } from "vue";

import bookFormatService from "@/services/bookFormatService";
import { getApiError } from "@/utils/apiError";

import DynamicForm from "@/components/forms/DynamicForm.vue";


/* ==========================================
   Props
========================================== */

const props = defineProps({
    format: {
        type: Object,
        required: true
    }
});


/* ==========================================
   Emits
========================================== */

const emit = defineEmits(["updated", "back"]);


/* ==========================================
   Form State
========================================== */

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


    /*
     * Ebook-specific fields
     */
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

    }


    /*
     * Physical format fields
     */
    else if (
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


    /*
     * SKU is required for all formats
     */
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
   Initialize Form
========================================== */

const initializeForm = () => {

    form.value = {
        type: props.format.type || "",

        price:
            props.format.price ??
            "",

        salePrice:
            props.format.salePrice ??
            "",

        stock:
            props.format.stock ??
            "",

        fileType:
            props.format.fileType ||
            "",

        fileUrl:
            props.format.fileUrl ||
            "",

        sku:
            props.format.sku ||
            ""
    };

};


initializeForm();



/* ==========================================
   Watch Format Type
========================================== */

watch(
    () => form.value.type,
    (newType) => {

        if (newType === "ebook") {

            form.value.stock = "";

        }

        else if (
            newType === "paperback" ||
            newType === "hardbound"
        ) {

            form.value.fileType = "";
            form.value.fileUrl = "";

        }

    }
);



/* ==========================================
   Update Format
========================================== */

const updateFormat = async (formData) => {

    isSaving.value = true;

    formError.value = "";
    formSuccess.value = "";


    try {

        const payload = {
            ...formData
        };


        /*
         * Ebook formats do not use stock.
         */
        if (payload.type === "ebook") {

            delete payload.stock;

        }


        /*
         * Physical formats do not use
         * ebook-specific fields.
         */
        else {

            delete payload.fileType;
            delete payload.fileUrl;

        }


        await bookFormatService.updateBookFormat(
            props.format._id,
            payload
        );


        formSuccess.value =
            "Book format updated successfully.";


        /*
         * Tell the inventory page that
         * the format was successfully updated.
         */
        setTimeout(() => {

            emit("updated");

        }, 700);


    } catch (error) {

        const err = getApiError(error);

        formError.value = err.message;

    } finally {

        isSaving.value = false;

    }

};



/* ==========================================
   Cancel
========================================== */

const cancelForm = () => {

    emit("back");

};

</script>


<template>

    <section class="book-inventory-format-edit section-sm">

        <div class="container">


            <!-- ==========================================
                 Section Heading
            =========================================== -->

            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Inventory
                </p>

                <h2 class="section-title">
                    Edit Format
                </h2>

                <p class="section-subtitle">

                    Update the
                    {{ props.format.type }}
                    format for this book.

                </p>

            </div>



            <!-- ==========================================
                 Book Information
            =========================================== -->

            <div class="surface p-4 mb-4">

                <p class="section-label text-uppercase">
                    Book
                </p>

                <h3 class="section-title">

                    {{ props.format.bookId?.title || "Book" }}

                </h3>

            </div>



            <!-- ==========================================
                 Form
            =========================================== -->

            <div class="surface p-4">


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
                    submit-text="Save Changes"
                    :loading="isSaving"
                    @submit="updateFormat"
                />



                <!-- Cancel -->

                <button
                    type="button"
                    class="btn btn-outline mt-3"
                    :disabled="isSaving"
                    @click="cancelForm"
                >
                    Cancel
                </button>

            </div>

        </div>

    </section>

</template>


<style scoped>

.book-inventory-format-edit {
    margin-top: var(--space-7);
}

</style>