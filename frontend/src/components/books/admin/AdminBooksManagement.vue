<script setup>
import { onMounted, ref } from "vue";

import bookService from "@/services/bookService";
import authorService from "@/services/authorService";
import categoryService from "@/services/categoryService";
import { getApiError } from "@/utils/apiError";

import DynamicTable from "@/components/tables/DynamicTable.vue";
import DynamicForm from "@/components/forms/DynamicForm.vue";
import BookForm from "@/components/forms/BookForm.vue";
import AdminBookFormatsManagement from "@/components/books/admin/AdminBookFormatsManagement.vue";


/* ==========================================
   Books
========================================== */

const books = ref([]);
const isLoading = ref(false);
const apiError = ref("");



/* ==========================================
   Authors & Categories
========================================== */

const authors = ref([]);
const categories = ref([]);



/* ==========================================
   Book Creation
========================================== */

const isAddingBook = ref(false);



/* ==========================================
   Book Editing
========================================== */

const selectedBook = ref(null);

const editForm = ref({
    title: "",
    description: "",
    publicationDate: "",
    authors: [],
    categories: [],
    coverImage: null
});

const isUpdating = ref(false);
const updateError = ref("");
const updateSuccess = ref("");



/* ==========================================
   Book Formats
========================================== */

const selectedBookForFormats = ref(null);



/* ==========================================
   Get Books
========================================== */

const getBooks = async () => {
    isLoading.value = true;
    apiError.value = "";

    try {
        const response = await bookService.getBooks();

        books.value = response.data.books || [];
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    } finally {
        isLoading.value = false;
    }
};



/* ==========================================
   Get Authors
========================================== */

const getAuthors = async () => {
    try {
        const response = await authorService.getAuthors();

        authors.value = response.data.authors || [];
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    }
};



/* ==========================================
   Get Categories
========================================== */

const getCategories = async () => {
    try {
        const response = await categoryService.getCategories();

        categories.value = response.data.categories || [];
    } catch (error) {
        const err = getApiError(error);
        apiError.value = err.message;
    }
};



/* ==========================================
   Form Options
========================================== */

const authorOptions = () => {
    return authors.value.map((author) => ({
        value: author._id,
        label: `${author.firstName} ${author.lastName}`,
    }));
};


const categoryOptions = () => {
    return categories.value.map((category) => ({
        value: category._id,
        label: category.name,
    }));
};



/* ==========================================
   Add Book
========================================== */

const addBook = () => {
    selectedBook.value = null;
    selectedBookForFormats.value = null;

    apiError.value = "";
    isAddingBook.value = true;
};


const handleBookCreated = async () => {
    isAddingBook.value = false;

    await getBooks();
};


const cancelAddBook = () => {
    isAddingBook.value = false;
};



/* ==========================================
   Edit Book
========================================== */

const editBook = (book) => {
    isAddingBook.value = false;

    selectedBook.value = book;

    selectedBookForFormats.value = null;

    updateError.value = "";
    updateSuccess.value = "";

    editForm.value = {
        title: book.title || "",
        description: book.description || "",
        publicationDate: book.publicationDate
            ? book.publicationDate.split("T")[0]
            : "",
        authors: book.authors
            ? book.authors.map((author) => author._id)
            : [],
        categories: book.categories
            ? book.categories.map((category) => category._id)
            : [],
        coverImage: null
    };
};



/* ==========================================
   Update Book
========================================== */

const updateBook = async (formData) => {
    if (!selectedBook.value) {
        return;
    }

    isUpdating.value = true;
    updateError.value = "";
    updateSuccess.value = "";

    try {
        await bookService.updateBook(
            selectedBook.value._id,
            formData
        );

        updateSuccess.value = "Book updated successfully.";

        await getBooks();

        selectedBook.value = null;

    } catch (error) {
        const err = getApiError(error);

        updateError.value = err.message;

    } finally {
        isUpdating.value = false;
    }
};



/* ==========================================
   Cancel Edit
========================================== */

const cancelEdit = () => {
    selectedBook.value = null;

    updateError.value = "";
    updateSuccess.value = "";
};



/* ==========================================
   Manage Book Formats
========================================== */

const manageFormats = (book) => {
    isAddingBook.value = false;

    selectedBook.value = null;

    selectedBookForFormats.value = book;
};


const closeFormats = () => {
    selectedBookForFormats.value = null;
};



/* ==========================================
   Initialization
========================================== */

onMounted(() => {
    getBooks();
    getAuthors();
    getCategories();
});
</script>


