const mongoose = require("mongoose");

const Cart = require("../models/Cart");
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


const validateBookFormat = async (bookFormatId) => {
    if (!mongoose.Types.ObjectId.isValid(bookFormatId)) {
        return {
            error: {
                status: 400,
                message: "Invalid bookFormatId"
            }
        };
    }

    const bookFormat = await BookFormat.findById(bookFormatId);

    if (!bookFormat) {
        return {
            error: {
                status: 404,
                message: "Book format not found"
            }
        };
    }

    if (!bookFormat.isActive) {
        return {
            error: {
                status: 400,
                message: "This book format is currently inactive"
            }
        };
    }

    return {
        bookFormat
    };
};


const validateStock = (bookFormat, quantity) => {
    if (bookFormat.type === "ebook") {
        return null;
    }

    if (Number(bookFormat.stock) < quantity) {
        return {
            status: 400,
            message: "Insufficient stock for this book format"
        };
    }

    return null;
};

const populateCart = async (cart) => {
    return await cart.populate({
        path: "cartItems.bookFormatId",
        populate: {
            path: "bookId",
            select: "title coverImage"
        }
    });
};

/* ==========================================
   Retrieve User Cart
========================================== */


module.exports.retrieveUserCart = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Action forbidden. Admin users cannot retrieve user carts."
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        }).populate({
            path: "cartItems.bookFormatId",
            populate: {
                path: "bookId",
                select: "title coverImage"
            }
        });

        if (!cart) {
            return res.status(404).send({
                message: "No cart found for this user."
            });
        }

        return res.status(200).send({
            cart
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Add To Cart
========================================== */


module.exports.addToCart = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Admin is forbidden from accessing this resource"
            });
        }

        const {
            bookFormatId,
            quantity
        } = req.body;

        if (
            bookFormatId === undefined ||
            bookFormatId === null ||
            bookFormatId === "" ||
            quantity === undefined ||
            quantity === null ||
            quantity === ""
        ) {
            return res.status(400).send({
                message: "bookFormatId and quantity are required"
            });
        }

        const parsedQuantity = Number(quantity);

        if (
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1
        ) {
            return res.status(400).send({
                message: "Quantity must be a whole number of at least 1"
            });
        }

        const {
            bookFormat,
            error
        } = await validateBookFormat(bookFormatId);

        if (error) {
            return res.status(error.status).send({
                message: error.message
            });
        }

        const cartStockError = validateStock(
            bookFormat,
            parsedQuantity
        );

        if (cartStockError) {
            return res.status(cartStockError.status).send({
                message: cartStockError.message
            });
        }

        const unitPrice = getEffectivePrice(bookFormat);

        let cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            const newCart = new Cart({
                userId: req.user.id,

                cartItems: [
                    {
                        bookFormatId,
                        quantity: parsedQuantity,
                        subtotal: unitPrice * parsedQuantity
                    }
                ],

                totalPrice: unitPrice * parsedQuantity
            });

            const updatedCart = await newCart.save();

            await populateCart(updatedCart);

            return res.status(201).send({
                message: "Item added to cart successfully",
                updatedCart
            });
        }

        const existingItem = cart.cartItems.find((item) => {
            return item.bookFormatId.toString() === bookFormatId;
        });

        if (existingItem) {
            const newQuantity =
                Number(existingItem.quantity) +
                parsedQuantity;

            const stockError = validateStock(
                bookFormat,
                newQuantity
            );

            if (stockError) {
                return res.status(stockError.status).send({
                    message: stockError.message
                });
            }

            existingItem.quantity = newQuantity;
            existingItem.subtotal = unitPrice * newQuantity;
        } else {
            cart.cartItems.push({
                bookFormatId,
                quantity: parsedQuantity,
                subtotal: unitPrice * parsedQuantity
            });
        }

        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);

        const updatedCart = await cart.save();

        await populateCart(updatedCart);

        return res.status(200).send({
            message: "Item added to cart successfully",
            updatedCart
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Update Cart Quantity
========================================== */


module.exports.updateCartQuantity = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Admin is forbidden from accessing this resource"
            });
        }

        const {
            bookFormatId,
            newQuantity
        } = req.body;

        if (
            bookFormatId === undefined ||
            bookFormatId === null ||
            bookFormatId === "" ||
            newQuantity === undefined ||
            newQuantity === null ||
            newQuantity === ""
        ) {
            return res.status(400).send({
                message: "bookFormatId and newQuantity are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(bookFormatId)) {
            return res.status(400).send({
                message: "Invalid bookFormatId"
            });
        }

        const parsedQuantity = Number(newQuantity);

        if (
            !Number.isInteger(parsedQuantity) ||
            parsedQuantity < 1
        ) {
            return res.status(400).send({
                message: "newQuantity must be a whole number of at least 1"
            });
        }

        const {
            bookFormat,
            error
        } = await validateBookFormat(bookFormatId);

        if (error) {
            return res.status(error.status).send({
                message: error.message
            });
        }

        const stockError = validateStock(
            bookFormat,
            parsedQuantity
        );

        if (stockError) {
            return res.status(stockError.status).send({
                message: stockError.message
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        const existingItem = cart.cartItems.find((item) => {
            return item.bookFormatId.toString() === bookFormatId;
        });

        if (!existingItem) {
            return res.status(404).send({
                message: "Item not found in cart"
            });
        }

        const unitPrice = getEffectivePrice(bookFormat);

        existingItem.quantity = parsedQuantity;
        existingItem.subtotal = unitPrice * parsedQuantity;

        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);

        const updatedCart = await cart.save();

        await populateCart(updatedCart);

        return res.status(200).send({
            message: "Item quantity updated successfully",
            updatedCart
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Remove Item From Cart
========================================== */


module.exports.removeItemFromCart = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Admin is forbidden from accessing this resource"
            });
        }

        const {
            bookFormatId
        } = req.params;

        if (!mongoose.Types.ObjectId.isValid(bookFormatId)) {
            return res.status(400).send({
                message: "Invalid bookFormatId"
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        const itemIndex = cart.cartItems.findIndex((item) => {
            return item.bookFormatId.toString() === bookFormatId;
        });

        if (itemIndex === -1) {
            return res.status(404).send({
                message: "Item not found in cart"
            });
        }

        cart.cartItems.splice(itemIndex, 1);

        cart.totalPrice = cart.cartItems.reduce((total, item) => {
            return total + Number(item.subtotal);
        }, 0);

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: "Item removed from cart successfully",
            updatedCart
        });
    } catch (error) {
        return next(error);
    }
};



/* ==========================================
   Clear Cart
========================================== */


module.exports.clearCart = async (req, res, next) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).send({
                message: "Admin is forbidden from accessing this resource"
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.id
        });

        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        if (cart.cartItems.length === 0) {
            return res.status(200).send({
                message: "Cart is already empty",
                updatedCart: cart
            });
        }

        cart.cartItems = [];
        cart.totalPrice = 0;

        const updatedCart = await cart.save();

        return res.status(200).send({
            message: "Cart cleared successfully",
            updatedCart
        });
    } catch (error) {
        return next(error);
    }
};