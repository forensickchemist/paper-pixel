const express = require('express');
const orderController = require('../controllers/order');
const { verify, verifyAdmin } = require("../middleware/auth");
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.post("/checkout", verify, asyncHandler(orderController.createOrder));
router.get("/my-orders", verify, asyncHandler(orderController.retrieveMyOrder));
router.get("/all-orders", verify, verifyAdmin, asyncHandler(orderController.retrieveAllOrder));

module.exports = router;