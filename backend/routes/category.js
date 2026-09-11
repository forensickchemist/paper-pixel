const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/category");
const { verify, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require("../middleware/asyncHandler");


// PUBLIC ROUTES
router.get("/", asyncHandler(categoryController.retrieveAllCategories));
router.get("/:id", asyncHandler(categoryController.retrieveSingleCategory));

// ADMIN ROUTES
router.post("/", verify, verifyAdmin, asyncHandler(categoryController.createCategory));
router.patch("/:id", verify, verifyAdmin, asyncHandler(categoryController.updateCategory));

module.exports = router;