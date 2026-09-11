const mongoose = require("mongoose");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Book = require("../models/Book");
const BookFormat = require("../models/BookFormat");



/* ==========================================
   Helper Functions
========================================== */


const getEffectivePrice = (bookFormat) => {
    if (
        bookFormat.salePrice !== undefined &&
        bookFormat.salePrice !== null
    ) {
        return Number(bookFormat.salePrice);
    }

    return Number(bookFormat.price);
};


const validateShippingAddress = (shippingAddress) => {
    if (
        !shippingAddress ||
        typeof shippingAddress !== "object"
    ) {
        return false;
    }

    return true;
};


const validateMobileNo = (mobileNo) => {
    return (
        typeof mobileNo === "string" &&
        /^\d{11}$/.test(mobileNo)
    );
};



/* ==========================================
   Create Order
========================================== */


module.exports.createOrder = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Admin users are not allowed to create orders."
            });
        }

        const {
            shippingAddress,
            mobileNo
        } = req.body;

        if (!validateShippingAddress(shippingAddress)) {
            return res.status(400).send({
                message: "Valid shippingAddress is required"
            });
        }

        if (!validateMobileNo(mobileNo)) {
            return res.status(400).send({
                message: "Mobile number must contain exactly 11 digits"
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).send({
                message: "No cart found for this user."
            });
        }

        if (
            !cart.cartItems ||
            cart.cartItems.length === 0
        ) {
            return res.status(400).send({
                message: "No items to checkout"
            });
        }

        const orderItems = [];
        let subtotal = 0;

        for (const cartItem of cart.cartItems) {
            const bookFormat = await BookFormat.findById(
                cartItem.bookFormatId
            );

            if (!bookFormat) {
                return res.status(404).send({
                    message: "One of the book formats in the cart no longer exists."
                });
            }

            if (!bookFormat.isActive) {
                return res.status(400).send({
                    message: `The ${bookFormat.type} format for one of the books is no longer active.`
                });
            }

            if (
                bookFormat.type !== "ebook" &&
                Number(bookFormat.stock) < Number(cartItem.quantity)
            ) {
                return res.status(400).send({
                    message: `Insufficient stock for the ${bookFormat.type} format of one of the books.`
                });
            }

            const book = await Book.findById(
                bookFormat.bookId
            ).select("title");

            if (!book) {
                return res.status(404).send({
                    message: "The book associated with one of the cart items no longer exists."
                });
            }

            const price = getEffectivePrice(bookFormat);
            const itemSubtotal =
                price * Number(cartItem.quantity);

            orderItems.push({
                bookFormatId: bookFormat._id,
                titleSnapshot: book.title,
                formatSnapshot: bookFormat.type,
                priceSnapshot: price,
                quantity: Number(cartItem.quantity),
                subtotal: itemSubtotal
            });

            subtotal += itemSubtotal;
        }

        const newOrder = new Order({
            userId: req.user.id,
            orderItems,
            subtotal,
            totalPrice: subtotal,
            shippingAddress,
            mobileNo
        });

        const savedOrder = await newOrder.save();

        /*
         * Reduce stock only for physical formats.
         */
        for (const cartItem of cart.cartItems) {
            const bookFormat = await BookFormat.findById(
                cartItem.bookFormatId
            );

            if (
                bookFormat &&
                bookFormat.type !== "ebook"
            ) {
                bookFormat.stock -= Number(cartItem.quantity);
                await bookFormat.save();
            }
        }

        cart.cartItems = [];
        cart.totalPrice = 0;

        await cart.save();

        return res.status(201).send({
            message: "Ordered Successfully",
            order: savedOrder
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Retrieve My Orders
========================================== */


module.exports.retrieveMyOrder = async (req, res, next) => {
    try {
        const orders = await Order.find({
            userId: req.user.id
        })
            .populate({
                path: "orderItems.bookFormatId",
                populate: {
                    path: "bookId",
                    select: "title coverImage"
                }
            })
            .sort({
                createdAt: -1
            });

        if (!orders || orders.length === 0) {
            return res.status(404).send({
                message: "No orders found for this user."
            });
        }

        return res.status(200).send({
            orders
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Retrieve All Orders
========================================== */


module.exports.retrieveAllOrder = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("userId", "firstName lastName email")
            .sort({ createdAt: -1 });

        return res.status(200).send({
            orders
        });
    } catch (error) {
        return next(error);
    }
};