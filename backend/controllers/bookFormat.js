const BookFormat = require("../models/BookFormat");
const Book = require("../models/Book");
const AppError = require("../utils/AppError");


// CREATE BOOK FORMAT (ADMIN)
module.exports.createBookFormat = async (req, res) => {

	const {
		bookId,
		type,
		price,
		salePrice,
		stock,
		fileType,
		fileUrl,
		sku
	} = req.body || {};


	if (!bookId || !type || price === undefined || price === null || !sku) {
		throw new AppError(
			400,
			"Book ID, format type, price, and SKU are required"
		);
	}


	const validTypes = [
		"ebook",
		"paperback",
		"hardbound"
	];


	if (!validTypes.includes(type)) {
		throw new AppError(
			400,
			"Invalid book format type"
		);
	}


	const numericPrice = Number(price);


	if (!Number.isFinite(numericPrice) || numericPrice < 0) {
		throw new AppError(
			400,
			"Price must be a valid number and cannot be negative"
		);
	}


	let numericSalePrice;


	if (
		salePrice !== undefined &&
		salePrice !== null &&
		salePrice !== ""
	) {

		numericSalePrice = Number(salePrice);


		if (
			!Number.isFinite(numericSalePrice) ||
			numericSalePrice < 0
		) {
			throw new AppError(
				400,
				"Sale price must be a valid number and cannot be negative"
			);
		}


		if (numericSalePrice > numericPrice) {
			throw new AppError(
				400,
				"Sale price cannot be greater than the regular price"
			);
		}
	}


	// Verify that the book exists
	const book = await Book.findById(bookId);


	if (!book) {
		throw new AppError(
			404,
			"Book not found"
		);
	}


	// Validate physical book stock
	let numericStock;


	if (type !== "ebook") {

		if (
			stock === undefined ||
			stock === null ||
			stock === ""
		) {
			throw new AppError(
				400,
				"Stock is required for physical book formats"
			);
		}


		numericStock = Number(stock);


		if (
			!Number.isFinite(numericStock) ||
			numericStock < 0
		) {
			throw new AppError(
				400,
				"Stock must be a valid number and cannot be negative"
			);
		}
	}


	// Validate ebook fields
	if (type === "ebook") {

		if (!fileType || !fileUrl) {
			throw new AppError(
				400,
				"File type and file URL are required for ebooks"
			);
		}


		const validFileTypes = [
			"pdf",
			"epub"
		];


		if (!validFileTypes.includes(fileType)) {
			throw new AppError(
				400,
				"Invalid ebook file type"
			);
		}
	}


	const existingFormat = await BookFormat.findOne({
		bookId,
		type
	});


	if (existingFormat) {
		throw new AppError(
			409,
			"This book already has this format"
		);
	}


	const existingSku = await BookFormat.findOne({
		sku: sku.trim()
	});


	if (existingSku) {
		throw new AppError(
			409,
			"SKU already exists"
		);
	}


	const newBookFormat = new BookFormat({
		bookId,
		type,
		price: numericPrice,
		salePrice: numericSalePrice,
		stock: numericStock,
		fileType: type === "ebook" ? fileType : undefined,
		fileUrl: type === "ebook" ? fileUrl.trim() : undefined,
		sku: sku.trim()
	});


	await newBookFormat.save();


	res.status(201).send({
		message: "Book format created successfully",
		bookFormat: newBookFormat
	});
};


// RETRIEVE ALL BOOK FORMATS (ROLE-BASED)
module.exports.retrieveAllBookFormats = async (req, res) => {

	const filter = {};

	if(req.user?.role !== "admin") {
		filter.isActive = true;
	}

	const bookFormats = await BookFormat.find(filter)
		.populate({
			path: "bookId",
			populate: [
				{
					path: "authors"
				},
				{
					path: "categories"
				}
			]
		})
		.sort({
			"bookId.title": 1
		});

	res.status(200).send({
		bookFormats
	});
};


// RETRIEVE SINGLE BOOK FORMAT (ROLE-BASED)
module.exports.retrieveSingleBookFormat = async (req, res) => {
	const filter = {
		_id: req.params.id
	}

	if(req.user?.role !== "admin") {
		filter.isActive = true;
	}

	const bookFormat = await BookFormat.findOne(filter)
		.populate({
			path: "bookId",
			populate: [
				{
					path: "authors"
				},
				{
					path: "categories"
				}
			]
		});


	if (!bookFormat) {
		throw new AppError(
			404,
			"Book format not found"
		);
	}


	res.status(200).send({
		bookFormat
	});
};


// RETRIEVE FORMATS BY BOOK (ROLE-BASED)
module.exports.retrieveBookFormatsByBook = async (req, res) => {

	const book = await Book.findById(req.params.bookId);


	if (!book) {
		throw new AppError(
			404,
			"Book not found"
		);
	}

	const filter = {
		bookId: req.params.bookId
	};

	if (req.user?.role !== "admin") {
		filter.isActive = true;
	}

	const bookFormats = await BookFormat.find(filter);

	if (bookFormats.length === 0) {
		throw new AppError(
			404,
			"No formats found for this book"
		);
	}

	res.status(200).send({
		bookFormats
	});
};


