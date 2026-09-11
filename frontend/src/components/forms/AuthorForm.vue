<script setup>
import { ref } from 'vue'

import authorService from '@/services/authorService'
import { getApiError } from '@/utils/apiError'

import DynamicForm from '@/components/forms/DynamicForm.vue'


const isSubmitting = ref(false)
const apiError = ref('')
const successMessage = ref('')


/* ==========================================
   Author Form Fields
========================================== */
const fields = [
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
   Create Author
========================================== */
const createAuthor = async (formData) => {
    isSubmitting.value = true
    apiError.value = ''
    successMessage.value = ''

    try {
        await authorService.createAuthor(formData)

        successMessage.value = 'Author created successfully.'

        emit('created')
    } catch (error) {
        const err = getApiError(error)
        apiError.value = err.message
    } finally {
        isSubmitting.value = false
    }
}


/* ==========================================
   Events
========================================== */
const emit = defineEmits([
    'created'
])
</script>


<template>
    <section class="author-form section-sm">

        <div class="container">

            <!-- ==========================================
                 Section Heading
            =========================================== -->
            <div class="section-heading">
                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Add Author
                </h2>

                <p class="section-subtitle">
                    Add a new author to your bookstore.
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
                 Success Message
            =========================================== -->
            <div
                v-if="successMessage"
                class="alert alert-success"
                role="alert"
            >
                {{ successMessage }}
            </div>


            <!-- ==========================================
                 Author Form
            =========================================== -->
            <div class="surface p-4">

                <DynamicForm
                    :fields="fields"
                    submit-text="Add Author"
                    :loading="isSubmitting"
                    @submit="createAuthor"
                />

            </div>

        </div>

    </section>
</template>