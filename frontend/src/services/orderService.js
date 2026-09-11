import api from "./api";

/* ==========================================
   Create Order / Checkout
========================================== */

const checkout = (orderData) => {
    return api.post("/orders/checkout", orderData);
};


/* ==========================================
   Get My Orders
========================================== */

const getMyOrders = () => {
    return api.get("/orders/my-orders");
};


/* ==========================================
   Get All Orders
   Admin Only
========================================== */

const getAllOrders = () => {
    return api.get("/orders/all-orders");
};


export default {
    checkout,
    getMyOrders,
    getAllOrders
};