const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const serverless = require("serverless-http");

require("dotenv").config();

const errorHandler = require("./middleware/errorHandler");

const userRoutes = require("./routes/user");
const authorRoutes = require("./routes/author");
const categoryRoutes = require("./routes/category");
const bookRoutes = require("./routes/book");
const bookFormatRoutes = require("./routes/bookFormat");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware
// ==========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// ==========================================
// Routes
// ==========================================

app.use("/users", userRoutes);
app.use("/authors", authorRoutes);
app.use("/categories", categoryRoutes);
app.use("/books", bookRoutes);
app.use("/book-formats", bookFormatRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);

// ==========================================
// Error Handler
// ==========================================

app.use(errorHandler);

// ==========================================
// MongoDB Connection
// ==========================================

let isConnected = false;

const connectToDatabase = async () => {
    // Reuse an existing connection when Lambda
    // invokes the function again.
    if (
        isConnected &&
        mongoose.connection.readyState === 1
    ) {
        return;
    }

    try {
        await mongoose.connect(
            process.env.MONGODB_STRING
        );

        isConnected = true;

        console.log(
            "Now connected to MongoDB Atlas"
        );
    } catch (error) {
        isConnected = false;

        console.error(
            "MongoDB connection error:",
            error
        );

        throw error;
    }
};

// ==========================================
// AWS Lambda Handler
// ==========================================

const serverlessApp = serverless(app, {
    basePath: "/production"
});

const handler = async (event, context) => {
    // Keep the Lambda invocation from waiting for
    // the MongoDB connection to close.
    context.callbackWaitsForEmptyEventLoop = false;

    await connectToDatabase();

    return serverlessApp(event, context);
};

// ==========================================
// Local Development
// ==========================================

if (require.main === module) {
    connectToDatabase()
        .then(() => {
            app.listen(PORT, () => {
                console.log(
                    `Server is running on port ${PORT}`
                );
            });
        })
        .catch((error) => {
            console.error(
                "Failed to start server:",
                error
            );

            process.exit(1);
        });
}

// ==========================================
// Exports
// ==========================================

module.exports = {
    app,
    mongoose,
    handler
};