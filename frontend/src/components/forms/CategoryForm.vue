<script setup>
import { ref } from "vue"
import DynamicForm from "@/components/forms/DynamicForm.vue"
import categoryService from "@/services/categoryService"
import { getApiError } from "@/utils/apiError"

const emit = defineEmits(["created"])

const loading = ref(false)
const error = ref("")
const success = ref("")

const fields = [
    {
        name: 'name',
        label: 'Category Name',
        type: 'text',
        placeholder: 'Enter category name',
        required: true
    },
    {
        name: 'description',
        label: 'Description',
        type: 'textarea',
        placeholder: 'Enter category description',
        rows: 4
    }
]

const handleSubmit = async (formData) => {
    loading.value = true
    error.value = ""
    success.value = ""

    try {
        await categoryService.createCategory(formData)
        success.value = "Category created successfully."
        emit("created")
    } catch (err) {
        const apiError = getApiError(err)
        
        error.value = apiError.message
    } finally {
        loading.value = false
    }
};
</script>

<template>
    <section class="category-form-section section-sm">
        <div class="container">

            <div class="section-heading">
                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Add Category
                </h2>

                <p class="section-subtitle">
                    Add a new category to your bookstore.
                </p>
            </div>

            <!-- API Error --> 
            <div v-if="error" class="alert alert-danger" role="alert" > 
                {{ error }} 
            </div> 
            
            <!-- Success --> 
            <div v-if="success" class="alert alert-success" role="alert" > 
                {{ success }} 
            </div>

            <div class="surface p-4">
                <DynamicForm
                    :fields="fields"
                    submit-text="Add Category"
                    :loading="loading"
                    @submit="handleSubmit"
                />
            </div>

        </div>
    </section>
</template>



