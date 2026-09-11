const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true
        },

        provider: {
            type: String,
            enum: ["PayMongo", "GCash", "Maya", "CashOnDelivery"],
            required: true
        },

        transactionId: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Paid",
                "Failed",
                "Refunded",
                "Cancelled"
            ],
            default: "Pending"
        },
        paidAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

paymentSchema.index({ orderId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);