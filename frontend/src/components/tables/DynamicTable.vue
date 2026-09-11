<script setup>
defineProps({
    columns: {
        type: Array,
        required: true
    },

    items: {
        type: Array,
        required: true
    },

    loading: {
        type: Boolean,
        default: false
    },

    emptyMessage: {
        type: String,
        default: "No records found."
    },

    showEdit: {
        type: Boolean,
        default: true
    },

    showToggle: {
        type: Boolean,
        default: false
    },

    toggleActiveLabel: {
        type: String,
        default: "Deactivate"
    },

    toggleInactiveLabel: {
        type: String,
        default: "Activate"
    },

    showManageFormats: {
        type: Boolean,
        default: false
    },

    showRemove: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits([
    "edit",
    "toggle",
    "manage-formats",
    "remove"
]);

const handleEdit = (item) => {
    emit("edit", item);
};

const handleToggle = (item) => {
    emit("toggle", item);
};

const handleManageFormats = (item) => {
    emit("manage-formats", item);
};

const handleRemove = (item) => {
    emit("remove", item);
};
</script>

<template>
    <div class="table-wrapper surface">

        <div
            v-if="loading"
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
                Loading...
            </p>
        </div>

        <div
            v-else-if="items.length"
            class="table-responsive"
        >
            <table class="table align-middle mb-0">

                <thead>
                    <tr>
                        <th
                            v-for="column in columns"
                            :key="column.key"
                            scope="col"
                        >
                            {{ column.label }}
                        </th>

                        <th
                            v-if="
                                showEdit ||
                                showToggle ||
                                showManageFormats ||
                                showRemove
                            "
                            scope="col"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="item in items"
                        :key="item._id"
                    >

                        <td
                            v-for="column in columns"
                            :key="column.key"
                        >
                            <slot
                                :name="`cell-${column.key}`"
                                :item="item"
                            >
                                {{ item[column.key] ?? "—" }}
                            </slot>
                        </td>

                        <td>
                            <div class="d-flex gap-2">

                                <!-- Edit -->
                                <button
                                    v-if="showEdit"
                                    type="button"
                                    class="btn btn-primary action-button"
                                    @click="handleEdit(item)"
                                >
                                    <i
                                        class="bi bi-pencil"
                                        aria-hidden="true"
                                    ></i>

                                    Edit
                                </button>

                                <!-- Toggle -->
                                <button
                                    v-if="showToggle"
                                    type="button"
                                    class="btn btn-outline action-button"
                                    @click="handleToggle(item)"
                                >
                                    <i
                                        class="bi bi-power"
                                        aria-hidden="true"
                                    ></i>

                                    {{
                                        item.isActive
                                            ? toggleActiveLabel
                                            : toggleInactiveLabel
                                    }}
                                </button>

                                <!-- Manage Formats -->
                                <button
                                    v-if="showManageFormats"
                                    type="button"
                                    class="btn btn-outline action-button"
                                    @click="handleManageFormats(item)"
                                >
                                    <i
                                        class="bi bi-box-seam"
                                        aria-hidden="true"
                                    ></i>

                                    Manage Formats
                                </button>

                                <!-- Remove -->
                                <button
                                    v-if="showRemove"
                                    type="button"
                                    class="btn btn-outline action-button"
                                    @click="handleRemove(item)"
                                >
                                    <i
                                        class="bi bi-x-circle"
                                        aria-hidden="true"
                                    ></i>

                                    Remove
                                </button>

                            </div>
                        </td>

                    </tr>
                </tbody>

            </table>
        </div>

        <div
            v-else
            class="empty-state"
        >
            <p class="mb-0">
                {{ emptyMessage }}
            </p>
        </div>

    </div>
</template>

<style scoped>
.table-wrapper {
    overflow: hidden;
}

.table thead th {
    padding: var(--space-4);

    background-color: var(--color-background);
    border-bottom: var(--border);

    color: var(--color-heading);
    font-weight: var(--fw-semibold);

    white-space: nowrap;
}

.table tbody td {
    padding: var(--space-4);
    border-bottom: var(--border);
}

.table tbody tr:last-child td {
    border-bottom: none;
}

.action-button {
    white-space: nowrap;
}
</style>