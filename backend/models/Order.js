const mongoose = require("mongoose");
const addressSchema = require("./addressSchema");


const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  orderItems: [
    {
      bookFormatId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "BookFormat",
          required: true
      },
      titleSnapshot: {
          type: String,
          required: true,
          trim: true
      },
      formatSnapshot: {
          type: String,
          enum: ["ebook", "paperback", "hardbound"],
          required: true
      },
      priceSnapshot: {
          type: Number,
          required: true,
          min: 0
      },
      quantity: {
          type: Number,
          required: true,
          min: 1
      },
      subtotal: {
        type: Number,
        required: true,
        min: 0
      },
    }
  ],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
    min: [0, "Total price cannot be negative"]
  },
  shippingAddress: {
    type: addressSchema,
    required: true
  },
  mobileNo: {
    type: String,
    required: true,
    trim: true,
    match: [/^\d{11}$/,
		"Mobile number must contain exactly 11 digits"]
  },
  status: {
      type: String,
      enum: [
          "Pending",
          "Processing",
          "Shipped",
          "Delivered",
          "Cancelled"
      ],
      default: "Pending"
  }
},{
  timestamps: true
});

orderSchema.index({
    userId: 1
});

module.exports = mongoose.model("Order", orderSchema);