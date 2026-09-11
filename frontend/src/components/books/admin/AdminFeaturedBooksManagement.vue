<script setup>
import { computed, onMounted, ref } from "vue";

import bookService from "@/services/bookService";
import { getApiError } from "@/utils/apiError";

import DynamicTable from "@/components/tables/DynamicTable.vue";
import DynamicForm from "@/components/forms/DynamicForm.vue";

const emit = defineEmits(["back"]);

/* ==========================================
   Books
========================================== */
const books = ref([]);
const isLoading = ref(false);
const apiError = ref("");

/* ==========================================
   Schedule State
========================================== */
const selectedBookIds = ref([]);
const featuredFrom = ref("");
const featuredUntil = ref("");
const editingBook = ref(null);

/* ==========================================
   Save State
========================================== */
const isSaving = ref(false);
const saveError = ref("");
const saveSuccess = ref("");

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
   Book Options
========================================== */
const bookOptions = computed(() => {
    return books.value.map((book) => ({
        value: book._id,
        label: book.title
    }));
});

/* ==========================================
   Scheduled Books
========================================== */
const scheduledBooks = computed(() => {
    return books.value.filter((book) => {
        return (
            book.featuredFrom &&
            book.featuredUntil
        );
    });
});

/* ==========================================
   Form Initial Values
========================================== */
const formInitialValues = computed(() => ({
    books: selectedBookIds.value,
    featuredFrom: featuredFrom.value,
    featuredUntil: featuredUntil.value
}));

/* ==========================================
   Schedule Featured Books
========================================== */
const scheduleFeaturedBooks = async (formValues) => {
    saveError.value = "";
    saveSuccess.value = "";

    /*
     * When creating a schedule, books is an array.
     *
     * When editing a schedule, DynamicForm uses
     * a single-select and books becomes a string.
     *
     * Normalize both cases into an array.
     */
    const bookIds = Array.isArray(formValues.books)
        ? formValues.books
        : formValues.books
            ? [formValues.books]
            : [];

    const startDate = formValues.featuredFrom;
    const endDate = formValues.featuredUntil;

    /* ==========================================
       Validate Books
    ========================================== */
    if (!bookIds.length) {
        saveError.value =
            "Please select at least one book.";

        return;
    }

    /* ==========================================
       Validate Dates
    ========================================== */
    if (!startDate || !endDate) {
        saveError.value =
            "Please provide both the featured start and end dates.";

        return;
    }

    if (endDate < startDate) {
        saveError.value =
            "Featured end date must be after the featured start date.";

        return;
    }

    /* ==========================================
       Save
    ========================================== */
    isSaving.value = true;

    try {
        await Promise.all(
            bookIds.map((bookId) =>
                bookService.updateBook(
                    bookId,
                    {
                        featuredFrom: startDate,
                        featuredUntil: endDate
                    }
                )
            )
        );

        saveSuccess.value =
            `${bookIds.length} book${bookIds.length > 1 ? "s" : ""} scheduled successfully.`;

        /* ==========================================
           Reset Form
        ========================================== */
        selectedBookIds.value = [];
        featuredFrom.value = "";
        featuredUntil.value = "";
        editingBook.value = null;

        /* ==========================================
           Refresh Books
        ========================================== */
        await getBooks();

    } catch (error) {
        const err = getApiError(error);

        saveError.value = err.message;
    } finally {
        isSaving.value = false;
    }
};

/* ==========================================
   Edit Schedule
========================================== */
const editSchedule = (book) => {
    editingBook.value = book;

    selectedBookIds.value = [
        book._id
    ];

    featuredFrom.value =
        book.featuredFrom
            ? book.featuredFrom.split("T")[0]
            : "";

    featuredUntil.value =
        book.featuredUntil
            ? book.featuredUntil.split("T")[0]
            : "";

    saveError.value = "";
    saveSuccess.value = "";
};

/* ==========================================
   Remove Featured Schedule
========================================== */
const removeFeaturedSchedule = async (book) => {
    saveError.value = "";
    saveSuccess.value = "";

    const confirmed = window.confirm(
        `Remove "${book.title}" from the featured schedule?`
    );

    if (!confirmed) {
        return;
    }

    isSaving.value = true;

    try {
        await bookService.updateBook(
            book._id,
            {
                featuredFrom: null,
                featuredUntil: null
            }
        );

        saveSuccess.value =
            `"${book.title}" was removed from the featured schedule.`;

        if (
            editingBook.value?._id ===
            book._id
        ) {
            cancelEdit();
        }

        await getBooks();

    } catch (error) {
        const err = getApiError(error);

        saveError.value = err.message;
    } finally {
        isSaving.value = false;
    }
};

/* ==========================================
   Cancel Edit
========================================== */
const cancelEdit = () => {
    editingBook.value = null;
    selectedBookIds.value = [];
    featuredFrom.value = "";
    featuredUntil.value = "";
    saveError.value = "";
};

/* ==========================================
   Initialization
========================================== */
onMounted(() => {
    getBooks();
});
</script>

