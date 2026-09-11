const mongoose = require("mongoose");

const userLibrarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        bookFormatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "BookFormat",
            required: true
        },
        purchasedAt: {
            type: Date,
            default: Date.now
        },
        downloadCount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

userLibrarySchema.index(
    { userId: 1, bookFormatId: 1 },
    { unique: true }
);

module.exports = mongoose.model("UserLibrary", userLibrarySchema);