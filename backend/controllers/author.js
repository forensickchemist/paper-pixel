const Author = require("../models/Author");
const AppError = require("../utils/AppError");

// CREATE AUTHOR (ADMIN)
module.exports.createAuthor = async (req, res) => {

	const {
		firstName,
		lastName,
		about
	} = req.body || {};


	if (!firstName || !lastName) {
		throw new AppError(
			400,
			"First name and last name are required"
		);
	}


	const newAuthor = new Author({
		firstName: firstName.trim(),
		lastName: lastName.trim(),
		about: about ? about.trim() : ""
	});


	await newAuthor.save();


	res.status(201).send({
		message: "Author created successfully",
		author: newAuthor
	});
};

// RETRIEVE ALL AUTHORS (PUBLIC)
module.exports.retrieveAllAuthors = async (req, res) => {

	const authors = await Author.find({})
		.sort({
			lastName: 1,
			firstName: 1
		});


	res.status(200).send({
		authors
	});
};

// RETRIEVE SINGLE AUTHOR (PUBLIC)
module.exports.retrieveSingleAuthor = async (req, res) => {

	const author = await Author.findById(req.params.id);


	if (!author) {
		throw new AppError(
			404,
			"Author not found"
		);
	}


	res.status(200).send({
		author
	});
};

// UPDATE AUTHOR (ADMIN)
module.exports.updateAuthor = async (req, res) => {

	const {
		firstName,
		lastName,
		about
	} = req.body || {};


	const author = await Author.findById(req.params.id);


	if (!author) {
		throw new AppError(
			404,
			"Author not found"
		);
	}


	if (firstName) {
		author.firstName = firstName.trim();
	}


	if (lastName) {
		author.lastName = lastName.trim();
	}


	if (about !== undefined) {
		author.about = about.trim();
	}


	await author.save();


	res.status(200).send({
		message: "Author updated successfully",
		author
	});
};