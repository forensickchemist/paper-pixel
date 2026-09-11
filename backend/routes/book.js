const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book");
const { verify, verifyAdmin, verifyOptional } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");

const upload = require("../middleware/upload");


// PUBLIC ROUTES
// Retrieve all books
router.get("/", verifyOptional, asyncHandler(bookController.retrieveAllBooks));

// Search books by title
router.post("/search/title", verifyOptional, asyncHandler(bookController.searchBookByTitle));

// Retrieve books by author
router.get("/author/:authorId", verifyOptional, asyncHandler(bookController.retrieveBooksByAuthor));

// Retrieve books by category
router.get("/category/:categoryId", verifyOptional, asyncHandler(bookController.retrieveBooksByCategory));

// Retrieve currently featured books
router.get("/featured", verifyOptional, asyncHandler(bookController.retrieveFeaturedBooks));

// Retrieve single book
router.get("/:id", verifyOptional, asyncHandler(bookController.retrieveSingleBook));

// ADMIN ROUTES
// Create book
router.post("/", verify, verifyAdmin, upload.single("coverImage"), asyncHandler(bookController.createBook));

// Update book
router.patch("/:id", verify, verifyAdmin, upload.single("coverImage"), asyncHandler(bookController.updateBook));

module.exports = router;