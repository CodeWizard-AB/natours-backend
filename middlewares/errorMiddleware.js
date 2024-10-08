import AppError from "../utils/appError.js";

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

const handleDuplicateFieldDB = (err) => {
	const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(". ")}`;
	return new AppError(message, 400);
};

const handleJwtError = () => {
	const message = "Invalid token. Please log in again!";
	return new AppError(message, 401);
};

const handleJwtExpiredError = () => {
	const message = "Token has expired! Please log in again";
	return new AppError(message, 401);
};

const sendErrDevelopment = (err, req, res) => {
	if (req.originalUrl.startsWith("/api")) {
		return res.status(err.statusCode).json({
			status: err.status,
			error: err,
			message: err.message,
			stack: err.stack,
		});
	}

	return res.status(err.statusCode).json({
		status: err.status,
		message: "Wrong api url",
	});
};

const sendErrProduction = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		console.error("ERROR 🔥", err);

		res.status(500).json({
			status: "error",
			message: "Something went wrong",
		});
	}
};

const globalError = (err, req, res, next) => {
	err.status = err.status || "error";
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === "development") {
		sendErrDevelopment(err, req, res);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (error.name === "CastError") error = handleCastErrorDB(error);
		if (error.code === 11000) error = handleDuplicateFieldDB(error);
		if (error.name === "ValidationError")
			error = handleValidationErrorDB(error);
		if (error.name === "JsonWebTokenError") error = handleJwtError();
		if (error.name === "TokenExpiredError") error = handleJwtExpiredError();

		sendErrProduction(err, res);
	}

	next();
};

export default { globalError };
