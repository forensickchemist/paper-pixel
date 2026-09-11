<script setup>
import { ref } from "vue";

import AdminWelcome from "@/components/books/admin/AdminWelcome.vue";
import AdminDashboardCards from "@/components/books/admin/AdminDashboardCards.vue";

import AdminAuthorsManagement from "@/components/books/admin/AdminAuthorsManagement.vue";
import AuthorForm from "@/components/forms/AuthorForm.vue";

import CategoryForm from "@/components/forms/CategoryForm.vue";
import AdminCategoriesManagement from "@/components/books/admin/AdminCategoriesManagement.vue";

import AdminBooksManagement from "@/components/books/admin/AdminBooksManagement.vue";
import BookForm from "@/components/forms/BookForm.vue";

import AdminFeaturedBooksManagement from "@/components/books/admin/AdminFeaturedBooksManagement.vue";

import AdminBookInventory from "@/components/books/admin/AdminBookInventory.vue";
import AdminBookInventoryFormatEdit from "@/components/books/admin/AdminBookInventoryFormatEdit.vue";

import AdminOrdersManagement from "@/components/books/admin/AdminOrdersManagement.vue";


const activeResource = ref(null);

const activeAction = ref(null);

const selectedInventoryFormat = ref(null);


/* ==========================================
   Dashboard Navigation
========================================== */

const handleAdd = (resource) => {
    activeResource.value = resource;

    activeAction.value = "add";
};


const handleManage = (resource) => {
    activeResource.value = resource;

    activeAction.value = "manage";
};


/* ==========================================
   Author
========================================== */

const handleAuthorCreated = () => {

    activeResource.value = "authors";

    activeAction.value = "manage";
};


/* ==========================================
   Category
========================================== */

const handleCategoryCreated = () => {

    activeResource.value = "categories";

    activeAction.value = "manage";
};


/* ==========================================
   Book
========================================== */

const handleBookCreated = () => {

    activeResource.value = "books";

    activeAction.value = "manage";
};


/* ==========================================
   Inventory
========================================== */

const handleInventoryEdit = (format) => {

    selectedInventoryFormat.value = format;

    activeResource.value = "inventory-format";

    activeAction.value = "edit";
};


const closeInventoryFormat = () => {

    selectedInventoryFormat.value = null;

    activeResource.value = "inventory";

    activeAction.value = "manage";
};


/* ==========================================
   Close Workspace
========================================== */

const closeWorkspace = () => {

    activeResource.value = null;

    activeAction.value = null;
};
</script>


<template>

    <div class="admin-dashboard">

        <!-- ==========================================
             Dashboard Header
        =========================================== -->

        <section class="dashboard-header section-sm">

            <div class="container">

                <p class="section-label text-uppercase">
                    Administration
                </p>

                <h1 class="section-title">
                    Admin Dashboard
                </h1>

                <p class="section-subtitle">
                    Manage your bookstore inventory by adding or updating
                    book details, authors, and book categories.
                </p>

            </div>

        </section>


        <!-- ==========================================
             Dashboard Cards
        =========================================== -->

        <section class="dashboard-content section">

            <div class="container">

                <div class="row g-4">

                    <AdminWelcome />

                    <AdminDashboardCards
                        @add="handleAdd"
                        @manage="handleManage"
                    />

                </div>

            </div>

        </section>


        <!-- ==========================================
             Admin Workspace
        =========================================== -->

        <section
            v-if="activeResource && activeAction"
            class="admin-workspace"
        >

            <!-- Authors: Add -->

            <AuthorForm
                v-if="
                    activeResource === 'authors' &&
                    activeAction === 'add'
                "
                @created="handleAuthorCreated"
            />


            <!-- Authors: Manage -->

            <AdminAuthorsManagement
                v-else-if="
                    activeResource === 'authors' &&
                    activeAction === 'manage'
                "
            />


            <!-- Categories: Add -->

            <CategoryForm
                v-if="
                    activeResource === 'categories' &&
                    activeAction === 'add'
                "
                @created="handleCategoryCreated"
            />


            <!-- Categories: Manage -->

            <AdminCategoriesManagement
                v-else-if="
                    activeResource === 'categories' &&
                    activeAction === 'manage'
                "
            />


            <!-- Books: Add -->

            <BookForm
                v-else-if="
                    activeResource === 'books' &&
                    activeAction === 'add'
                "
                @created="handleBookCreated"
            />


            <!-- Books: Manage -->

            <AdminBooksManagement
                v-else-if="
                    activeResource === 'books' &&
                    activeAction === 'manage'
                "
            />


            <!-- Featured Books: Manage -->

            <AdminFeaturedBooksManagement
                v-else-if="
                    activeResource === 'featured-books' &&
                    activeAction === 'manage'
                "
                @back="closeWorkspace"
            />


            <!-- Inventory: Manage -->

            <AdminBookInventory
                v-else-if="
                    activeResource === 'inventory' &&
                    activeAction === 'manage'
                "
                @edit="handleInventoryEdit"
            />


            <!-- Inventory Format: Edit -->

            <AdminBookInventoryFormatEdit
                v-else-if="
                    activeResource === 'inventory-format' &&
                    activeAction === 'edit'
                "
                :format="selectedInventoryFormat"
                @updated="closeInventoryFormat"
                @back="closeInventoryFormat"
            />


            <!-- Orders: Manage -->

            <AdminOrdersManagement
                v-else-if="
                    activeResource === 'orders' &&
                    activeAction === 'manage'
                "
            />

        </section>

    </div>

</template>


<style scoped>
.dashboard-header {
    padding-top: var(--space-7);
    padding-bottom: var(--space-1);
}
</style>