<template>
    <section class="featured-books-management section-sm">

        <div class="container">

            <!-- ==========================================
                 Section Heading
            =========================================== -->
            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Featured Books
                </h2>

                <p class="section-subtitle">
                    Schedule which books appear in the featured
                    section of the bookstore homepage.
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
                 Schedule Form
            =========================================== -->
            <div class="surface p-4 mb-5">

                <div class="section-heading mb-4">

                    <p class="section-label text-uppercase">
                        {{
                            editingBook
                                ? "Edit Schedule"
                                : "Schedule Books"
                        }}
                    </p>

                    <h3 class="section-title">
                        {{
                            editingBook
                                ? editingBook.title
                                : "Create Featured Schedule"
                        }}
                    </h3>

                    <p class="section-subtitle">
                        {{
                            editingBook
                                ? "Update the featured dates for this book."
                                : "Select the books and date range for a featured period."
                        }}
                    </p>

                </div>


                <!-- Save Error -->
                <div
                    v-if="saveError"
                    class="alert alert-danger"
                    role="alert"
                >
                    {{ saveError }}
                </div>


                <!-- Save Success -->
                <div
                    v-if="saveSuccess"
                    class="alert alert-success"
                    role="alert"
                >
                    {{ saveSuccess }}
                </div>


                <!-- Dynamic Form -->
                <DynamicForm
                    :key="
                        editingBook
                            ? editingBook._id
                            : 'new-schedule'
                    "
                    :fields="[
                        {
                            name: 'books',
                            label: 'Books',
                            type: 'select',
                            multiple: !editingBook,
                            required: true,
                            options: bookOptions,
                            placeholder: 'Select books'
                        },
                        {
                            name: 'featuredFrom',
                            label: 'Featured From',
                            type: 'date',
                            required: true
                        },
                        {
                            name: 'featuredUntil',
                            label: 'Featured Until',
                            type: 'date',
                            required: true
                        }
                    ]"
                    :initial-values="formInitialValues"
                    :submit-text="
                        editingBook
                            ? 'Save Changes'
                            : 'Schedule Featured Books'
                    "
                    :loading="isSaving"
                    @submit="scheduleFeaturedBooks"
                />


                <!-- Cancel Edit -->
                <button
                    v-if="editingBook"
                    type="button"
                    class="btn btn-outline mt-3"
                    :disabled="isSaving"
                    @click="cancelEdit"
                >
                    Cancel Edit
                </button>

            </div>


            <!-- ==========================================
                 Scheduled Books Heading
            =========================================== -->
            <div class="section-heading mb-4">

                <p class="section-label text-uppercase">
                    Current Schedule
                </p>

                <h3 class="section-title">
                    Scheduled Featured Books
                </h3>

                <p class="section-subtitle">
                    View and manage books that have a featured
                    period assigned.
                </p>

            </div>


            <!-- ==========================================
                 Scheduled Books Table
            =========================================== -->
            <DynamicTable
                :columns="[
                    {
                        key: 'title',
                        label: 'Book'
                    },
                    {
                        key: 'featuredFrom',
                        label: 'Featured From'
                    },
                    {
                        key: 'featuredUntil',
                        label: 'Featured Until'
                    }
                ]"
                :items="scheduledBooks"
                :loading="isLoading || isSaving"
                :show-edit="true"
                :show-toggle="false"
                :show-manage-formats="false"
                :show-remove="true"
                empty-message="There are currently no books scheduled as featured."
                @edit="editSchedule"
                @remove="removeFeaturedSchedule"
            >

                <!-- ==========================================
                     Book Column
                =========================================== -->
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

                            <h3 class="book-title mb-1">
                                {{ item.title }}
                            </h3>

                            <p
                                v-if="item.authors?.length"
                                class="book-description mb-0"
                            >
                                {{
                                    item.authors
                                        .map(
                                            (author) =>
                                                `${author.firstName} ${author.lastName}`
                                        )
                                        .join(", ")
                                }}
                            </p>

                        </div>

                    </div>

                </template>


                <!-- ==========================================
                     Featured From
                =========================================== -->
                <template #cell-featuredFrom="{ item }">

                    {{
                        item.featuredFrom
                            ? new Date(
                                item.featuredFrom
                            ).toLocaleDateString()
                            : "—"
                    }}

                </template>


                <!-- ==========================================
                     Featured Until
                =========================================== -->
                <template #cell-featuredUntil="{ item }">

                    {{
                        item.featuredUntil
                            ? new Date(
                                item.featuredUntil
                            ).toLocaleDateString()
                            : "—"
                    }}

                </template>

            </DynamicTable>


            <!-- ==========================================
                 Back to Dashboard
            =========================================== -->
            <button
                type="button"
                class="btn btn-outline mt-4"
                :disabled="isSaving"
                @click="emit('back')"
            >
                <i
                    class="bi bi-arrow-left"
                    aria-hidden="true"
                ></i>

                Back to Dashboard
            </button>

        </div>

    </section>
</template>


<style scoped>

.featured-books-management {
    padding-top: var(--space-6);
}

.book-info {
    min-width: 300px;

    display: flex;
    align-items: center;

    gap: var(--space-3);
}

.book-description {
    color: var(--color-muted);
}

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