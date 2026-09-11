const Book = require("../models/Book");

const BookFormat = require("../models/BookFormat");

const Author = require("../models/Author");

const Category = require("../models/Category");

const AppError = require("../utils/AppError");


const getBooksWithActiveFormats = async (
    bookQuery = {},
    includeInactiveFormats = false
) => {
    // Admins can see all books, including books
    // that currently have no active formats.
    if (includeInactiveFormats) {
        return Book.find(bookQuery)
            .populate("authors")
            .populate("categories")
            .populate({
                path: "formats"
            })
            .sort({
                title: 1
            });
    }

    // Guests and customers should only see books
    // that have at least one active format.
    const activeBookIds = await BookFormat.distinct("bookId", {
        isActive: true
    });
    return Book.find({
        $and: [
            bookQuery,
            {
                _id: { $in: activeBookIds }
            }
        ]
    })
        .populate("authors")
        .populate("categories")
        .populate({
            path: "formats",
            match: {
                isActive: true
            }
        })
        .sort({
            title: 1
        });
};

// CREATE BOOK (ADMIN)
module.exports.createBook = async (req, res) => {
    const {
        title,
        description,
        publicationDate,
    } = req.body || {};
    let authors = req.body?.authors;
    let categories = req.body?.categories;

    if (typeof authors === "string") {
        try {
            authors = JSON.parse(authors);
        } catch {
            throw new AppError(
                400,
                "Invalid authors format"
            );
        }
    }

    if (typeof categories === "string") {
        try {
            categories = JSON.parse(categories);
        } catch {
            throw new AppError(
                400,
                "Invalid categories format"
            );
        }
    }

    if (
        !title ||
        !title.trim() ||
        !description ||
        !description.trim() ||
        !publicationDate
    ) {
        throw new AppError(
            400,
            "Title, description, and publication date are required"
        );
    }

    if (!Array.isArray(authors) || authors.length === 0) {
        throw new AppError(
            400,
            "At least one author is required"
        );
    }

    if (
        categories !== undefined &&
        !Array.isArray(categories)
    ) {
        throw new AppError(
            400,
            "Categories must be an array"
        );
    }

    const parsedDate = new Date(publicationDate);
    if (isNaN(parsedDate.getTime())) {
        throw new AppError(
            400,
            "Invalid publication date"
        );
    }

    const authorsExist = await Author.countDocuments({
        _id: { $in: authors }
    });

    if (authorsExist !== authors.length) {
        throw new AppError(
            400,
            "One or more authors do not exist"
        );
    }

    if (categories && categories.length > 0) {
        const categoriesExist = await Category.countDocuments({
            _id: { $in: categories }
        });
        if (categoriesExist !== categories.length) {
            throw new AppError(
                400,
                "One or more categories do not exist"
            );
        }
    }

    const newBook = new Book({
        title: title.trim(),
        description: description.trim(),
        publicationDate: parsedDate,
        authors,
        categories: categories || [],
        coverImage: {
            url: req.file?.path || "",
            publicId: req.file?.filename || ""
        }
    });
    await newBook.save();
    res.status(201).send({
        message: "Book created successfully",
        book: newBook
    });
};

// RETRIEVE ALL BOOKS (PUBLIC)
module.exports.retrieveAllBooks = async (req, res) => {
    const isAdmin = req.user?.role === "admin";
    const books = await getBooksWithActiveFormats(
        {},
        isAdmin
    );
    res.status(200).send({
        books
    });
};

// RETRIEVE SINGLE BOOK (PUBLIC)
module.exports.retrieveSingleBook = async (req, res) => {
    const books = await getBooksWithActiveFormats({
        _id: req.params.id
    });
    const book = books[0];
    if (!book) {
        throw new AppError(
            404,
            "Book not found"
        );
    }
    res.status(200).send({
        book
    });
};