// UPDATE BOOK FORMAT (ADMIN)
module.exports.updateBookFormat = async (req, res) => {

	const {
		type,
		price,
		salePrice,
		stock,
		fileType,
		fileUrl,
		sku
	} = req.body || {};

	const bookFormat = await BookFormat.findById(req.params.id);

	if (!bookFormat) {
		throw new AppError(
			404,
			"Book format not found"
		);
	}

	// Update type
	if (type !== undefined) {
		const validTypes = [
			"ebook",
			"paperback",
			"hardbound"
		];

		if (!validTypes.includes(type)) {
			throw new AppError(
				400,
				"Invalid book format type"
			);
		}

		if (type !== bookFormat.type) {
			const existingFormat = await BookFormat.findOne({
				bookId: bookFormat.bookId,
				type,
				_id: { $ne: bookFormat._id }
			});

			if (existingFormat) {
				throw new AppError(
					409,
					"This book already has this format"
				);
			}
		}

		bookFormat.type = type;
	}


	// Update price
	if (price !== undefined) {
		const numericPrice = Number(price);

		if (
			!Number.isFinite(numericPrice) ||
			numericPrice < 0
		) {
			throw new AppError(
				400,
				"Price must be a valid number and cannot be negative"
			);
		}

		bookFormat.price = numericPrice;
	}


	// Update sale price
	if (salePrice !== undefined) {
		if (
			salePrice === null ||
			salePrice === ""
		) {
			bookFormat.salePrice = undefined;
		} else {
			const numericSalePrice = Number(salePrice);

			if (
				!Number.isFinite(numericSalePrice) ||
				numericSalePrice < 0
			) {
				throw new AppError(
					400,
					"Sale price must be a valid number and cannot be negative"
				);
			}


			if (numericSalePrice > bookFormat.price) {
				throw new AppError(
					400,
					"Sale price cannot be greater than the regular price"
				);
			}

			bookFormat.salePrice = numericSalePrice;
		}
	}


	// Update stock
	if (stock !== undefined) {

		if (bookFormat.type === "ebook") {
			throw new AppError(
				400,
				"Ebooks do not require stock"
			);
		}

		const numericStock = Number(stock);

		if (
			!Number.isFinite(numericStock) ||
			numericStock < 0
		) {
			throw new AppError(
				400,
				"Stock must be a valid number and cannot be negative"
			);
		}

		bookFormat.stock = numericStock;
	}

	// Update ebook information
	if (bookFormat.type === "ebook") {

		if (fileType !== undefined) {
			const validFileTypes = [
				"pdf",
				"epub"
			];


			if (!validFileTypes.includes(fileType)) {
				throw new AppError(
					400,
					"Invalid ebook file type"
				);
			}

			bookFormat.fileType = fileType;
		}


		if (fileUrl !== undefined) {

			if (!fileUrl.trim()) {
				throw new AppError(
					400,
					"File URL cannot be empty"
				);
			}


			bookFormat.fileUrl = fileUrl.trim();
		}
	}

	// Update SKU
	if (sku !== undefined) {

		if (!sku.trim()) {
			throw new AppError(
				400,
				"SKU cannot be empty"
			);
		}

		const existingSku = await BookFormat.findOne({
			sku: sku.trim(),
			_id: { $ne: bookFormat._id }
		});

		if (existingSku) {
			throw new AppError(
				409,
				"SKU already exists"
			);
		}

		bookFormat.sku = sku.trim();
	}

	await bookFormat.save();

	res.status(200).send({
		message: "Book format updated successfully",
		bookFormat
	});
};


// DEACTIVATE BOOK FORMAT (ADMIN)
module.exports.deactivateBookFormat = async (req, res) => {

	const bookFormat = await BookFormat.findById(req.params.id);


	if (!bookFormat) {
		throw new AppError(
			404,
			"Book format not found"
		);
	}


	if (!bookFormat.isActive) {
		return res.status(200).send({
			message: "Book format already deactivated",
			bookFormat
		});
	}


	bookFormat.isActive = false;

	await bookFormat.save();


	res.status(200).send({
		message: "Book format deactivated successfully",
		bookFormat
	});
};


// ACTIVATE BOOK FORMAT (ADMIN)
module.exports.activateBookFormat = async (req, res) => {

	const bookFormat = await BookFormat.findById(req.params.id);


	if (!bookFormat) {
		throw new AppError(
			404,
			"Book format not found"
		);
	}


	if (bookFormat.isActive) {
		return res.status(200).send({
			message: "Book format already activated",
			bookFormat
		});
	}


	bookFormat.isActive = true;

	await bookFormat.save();


	res.status(200).send({
		message: "Book format activated successfully",
		bookFormat
	});
};