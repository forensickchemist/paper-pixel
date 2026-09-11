const mongoose = require("mongoose");
const addressSchema = require("./addressSchema");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: [true, "First Name is Required"],
		trim: true
	},
	lastName: {
		type: String,
		required: [true, "Last Name is Required"],
		trim: true
	},
	email: {
		type: String,
		required: [true, "Email is Required"],
		unique: true,
		trim: true,
		lowercase: true,
		match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
		"Invalid email"]
	},
	passwordHash: {
		type: String,
		required: [true, "Password is Required"]
	},
	mobileNo: {
		type: String,
		required: [true, "Mobile Number is Required"],
		trim: true,
		match: [/^\d{11}$/,
		"Mobile number must contain exactly 11 digits"]
	},
	role: {
		type: String,
		enum: ["customer","admin"],
		default: "customer"
	},
	addresses: [addressSchema],
},{
	timestamps:true
});

module.exports = mongoose.model("User", userSchema);
