<script setup>
import { onMounted, ref } from "vue";

import orderService from "@/services/orderService";
import { getApiError } from "@/utils/apiError";

import DynamicTable from "@/components/tables/DynamicTable.vue";


/* ==========================================
   Orders
========================================== */

const orders = ref([]);
const isLoading = ref(false);
const apiError = ref("");



/* ==========================================
   Get All Orders
========================================== */

const getAllOrders = async () => {
    isLoading.value = true;
    apiError.value = "";

    try {
        const response = await orderService.getAllOrders();

        orders.value = response.data.orders || [];
    } catch (error) {
        const err = getApiError(error);

        apiError.value = err.message;
    } finally {
        isLoading.value = false;
    }
};



/* ==========================================
   Initialization
========================================== */

onMounted(() => {
    getAllOrders();
});
</script>


<template>
    <section class="orders-management section-sm">

        <div class="container">


            <!-- ==========================================
                 Section Heading
            =========================================== -->

            <div class="section-heading">

                <p class="section-label text-uppercase">
                    Management
                </p>

                <h2 class="section-title">
                    Orders
                </h2>

                <p class="section-subtitle">
                    View all orders placed by customers.
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
                 Orders Table
            =========================================== -->

            <DynamicTable
                :columns="[
                    {
                        key: 'orderNumber',
                        label: 'Order'
                    },
                    {
                        key: 'customer',
                        label: 'Customer'
                    },
                    {
                        key: 'orderItems',
                        label: 'Items'
                    },
                    {
                        key: 'totalPrice',
                        label: 'Total'
                    },
                    {
                        key: 'status',
                        label: 'Status'
                    },
                    {
                        key: 'createdAt',
                        label: 'Order Date'
                    }
                ]"
                :items="orders"
                :loading="isLoading"
                :show-edit="false"
                empty-message="There are currently no orders."
            >


                <!-- ==========================================
                     Order
                =========================================== -->

                <template #cell-orderNumber="{ item }">

                    {{
                        item._id
                            ? item._id.slice(-8).toUpperCase()
                            : "—"
                    }}

                </template>



                <!-- ==========================================
                     Customer
                =========================================== -->

                <template #cell-customer="{ item }">

                    <div v-if="item.userId">

                        <div>
                            {{ item.userId.firstName }}
                            {{ item.userId.lastName }}
                        </div>

                        <small>
                            {{ item.userId.email }}
                        </small>

                    </div>

                    <span v-else>
                        —
                    </span>

                </template>



                <!-- ==========================================
                     Order Items
                =========================================== -->

                <template #cell-orderItems="{ item }">

                    <div
                        v-if="item.orderItems?.length"
                        class="order-items"
                    >

                        <div
                            v-for="orderItem in item.orderItems"
                            :key="orderItem.bookFormatId"
                        >
                            {{ orderItem.titleSnapshot }}
                            —
                            {{ orderItem.formatSnapshot }}
                            ×
                            {{ orderItem.quantity }}
                        </div>

                    </div>

                    <span v-else>
                        —
                    </span>

                </template>



                <!-- ==========================================
                     Total
                =========================================== -->

                <template #cell-totalPrice="{ item }">

                    ₱{{ Number(item.totalPrice || 0).toLocaleString() }}

                </template>



                <!-- ==========================================
                     Status
                =========================================== -->

                <template #cell-status="{ item }">

                    {{ item.status || "—" }}

                </template>



                <!-- ==========================================
                     Order Date
                =========================================== -->

                <template #cell-createdAt="{ item }">

                    {{
                        item.createdAt
                            ? new Date(
                                item.createdAt
                            ).toLocaleDateString()
                            : "—"
                    }}

                </template>


            </DynamicTable>

        </div>

    </section>
</template>