<script setup>
import { onMounted, ref } from 'vue'

import authorService from '@/services/authorService'
import { getApiError } from '@/utils/apiError'

import DynamicTable from '@/components/tables/DynamicTable.vue'
import DynamicForm from '@/components/forms/DynamicForm.vue'


const authors = ref([])
const isLoading = ref(false)
const apiError = ref('')


/* ==========================================
   Author Editing
========================================== */
const selectedAuthor = ref(null)

const editForm = ref({
    firstName: '',
    lastName: '',
    about: ''
})

const isUpdating = ref(false)
const updateError = ref('')
const updateSuccess = ref('')


const editFields = [
    {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        placeholder: 'Enter first name',
        required: true
    },
    {
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        placeholder: 'Enter last name',
        required: true
    },
    {
        name: 'about',
        label: 'About',
        type: 'textarea',
        placeholder: 'Enter information about the author',
        rows: 4
    }
]


/* ==========================================
   Get Authors
========================================== */
const getAuthors = async () => {
    isLoading.value = true
    apiError.value = ''

    try {
        const response = await authorService.getAuthors()

        authors.value = response.data.authors || []
    } catch (error) {
        const err = getApiError(error)
        apiError.value = err.message
    } finally {
        isLoading.value = false
    }
}


/* ==========================================
   Edit Author
========================================== */
const editAuthor = (author) => {
    selectedAuthor.value = author

    updateError.value = ''
    updateSuccess.value = ''

    editForm.value = {
        firstName: author.firstName || '',
        lastName: author.lastName || '',
        about: author.about || ''
    }
}


/* ==========================================
   Update Author
========================================== */
const updateAuthor = async (formData) => {
    if (!selectedAuthor.value) {
        return
    }

    isUpdating.value = true
    updateError.value = ''
    updateSuccess.value = ''

    try {
        await authorService.updateAuthor(
            selectedAuthor.value._id,
            formData
        )

        updateSuccess.value = 'Author updated successfully.'

        await getAuthors()

        selectedAuthor.value = null
    } catch (error) {
        const err = getApiError(error)
        updateError.value = err.message
    } finally {
        isUpdating.value = false
    }
}


/* ==========================================
   Cancel Edit
========================================== */
const cancelEdit = () => {
    selectedAuthor.value = null
    updateError.value = ''
    updateSuccess.value = ''
}


/* ==========================================
   Initialization
========================================== */
onMounted(() => {
    getAuthors()
})
</script>


<template>
    <section class="authors-management section-sm">

        <div class="container">

            <!-- ==========================================
                 Section Heading
            =========================================== -->
            <div class="section-heading">
                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Authors
                </h2>

                <p class="section-subtitle">
                    View and manage the authors available for your books.
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
                 Edit Author
            =========================================== -->
            <div
                v-if="selectedAuthor"
                class="surface p-4"
            >
                <div class="section-heading mb-4">

                    <p class="section-label text-uppercase">
                        Edit Author
                    </p>

                    <h3 class="section-title">
                        {{ selectedAuthor.firstName }}
                        {{ selectedAuthor.lastName }}
                    </h3>

                    <p class="section-subtitle">
                        Update the information for this author.
                    </p>

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
                    :fields="editFields"
                    :initial-values="editForm"
                    submit-text="Save Changes"
                    :loading="isUpdating"
                    @submit="updateAuthor"
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
                 Authors Table
            =========================================== -->
            <DynamicTable
                v-else
                :columns="[
                    {
                        key: 'firstName',
                        label: 'First Name'
                    },
                    {
                        key: 'lastName',
                        label: 'Last Name'
                    },
                    {
                        key: 'about',
                        label: 'About'
                    }
                ]"
                :items="authors"
                :loading="isLoading"
                empty-message="There are currently no authors."
                @edit="editAuthor"
                :show-edit="true"
            />

        </div>

    </section>
</template>