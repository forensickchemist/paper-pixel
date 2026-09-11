const mongoose = require("mongoose");


const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
        unique: true
    },

    cartItems: [
        {
            bookFormatId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BookFormat",
                required: [true, "Book format ID is required"]
            },

            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"]
            },

            subtotal: {
                type: Number,
                required: [true, "Subtotal is required"],
                min: [0, "Subtotal cannot be negative"]
            }
        }
    ],

    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"],
        min: [0, "Total price cannot be negative"]
    }
}, {
    timestamps: true
});


module.exports = mongoose.model("Cart", cartSchema);