const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// JWT fallback secret
const secret = process.env.JWT_SECRET_KEY || "ECommerceAPI";

// Creates a JWT token for a logged-in / registered user
module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		role: user.role
	};

	return jwt.sign(data, secret, {
		expiresIn: "1d"
	});
};

module.exports.verify = (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return next(new AppError(401, "Authentication token is required."));
	}

	if (token.toLowerCase().startsWith("bearer ")) {
		token = token.slice(7);
	}

	jwt.verify(token, secret, (err, decoded) => {

		if (err) {
			return next(new AppError(403, "Invalid or expired token"));
		}

		req.user = decoded;

		next();

	});
};

// Verifies that the logged-in user (already verified via `verify`) is an admin
module.exports.verifyAdmin = (req, res, next) => {
	if (req.user && req.user.role === "admin") {
		return next();
	} else {
		return next(
			new AppError(403, "Action Forbidden")
		);
	}
};

module.exports.verifyOptional = (req, res, next) => {
    let token = req.headers.authorization;

    // No token is fine for public routes
    if (!token) {
        return next();
    }

    if (token.toLowerCase().startsWith("bearer ")) {
        token = token.slice(7);
    }

    jwt.verify(token, secret, (err, decoded) => {

        // Invalid/expired token should not prevent
        // access to a public route.
        if (err) {
            return next();
        }

        req.user = decoded;

        next();
    });
};
