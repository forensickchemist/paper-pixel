const Category = require("../models/Category");
const AppError = require("../utils/AppError");


// CREATE CATEGORY (ADMIN)
module.exports.createCategory = async (req, res) => {

	const { name, description } = req.body || {};


	if (!name || !name.trim()) {
		throw new AppError(
			400,
			"Category name is required"
		);
	}


	const normalizedName = name.trim().toLowerCase();


	const existingCategory = await Category.findOne({
		name: normalizedName
	});


	if (existingCategory) {
		throw new AppError(
			409,
			"Category already exists"
		);
	}


	const newCategory = new Category({
		name: normalizedName,
		description: description
			? description.trim()
			: ""
	});


	await newCategory.save();


	res.status(201).send({
		message: "Category created successfully",
		category: newCategory
	});
};

// RETRIEVE ALL CATEGORIES (PUBLIC)
module.exports.retrieveAllCategories = async (req, res) => {

	const categories = await Category.find({})
		.sort({
			name: 1
		});


	res.status(200).send({
		categories
	});
};

// RETRIEVE SINGLE CATEGORY (PUBLIC)
module.exports.retrieveSingleCategory = async (req, res) => {

	const category = await Category.findById(req.params.id);


	if (!category) {
		throw new AppError(
			404,
			"Category not found"
		);
	}


	res.status(200).send({
		category
	});
};

// UPDATE CATEGORY (ADMIN)
module.exports.updateCategory = async (req, res) => {

	const {
		name,
		description
	} = req.body || {};


	const category = await Category.findById(req.params.id);


	if (!category) {
		throw new AppError(
			404,
			"Category not found"
		);
	}


	if (name !== undefined) {

		if (!name.trim()) {
			throw new AppError(
				400,
				"Category name cannot be empty"
			);
		}


		const normalizedName = name.trim().toLowerCase();


		const existingCategory = await Category.findOne({
			name: normalizedName,
			_id: { $ne: category._id }
		});


		if (existingCategory) {
			throw new AppError(
				409,
				"Category already exists"
			);
		}


		category.name = normalizedName;
	}


	if (description !== undefined) {
		category.description = description.trim();
	}


	await category.save();


	res.status(200).send({
		message: "Category updated successfully",
		category
	});
};