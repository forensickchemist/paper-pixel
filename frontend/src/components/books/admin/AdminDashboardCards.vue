<script setup>
const emit = defineEmits([
    'add',
    'manage'
])

const handleAdd = (resource) => {
    emit('add', resource)
}

const handleManage = (resource) => {
    emit('manage', resource)
} 
</script>

<template>
    <!-- Manage Authors Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">
            <div class="dashboard-icon">
            <i class="bi bi-person"></i>
            </div>

            <h2>Authors</h2>

            <p>
                View and manage the authors available for your books.
            </p>

            <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" @click="handleAdd('authors')">
                    Add Authors
                </button>

                <button type="button" class="btn btn-outline" @click="handleManage('authors')">
                    Manage Authors
                </button>
            </div>
            
        </div>
    </div>

    <!-- Manage Categories Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">
            <div class="dashboard-icon">
            <i class="bi bi-tags"></i>
            </div>

            <h2>Categories</h2>

            <p>
                View and manage the categories used by your books.
            </p>

            <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" @click="handleAdd('categories')">
                    Add Categories
                </button>

                <button type="button" class="btn btn-outline" @click="handleManage('categories')">
                    Manage Categories
                </button>
            </div>
        </div>
    </div>

    <!-- Manage Books Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">
            <div class="dashboard-icon">
                <i class="bi bi-book"></i>
            </div>

            <h2>Books</h2>

            <p>
                Create, update, and manage books and their available formats.
            </p>
            <div class="d-flex gap-2">
                <button type="button" class="btn btn-primary" @click="handleAdd('books')">
                    Add Books
                </button>

                <button type="button" class="btn btn-outline" @click="handleManage('books')">
                    Manage Books
                </button>
            </div>
        </div>
    </div>

    <!-- Featured Books Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">

            <div class="dashboard-icon">
                <i class="bi bi-star"></i>
            </div>

            <h2>Featured Books</h2>

            <p>
                Select the books displayed in the featured section
                of the bookstore homepage.
            </p>

            <button
                type="button"
                class="btn btn-outline"
                @click="handleManage('featured-books')"
            >
                Manage Featured Books
            </button>

        </div>
    </div>

    <!-- Book Inventory Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">

            <div class="dashboard-icon">
                <i class="bi bi-box-seam"></i>
            </div>

            <h2>Book Inventory</h2>

            <p>
                View book formats, prices, availability, and stock levels.
            </p>

            <button
                type="button"
                class="btn btn-outline"
                @click="handleManage('inventory')"
            >
                View Inventory
            </button>

        </div>
    </div>

    <!-- Orders Card -->
    <div class="col-md-6 col-lg-4">
        <div class="dashboard-card surface">

            <div class="dashboard-icon">
                <i class="bi bi-receipt"></i>
            </div>

            <h2>Orders</h2>

            <p>
                View all customer orders and their current status.
            </p>

            <button
                type="button"
                class="btn btn-outline"
                @click="handleManage('orders')"
            >
                View All Orders
            </button>

        </div>
    </div>
</template>

<style scoped>
.dashboard-card {
  height: 100%;
  padding: var(--space-5);
}

.dashboard-icon {
  width: 48px;
  height: 48px;

  margin-bottom: var(--space-4);

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: var(--color-light-background);
  border-radius: var(--radius-md);

  color: var(--color-primary);
  font-size: var(--fs-xl);
}

.dashboard-card h2 {
  margin-bottom: var(--space-2);
  font-size: var(--fs-xl);
}

.dashboard-card p {
  color: var(--color-muted);
}
</style>