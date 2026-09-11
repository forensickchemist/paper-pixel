const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    about: {
        type: String,
        trim: true
    }
},{
    timestamps: true
})

authorSchema.index({
    lastName: 1,
    firstName: 1
});

module.exports = mongoose.model("Author", authorSchema);