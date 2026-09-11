const express = require('express');
const cartController = require('../controllers/cart');
const { verify } = require("../middleware/auth");
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get("/get-cart", verify, asyncHandler(cartController.retrieveUserCart));
router.post("/add-to-cart", verify, asyncHandler(cartController.addToCart));
router.patch("/update-cart-quantity", verify, asyncHandler(cartController.updateCartQuantity));
router.patch("/:bookFormatId/remove-from-cart", verify, asyncHandler(cartController.removeItemFromCart));
router.put("/clear-cart", verify, asyncHandler(cartController.clearCart));

module.exports = router;