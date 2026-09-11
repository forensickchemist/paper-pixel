const express = require("express");
const router = express.Router();

const authorController = require("../controllers/author");
const { verify, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");


// PUBLIC ROUTES
router.get("/", asyncHandler(authorController.retrieveAllAuthors));
router.get("/:id", asyncHandler(authorController.retrieveSingleAuthor));

// ADMIN ROUTES
router.post("/", verify, verifyAdmin, asyncHandler(authorController.createAuthor));
router.patch("/:id", verify, verifyAdmin, asyncHandler(authorController.updateAuthor));

module.exports = router;