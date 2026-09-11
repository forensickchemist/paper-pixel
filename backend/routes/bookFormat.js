const express = require("express");
const router = express.Router();

const bookFormatController = require("../controllers/bookFormat");
const { verify, verifyAdmin, verifyOptional } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");


// PUBLIC ROUTES
// Retrieve all book formats
router.get("/", verifyOptional, asyncHandler(bookFormatController.retrieveAllBookFormats));

// Retrieve formats belonging to a specific book
router.get("/book/:bookId", verifyOptional, asyncHandler(bookFormatController.retrieveBookFormatsByBook));

// Retrieve single book format
router.get("/:id", verifyOptional, asyncHandler(bookFormatController.retrieveSingleBookFormat));

// ADMIN ROUTES
// Create book format
router.post("/", verify, verifyAdmin, asyncHandler(bookFormatController.createBookFormat));

// Update book format
router.patch("/:id", verify, verifyAdmin, asyncHandler(bookFormatController.updateBookFormat));

// Deactivate book format
router.patch("/:id/deactivate", verify, verifyAdmin, asyncHandler(bookFormatController.deactivateBookFormat));

// Activate book format
router.patch("/:id/activate", verify, verifyAdmin, asyncHandler(bookFormatController.activateBookFormat));


module.exports = router;