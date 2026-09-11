import api from "./api";

const getCart = () => {
    return api.get("/cart/get-cart");
};

const addToCart = (bookFormatId, quantity) => {
    return api.post("/cart/add-to-cart", {
        bookFormatId,
        quantity
    });
};

const updateCartQuantity = (bookFormatId, newQuantity) => {
    return api.patch("/cart/update-cart-quantity", {
        bookFormatId,
        newQuantity
    });
};

const removeFromCart = (bookFormatId) => {
    return api.patch(
        `/cart/${bookFormatId}/remove-from-cart`
    );
};

const clearCart = () => {
    return api.put("/cart/clear-cart");
};

export default {
    getCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart
};