<template>
    <section class="books-management section-sm">

        <div class="container">


            <!-- ==========================================
                 Section Heading
            =========================================== -->

            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Books
                </h2>

                <p class="section-subtitle">
                    View and manage all books in your bookstore.
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
                 Add Book
            =========================================== -->

            <BookForm
                v-if="isAddingBook"
                :authors="authors"
                :categories="categories"
                @created="handleBookCreated"
                @cancel="cancelAddBook"
            />



            <!-- ==========================================
                    Edit Book
            =========================================== -->

                <div v-if="selectedBook" class="surface p-4">

                    <div class="section-heading mb-4">

                        <p class="section-label text-uppercase">
                            Edit Book
                        </p>

                        <h3 class="section-title">
                            {{ selectedBook.title }}
                        </h3>

                        <p class="section-subtitle">
                            Update the information for this book.
                        </p>

                    </div>


                    <!-- ==========================================
                        Current Cover
                    =========================================== -->

                    <div
                        v-if="selectedBook.coverImage?.url"
                        class="current-cover mb-4"
                    >

                        <p class="form-label">
                            Current Cover
                        </p>

                        <img
                            :src="selectedBook.coverImage.url"
                            :alt="selectedBook.title"
                            class="current-cover-image"
                        />

                    </div>


                    <!-- Update Error -->

                    <div
                        v-if="updateError"
                        class="alert alert-danger"
                        role="alert"
                    >
                        {{ updateError }}
                    </div>


                    <!-- Update Success -->

                    <div
                        v-if="updateSuccess"
                        class="alert alert-success"
                        role="alert"
                    >
                        {{ updateSuccess }}
                    </div>


                    <DynamicForm
                        :fields="[
                            {
                                name: 'title',
                                label: 'Title',
                                type: 'text',
                                placeholder: 'Enter book title',
                                required: true
                            },
                            {
                                name: 'authors',
                                label: 'Authors',
                                type: 'select',
                                required: true,
                                multiple: true,
                                options: authorOptions()
                            },
                            {
                                name: 'description',
                                label: 'Description',
                                type: 'textarea',
                                placeholder: 'Enter book description',
                                rows: 5,
                                required: true
                            },
                            {
                                name: 'publicationDate',
                                label: 'Publication Date',
                                type: 'date',
                                required: true
                            },
                            {
                                name: 'categories',
                                label: 'Categories',
                                type: 'select',
                                required: true,
                                multiple: true,
                                options: categoryOptions()
                            },
                            {
                                name: 'coverImage',
                                label: 'Replace Cover Image',
                                type: 'file',
                                accept: 'image/jpeg,image/png,image/webp',
                                required: false,
                                help: 'Leave empty to keep the current cover image.'
                            }
                        ]"
                        :initial-values="editForm"
                        :multipart="true"
                        submit-text="Save Changes"
                        :loading="isUpdating"
                        @submit="updateBook"
                    />


                    <button
                        type="button"
                        class="btn btn-outline mt-3"
                        :disabled="isUpdating"
                        @click="cancelEdit"
                    >
                        Cancel
                    </button>

                </div>



            <!-- ==========================================
                 Manage Book Formats
            =========================================== -->

            <AdminBookFormatsManagement
                v-else-if="selectedBookForFormats"
                :book="selectedBookForFormats"
                @back="closeFormats"
            />



            <!-- ==========================================
                 Books Table
            =========================================== -->

            <DynamicTable
                v-else
                :columns="[
                    {
                        key: 'title',
                        label: 'Title/Description'
                    },
                    {
                        key: 'authors',
                        label: 'Author'
                    },
                    {
                        key: 'categories',
                        label: 'Categories'
                    },
                    {
                        key: 'publicationDate',
                        label: 'Publication Date'
                    }
                ]"
                :items="books"
                :loading="isLoading"
                :show-manage-formats="true"
                empty-message="There are currently no books in your inventory."
                @edit="editBook"
                @manage-formats="manageFormats"
            >


                <!-- Book -->

                <template #cell-title="{ item }">

                    <div class="book-info">

                        <div class="book-thumbnail">

                            <img
                                v-if="item.coverImage?.url"
                                :src="item.coverImage.url"
                                :alt="item.title"
                            />

                            <i
                                v-else
                                class="bi bi-book"
                                aria-hidden="true"
                            ></i>

                        </div>

                        <div>

                            <h3 class="book-title">
                                {{ item.title }}
                            </h3>

                            <p class="book-description">
                                {{ item.description }}
                            </p>

                        </div>

                    </div>

                </template>



                <!-- Authors -->

                <template #cell-authors="{ item }">

                    <span
                        v-for="(author, index) in item.authors"
                        :key="author._id"
                    >
                        {{ author.firstName }} {{ author.lastName }}

                        <span
                            v-if="index < item.authors.length - 1"
                        >
                            ,
                        </span>

                    </span>

                </template>



                <!-- Categories -->

                <template #cell-categories="{ item }">

                    <div class="book-categories">

                        <span
                            v-for="category in item.categories"
                            :key="category._id"
                            class="category-badge"
                        >
                            {{ category.name }}
                        </span>

                    </div>

                </template>



                <!-- Publication Date -->

                <template #cell-publicationDate="{ item }">

                    {{
                        item.publicationDate
                            ? new Date(
                                item.publicationDate
                            ).toLocaleDateString()
                            : "—"
                    }}

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


.book-description {
    max-width: 350px;
    margin-bottom: 0;

    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    overflow: hidden;
}



/* ==========================================
   Book Thumbnail
========================================== */

.book-thumbnail {
    width: 56px;
    height: 76px;

    flex-shrink: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    overflow: hidden;

    background-color: var(--color-light-background);
    border-radius: var(--radius-sm);

    color: var(--color-secondary);
    font-size: var(--fs-xl);
}


.book-thumbnail img {
    width: 100%;
    height: 100%;

    object-fit: cover;
}
</style>