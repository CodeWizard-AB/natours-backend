import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

const signToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_TOKEN_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const signup = catchAsync(async (req, res) => {
	const { role, ...reqBody } = req.body;
	const newUser = await User.create(reqBody);

	const token = signToken(newUser._id);

	res.status(201).json({
		status: "success",
		token,
		data: { user: newUser },
	});
});

const login = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		const message = "Please provide email and password!";
		return next(new AppError(message, 400));
	}

	const user = await User.findOne({ email }).select("password");

	if (!user || !(await user.validatePassword(password))) {
		const message = "Incorrect email or password";
		return next(new AppError(message, 401));
	}

	const token = signToken(user._id);

	res.status(200).json({
		status: "success",
		token,
	});
});

const verifyToken = catchAsync(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ").at(-1);
	}

	if (!token) {
		const message = "You aren't logged in! Please log in to get access";
		throw new Error(message);
		return next(new AppError(message, 401));
	}

	const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET);

	const currentUser = await User.findById(decoded.id);

	if (!currentUser) {
		const message = "The user belonging to this token does not longer exist";
		return next(new AppError(message, 401));
	}

	if (currentUser.validateChangedPassword(decoded.iat)) {
		const message = "User recently changed password! Please log in again";
		return next(new AppError(message, 401));
	}

	req.user = currentUser;
	next();
});

export default { signup, login, verifyToken };
