<script setup>
import { onMounted, ref } from 'vue'

import categoryService from '@/services/categoryService'
import { getApiError } from '@/utils/apiError'

import DynamicTable from '@/components/tables/DynamicTable.vue'
import DynamicForm from '@/components/forms/DynamicForm.vue'

const categories = ref([])
const isLoading = ref(false)
const apiError = ref('')

/* ========================================== 
Category Editing 
========================================== */ 
const selectedCategory = ref(null) 
const editForm = ref({ name: '', description: '' }) 
const isUpdating = ref(false) 
const updateError = ref('') 
const updateSuccess = ref('') 

const editFields = [ 
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
        rows: 4 } 
] 
    
/* ========================================== 
Get Categories 
========================================== */ 
const getCategories = async () => { 
    isLoading.value = true 
    apiError.value = '' 
    
    try { 
        const response = await categoryService.getCategories() 
        categories.value = response.data.categories || [] 
    } catch (error) { 
        const err = getApiError(error) 
        apiError.value = err.message 
    } finally { 
        isLoading.value = false 
    } 
} 
                
/* ========================================== 
Edit Category 
========================================== */ 
const editCategory = (category) => { 
    selectedCategory.value = category 
    updateError.value = '' 
    updateSuccess.value = '' 
    editForm.value = { 
        name: category.name || '', 
        description: category.description || '' 
    } 
} 

/* ========================================== 
Update Category 
========================================== */ 
const updateCategory = async (formData) => { 
    if (!selectedCategory.value) { 
        return 
    } 
    isUpdating.value = true 
    updateError.value = '' 
    updateSuccess.value = '' 
    
    try { 
        await categoryService.updateCategory( selectedCategory.value._id, formData ) 
        updateSuccess.value = 'Category updated successfully.' 
        
        await getCategories() 
        selectedCategory.value = null 
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
    selectedCategory.value = null 
    updateError.value = '' 
    updateSuccess.value = '' 
} 

/* ========================================== 
Initialization 
========================================== */ 
onMounted(() => { 
    getCategories() 
    })
</script>

<template>
    <section class="categories-management section-sm">

        <div class="container">

            <!-- ========================================== 
                    Section Heading 
            =========================================== -->
            <div class="section-heading">
                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Categories
                </h2>

                <p class="section-subtitle">
                    View and manage the categories used by your books.
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
                    Edit Category
            =========================================== -->
            <div v-if="selectedCategory" class="surface p-4" >
                <div class="section-heading mb-4"> 
                    <p class="section-label text-uppercase"> Edit Category </p> 
                    <h3 class="section-title"> {{ selectedCategory.name }} </h3> 
                    <p class="section-subtitle"> Update the information for this category. </p> 
                </div>

                <!-- Update Error --> 
                <div v-if="updateError" class="alert alert-danger" role="alert" > 
                    {{ updateError }}
                </div> 
                
                <!-- Update Success --> 
                <div v-if="updateSuccess" class="alert alert-success" role="alert" > 
                    {{ updateSuccess }} 
                </div>

                <DynamicForm 
                    :fields="editFields" 
                    :initial-values="editForm"
                    submit-text="Save Changes" 
                    :loading="isUpdating" 
                    @submit="updateCategory" 
                /> 
                <button type="button" class="btn btn-outline mt-3" :disabled="isUpdating" @click="cancelEdit" > 
                    Cancel 
                </button>
            </div>

            <!-- ========================================== 
                    Categories Table 
            =========================================== -->

            <DynamicTable
                v-else 
                :columns="[ 
                    { 
                        key: 'name', 
                        label: 'Name' 
                    }, 
                    { 
                        key: 'description', 
                        label: 'Description' 
                    } 
                ]" 
                :items="categories" 
                :loading="isLoading" 
                empty-message="There are currently no categories." 
                @edit="editCategory"
            />

        </div>

    </section>
</template>

