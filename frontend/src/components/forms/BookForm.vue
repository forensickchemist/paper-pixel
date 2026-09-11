<script setup>
import { computed, onMounted, ref } from "vue";

import bookService from "@/services/bookService";
import authorService from "@/services/authorService";
import categoryService from "@/services/categoryService";
import { getApiError } from "@/utils/apiError";

import DynamicForm from "@/components/forms/DynamicForm.vue";


/* ==========================================
   Emits
========================================== */

const emit = defineEmits(["created"]);


/* ==========================================
   Authors & Categories
========================================== */

const authors = ref([]);
const categories = ref([]);

const isLoadingOptions = ref(false);
const optionsError = ref("");



/* ==========================================
   Form State
========================================== */

const formValues = ref({
    title: "",
    description: "",
    publicationDate: "",
    authors: [],
    categories: [],
    coverImage: null
});



/* ==========================================
   Create State
========================================== */

const isCreating = ref(false);

const formError = ref("");
const formSuccess = ref("");



/* ==========================================
   Get Authors
========================================== */

const getAuthors = async () => {
    const response = await authorService.getAuthors();

    authors.value = response.data.authors || [];
};



/* ==========================================
   Get Categories
========================================== */

const getCategories = async () => {
    const response = await categoryService.getCategories();

    categories.value = response.data.categories || [];
};



/* ==========================================
   Form Options
========================================== */

const authorOptions = computed(() => {
    return authors.value.map((author) => ({
        value: author._id,
        label: `${author.firstName} ${author.lastName}`
    }));
});


const categoryOptions = computed(() => {
    return categories.value.map((category) => ({
        value: category._id,
        label: category.name
    }));
});



/* ==========================================
   Book Fields
========================================== */

const bookFields = computed(() => [
    {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Enter book title",
        required: true
    },

    {
        name: "authors",
        label: "Authors",
        type: "select",
        placeholder: "Select authors",
        required: true,
        multiple: true,
        options: authorOptions.value
    },

    {
        name: "description",
        label: "Description",
        type: "textarea",
        placeholder: "Enter book description",
        rows: 5,
        required: true
    },

    {
        name: "publicationDate",
        label: "Publication Date",
        type: "date",
        required: true
    },

    {
        name: "categories",
        label: "Categories",
        type: "select",
        placeholder: "Select categories",
        multiple: true,
        options: categoryOptions.value
    },

    {
        name: "coverImage",
        label: "Cover Image",
        type: "file",
        accept: "image/jpeg,image/png,image/webp",
        required: false,
        help: "Accepted formats: JPG, PNG, and WEBP."
    }
]);



/* ==========================================
   Create Book
========================================== */

const createBook = async (formData) => {
    isCreating.value = true;

    formError.value = "";
    formSuccess.value = "";

    try {
        await bookService.createBook(formData);

        formSuccess.value = "Book created successfully.";

        /*
         * Give the success message a moment to display
         * before returning to book management.
         */
        setTimeout(() => {
            emit("created");
        }, 700);

    } catch (error) {
        const err = getApiError(error);

        formError.value = err.message;
    } finally {
        isCreating.value = false;
    }
};



/* ==========================================
   Cancel
========================================== */

const cancelForm = () => {
    emit("created");
};



/* ==========================================
   Initialization
========================================== */

onMounted(async () => {
    isLoadingOptions.value = true;
    optionsError.value = "";

    try {
        await Promise.all([
            getAuthors(),
            getCategories()
        ]);
    } catch (error) {
        const err = getApiError(error);

        optionsError.value = err.message;
    } finally {
        isLoadingOptions.value = false;
    }
});
</script>


<template>
    <section class="book-form section-sm">

        <div class="container">

            <!-- ==========================================
                 Section Heading
            =========================================== -->

            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Add Book
                </h2>

                <p class="section-subtitle">
                    Add a new book to your bookstore inventory.
                </p>

            </div>



            <!-- ==========================================
                 Options Loading
            =========================================== -->

            <div
                v-if="isLoadingOptions"
                class="text-center py-5"
            >

                <div
                    class="spinner-border"
                    role="status"
                >
                    <span class="visually-hidden">
                        Loading...
                    </span>
                </div>

                <p class="mt-3 mb-0">
                    Loading authors and categories...
                </p>

            </div>



            <!-- ==========================================
                 Options Error
            =========================================== -->

            <div
                v-else-if="optionsError"
                class="alert alert-danger"
                role="alert"
            >
                {{ optionsError }}
            </div>



            <!-- ==========================================
                 Book Form
            =========================================== -->

            <div
                v-else
                class="surface p-4"
            >

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
                    :fields="bookFields"
                    :initial-values="formValues"
                    :multipart="true"
                    submit-text="Create Book"
                    :loading="isCreating"
                    @submit="createBook"
                />



                <!-- Cancel -->

                <button
                    type="button"
                    class="btn btn-outline mt-3"
                    :disabled="isCreating"
                    @click="cancelForm"
                >
                    Cancel
                </button>

            </div>

        </div>

    </section>
</template>
