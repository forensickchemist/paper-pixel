const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    recipientName: {
        type: String,
        required: true,
        trim: true
    },
    street: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type:String,
        trim: true,
        required: true
    },
    province: {
        type: String,
        trim: true,
        required: true
    },
    zipCode: {
        type: String,
        trim: true,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: false
    }
});

module.exports = addressSchema;