const mongoose = require("mongoose");

const bookFormatSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true
    },
    type: {
		type: String,
		enum: ["ebook","paperback","hardbound"],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    salePrice: {
        type: Number,
        min:0,
        validate: {
            validator: function (value) {
                return value == null || value <= this.price;
            },
            message: "Sale price cannot be greater than the regular price."
        }
    },
    stock: {
        type: Number,
        min: 0,
        required: function () {
            return this.type !== "ebook";
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    fileType: {
        type: String,
        enum: ["pdf","epub"],
        required: function() {
            return this.type === "ebook";
        }
    },
    fileUrl: {
        type: String,
        trim: true,
        required: function() {
            return this.type === "ebook";
        }
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true
})

bookFormatSchema.index(
    { bookId: 1, type: 1 },
    {unique: true});

module.exports = mongoose.model("BookFormat", bookFormatSchema);