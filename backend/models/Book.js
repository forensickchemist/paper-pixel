const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    publicationDate: {
        type: Date,
        required: true,
        trim: true
    },

    coverImage: {
        url: {
            type: String
        },

        publicId: {
            type: String
        }
    },

    authors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true
    }],

    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    }],

    featuredFrom: {
        type: Date,
        default: null
    },

    featuredUntil: {
        type: Date,
        default: null
    }

}, {
    timestamps: true
});


/* ==========================================
   Book Formats Virtual
========================================== */

bookSchema.virtual("formats", {
    ref: "BookFormat",
    localField: "_id",
    foreignField: "bookId"
});

bookSchema.set("toJSON", {
    virtuals: true
});

bookSchema.set("toObject", {
    virtuals: true
});


/* ==========================================
   Indexes
========================================== */

bookSchema.index({ title: 1 });
bookSchema.index({ authors: 1 });
bookSchema.index({ categories: 1 });
bookSchema.index({ publicationDate: -1 });
bookSchema.index({ featuredFrom: 1, featuredUntil: 1 });


module.exports = mongoose.model("Book", bookSchema);