// UPDATE BOOK (ADMIN)
module.exports.updateBook = async (req, res) => {
    const {
        title,
        description,
        publicationDate,
        featuredFrom,
        featuredUntil
    } = req.body || {};
    let authors = req.body?.authors;
    let categories = req.body?.categories;

    /* ==========================================
       Parse Authors
    =========================================== */
    if (typeof authors === "string") {
        try {
            authors = JSON.parse(authors);
        } catch {
            throw new AppError(
                400,
                "Invalid authors format"
            );
        }
    }

    /* ==========================================
       Parse Categories
    =========================================== */
    if (typeof categories === "string") {
        try {
            categories = JSON.parse(categories);
        } catch {
            throw new AppError(
                400,
                "Invalid categories format"
            );
        }
    }

    /* ==========================================
       Find Book
    =========================================== */
    const book = await Book.findById(req.params.id);
    if (!book) {
        throw new AppError(
            404,
            "Book not found"
        );
    }

    /* ==========================================
       Update Title
    =========================================== */
    if (title !== undefined) {
        if (!title.trim()) {
            throw new AppError(
                400,
                "Book title cannot be empty"
            );
        }
        book.title = title.trim();
    }

    /* ==========================================
       Update Description
    =========================================== */
    if (description !== undefined) {
        if (!description.trim()) {
            throw new AppError(
                400,
                "Book description cannot be empty"
            );
        }
        book.description = description.trim();
    }

    /* ==========================================
       Update Publication Date
    =========================================== */
    if (publicationDate !== undefined) {
        const parsedDate = new Date(publicationDate);
        if (isNaN(parsedDate.getTime())) {
            throw new AppError(
                400,
                "Invalid publication date"
            );
        }
        book.publicationDate = parsedDate;
    }

    /* ==========================================
       Update Authors
    =========================================== */
    if (authors !== undefined) {
        if (!Array.isArray(authors) || authors.length === 0) {
            throw new AppError(
                400,
                "At least one author is required"
            );
        }
        const authorsExist = await Author.countDocuments({
            _id: { $in: authors }
        });
        if (authorsExist !== authors.length) {
            throw new AppError(
                400,
                "One or more authors do not exist"
            );
        }
        book.authors = authors;
    }

    /* ==========================================
       Update Categories
    =========================================== */
    if (categories !== undefined) {
        if (!Array.isArray(categories)) {
            throw new AppError(
                400,
                "Categories must be an array"
            );
        }

        if (categories.length > 0) {
            const categoriesExist = await Category.countDocuments({
                _id: { $in: categories }
            });
            if (categoriesExist !== categories.length) {
                throw new AppError(
                    400,
                    "One or more categories do not exist"
                );
            }
        }
        book.categories = categories;
    }

    /* ==========================================
       Update Cover Image
    =========================================== */
    /*
     * Only replace the existing cover when
     * a new image was actually uploaded.
     *
     * If no new image was selected, req.file
     * will be undefined and the existing cover
     * remains unchanged.
     */

    if (req.file) {
        book.coverImage = {
            url: req.file.path || "",
            publicId: req.file.filename || ""
        };
    }

    /* ==========================================
       Update Featured Dates
    ========================================== */
    if (
        featuredFrom !== undefined ||
        featuredUntil !== undefined
    ) {
        /*
         * The admin form uses date-only values:
         *
         * featuredFrom:  YYYY-MM-DD
         * featuredUntil: YYYY-MM-DD
         *
         * Start is normalized to the beginning
         * of the selected day.
         *
         * End is normalized to the end of the
         * selected day so the book remains featured
         * throughout the selected end date.
         */

        const newFeaturedFrom =
            featuredFrom
                ? new Date(`${featuredFrom}T00:00:00`)
                : null;

        const newFeaturedUntil =
            featuredUntil
                ? new Date(`${featuredUntil}T23:59:59.999`)
                : null;

        /* Validate Featured Start Date */
        if (
            featuredFrom &&
            isNaN(newFeaturedFrom.getTime())
        ) {
            throw new AppError(
                400,
                "Invalid featured start date"
            );
        }
        /* Validate Featured End Date */
        if (
            featuredUntil &&
            isNaN(newFeaturedUntil.getTime())
        ) {
            throw new AppError(
                400,
                "Invalid featured end date"
            );
        }
        /* Both Dates Must Be Provided */
        if (
            (featuredFrom && !featuredUntil) ||
            (!featuredFrom && featuredUntil)
        ) {
            throw new AppError(
                400,
                "Both featured start and end dates are required"
            );
        }
        /* End Date Must Not Be Before Start Date */
        if (
            newFeaturedFrom &&
            newFeaturedUntil &&
            newFeaturedUntil < newFeaturedFrom
        ) {
            throw new AppError(
                400,
                "Featured end date must be after the featured start date"
            );
        }
        book.featuredFrom = newFeaturedFrom;
        book.featuredUntil = newFeaturedUntil;
    }

    /* ==========================================
       Save Book
    =========================================== */
    await book.save();
    res.status(200).send({
        message: "Book updated successfully",
        book
    });
};

// SEARCH BOOKS BY TITLE (PUBLIC)
module.exports.searchBookByTitle = async (req, res) => {
    const { title } = req.body || {};
    if (!title || !title.trim()) {
        throw new AppError(
            400,
            "Book title is required"
        );
    }
    const searchTitle = title
        .trim()
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const books = await getBooksWithActiveFormats({
        title: {
            $regex: searchTitle,
            $options: "i"
        }
    });
    if (books.length === 0) {
        throw new AppError(
            404,
            "No books found with the provided title"
        );
    }
    res.status(200).send({
        books
    });
};

// RETRIEVE BOOKS BY AUTHOR (PUBLIC)
module.exports.retrieveBooksByAuthor = async (req, res) => {
    const books = await getBooksWithActiveFormats({
        authors: req.params.authorId
    });
    if (books.length === 0) {
        throw new AppError(
            404,
            "No books found for this author"
        );
    }
    res.status(200).send({
        books
    });
};

// RETRIEVE BOOKS BY CATEGORY (PUBLIC)
module.exports.retrieveBooksByCategory = async (req, res) => {
    const books = await getBooksWithActiveFormats({
        categories: req.params.categoryId
    });
    if (books.length === 0) {
        throw new AppError(
            404,
            "No books found for this category"
        );
    }
    res.status(200).send({
        books
    });
};

// RETRIEVE CURRENTLY FEATURED BOOKS (PUBLIC)
module.exports.retrieveFeaturedBooks = async (req, res) => {
    const now = new Date();

    const books = await getBooksWithActiveFormats({
        featuredFrom: {
            $lte: now
        },
        featuredUntil: {
            $gte: now
        }
    });
    res.status(200).send({
        books
    });
};