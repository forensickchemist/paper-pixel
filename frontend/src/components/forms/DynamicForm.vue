<script setup>
import { reactive } from "vue";


const props = defineProps({
    fields: {
        type: Array,
        required: true
    },

    submitText: {
        type: String,
        default: "Submit"
    },

    loading: {
        type: Boolean,
        default: false
    },

    initialValues: {
        type: Object,
        default: () => ({})
    },

    /*
     * When true, the form submits a FormData object.
     * Useful for forms that contain file uploads.
     */
    multipart: {
        type: Boolean,
        default: false
    }
});


const emit = defineEmits(["submit", "field-change"]);


const formData = reactive({});


// Initialize form values
props.fields.forEach((field) => {
    formData[field.name] =
        props.initialValues[field.name] ??
        field.default ??
        (field.multiple ? [] : "");
});

const handleSubmit = () => {

    /*
     * Validate required fields
     */
    for (const field of props.fields) {

        if (!field.required) {
            continue;
        }

        const value = formData[field.name];

        /*
         * Multiple select
         */
        if (field.multiple) {
            if (!Array.isArray(value) || value.length === 0) {
                return;
            }

            continue;
        }

        /*
         * Normal fields
         */
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return;
        }
    }


    /*
     * Normal form submission
     *
     * Used by:
     * - Book editing
     * - Author forms
     * - Category forms
     * - BookFormat forms
     */
    if (!props.multipart) {
        emit('submit', { ...formData });
        return;
    }


    /*
     * Multipart form submission
     *
     * Used when the form contains
     * a file upload.
     */
    const data = new FormData();


    Object.entries(formData).forEach(([key, value]) => {

        if (value === undefined || value === null) {
            return
        }


        /*
         * Multiple select fields
         *
         * Example:
         * authors: ["id1", "id2"]
         */
        if (Array.isArray(value)) {
            data.append(key, JSON.stringify(value));
            return;
        }


        /*
         * File input
         */
        if (value instanceof File) {
            data.append(key, value);

            return;
        }


        /*
         * Normal values
         */
        data.append(key, value);
    });


    emit('submit', data);
};

</script>


<template>
    <form @submit.prevent="handleSubmit">

        <div
            v-for="field in fields"
            :key="field.name"
            class="mb-3"
        >

            <!-- Label -->

            <label
                :for="field.name"
                class="form-label"
            >
                {{ field.label }}

                <span
                    v-if="field.required"
                    class="text-danger"
                >
                    *
                </span>
            </label>



            <!-- Text / Email / Number / Date -->

            <input
                v-if="
                    ['text', 'email', 'number', 'date'].includes(field.type)
                "
                :id="field.name"
                v-model="formData[field.name]"
                :type="field.type"
                class="form-control"
                :placeholder="field.placeholder || ''"
                :required="field.required"
                :disabled="loading"
                @input="emit('field-change', {
                    name: field.name,
                    value: formData[field.name]
                })"
            />



            <!-- Textarea -->

            <textarea
                v-else-if="field.type === 'textarea'"
                :id="field.name"
                v-model="formData[field.name]"
                class="form-control"
                :placeholder="field.placeholder || ''"
                :rows="field.rows || 4"
                :required="field.required"
                :disabled="loading"
            ></textarea>



            <!-- Select -->

            <select
                v-else-if="field.type === 'select'"
                :id="field.name"
                v-model="formData[field.name]"
                class="form-select"
                :multiple="field.multiple"
                :required="field.required && !field.multiple"
                :disabled="loading"
                @change="emit('field-change', {
                    name: field.name,
                    value: formData[field.name]
                })"
            >
                <option
                    v-if="!field.multiple"
                    value=""
                    disabled
                >
                    {{ field.placeholder || `Select ${field.label}` }}
                </option>

                <option
                    v-for="option in field.options || []"
                    :key="option.value"
                    :value="option.value"
                >
                    {{ option.label }}
                </option>
            </select>



            <!-- Checkbox -->

            <div
                v-else-if="field.type === 'checkbox'"
                class="form-check"
            >

                <input
                    :id="field.name"
                    v-model="formData[field.name]"
                    type="checkbox"
                    class="form-check-input"
                    :disabled="loading"
                    @change="emit('field-change', {
                        name: field.name,
                        value: formData[field.name]
                    })"
                />


                <label
                    :for="field.name"
                    class="form-check-label"
                >
                    {{ field.checkboxLabel || field.label }}
                </label>

            </div>



            <!-- File -->

            <input
                v-else-if="field.type === 'file'"
                :id="field.name"
                type="file"
                class="form-control"
                :accept="field.accept || ''"
                :required="field.required"
                :disabled="loading"
                @change="
                    formData[field.name] =
                        $event.target.files[0] || null
                "
            />



            <!-- Help Text -->

            <div
                v-if="field.help"
                class="form-text"
            >
                {{ field.help }}
            </div>

        </div>



        <!-- Submit Button -->

        <button
            type="submit"
            class="btn btn-primary"
            :disabled="loading"
        >

            <span
                v-if="loading"
                class="spinner-border spinner-border-sm me-2"
                aria-hidden="true"
            ></span>

            {{ loading ? "Saving..." : submitText }}

        </button>

    </form>
</template>