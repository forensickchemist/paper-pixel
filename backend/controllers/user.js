const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const auth = require('../middleware/auth');

module.exports.registerUser = async (req, res) => {
	const { firstName, lastName, email, mobileNo, password } = req.body || {};

	if (!firstName || !lastName || !email || !mobileNo || !password) {
		throw new AppError(400, "All fields are required");
	}

	const normalizedEmail = email.trim().toLowerCase();
	const normalizedMobileNo = String(mobileNo).trim();

	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
		throw new AppError(400, "Email invalid");
	}

	if (!/^\d{11}$/.test(normalizedMobileNo)) {
		throw new AppError(400, "Mobile number invalid");
	}

	if (password.length < 8) {
		throw new AppError(400, "Password must be at least 8 characters");
	}

	try {
		const newUser = new User({
			firstName: firstName.trim(),
			lastName: lastName.trim(),
			email: normalizedEmail,
			mobileNo: normalizedMobileNo,
			passwordHash: bcrypt.hashSync(password, 10)
		});

		await newUser.save();

		res.status(201).send({ message: "Registered Successfully" });
	} catch(err){
			if (err.code === 11000) {
				throw new AppError(409, "Email already exists");
			}
			throw err;
	}
};

module.exports.loginUser = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new AppError(400, "Email and password are required");
	}

	if (!email.includes("@")) {
		throw new AppError(400,"Invalid Email");
	}

	const user = await User.findOne({ email: email.trim().toLowerCase() });

	if (!user) {
		throw new AppError(404, "No Email Found");
	}

	const isPasswordCorrect = bcrypt.compareSync(password, user.passwordHash);

	if (!isPasswordCorrect) {
		throw new AppError(401, "Email and password do not match");
	}

	return res.status(200).send({ access: auth.createAccessToken(user) });
};

module.exports.retrieveUser = async (req, res) => {
	const user = await User.findById(req.user.id)
		.select("-passwordHash");

	if (!user) {
		throw new AppError(404, "User not found");
	}
	res.status(200).send({
		user
	});
};

module.exports.setAsAdmin = async (req, res) => {
	const updatedUser = await User.findByIdAndUpdate(
		req.params.id,
		{ role: "admin" },
		{ returnDocument: "after" }
	)
	if (!updatedUser) {
		throw new AppError(404, "User not found");
	}
	res.status(200).send({
		updatedUser
	});
};

module.exports.updatePassword = async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		throw new AppError(400, "Current password and new password are required");
	}

	if (newPassword.length < 8) {
		throw new AppError(400, "New password must be at least 8 characters");
	}

	const user = await User.findById(req.user.id);
	if (!user) {
		throw new AppError(404,"User not found");
	}

	const isCurrentPasswordCorrect = bcrypt.compareSync(
		currentPassword,
		user.passwordHash
	);
	if (!isCurrentPasswordCorrect) {
		throw new AppError(401, "Current password is incorrect");
	}

	const isSamePassword = bcrypt.compareSync(
		newPassword,
		user.passwordHash
	);
	if (isSamePassword) {
		throw new AppError(400,"You cannot reuse your old password.");
	}

	user.passwordHash = bcrypt.hashSync(newPassword, 10);

	await user.save();

	res.status(200).send({
		message: "Password updated successfully"
	});

};

