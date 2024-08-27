import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";
import sendEmail from "../utils/sendEmail.js";

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

const verifyPerson = (...roles) => {
	return catchAsync((req, res, next) => {
		if (!roles.includes(req.user.role)) {
			const message = "You do not have permission to perform this action";
			return next(new AppError(message, 403));
		}
		next();
	});
};

const forgotPassword = catchAsync(async (req, res, next) => {
	const user = await User.findOne({ email: req.body.email });
	if (!user) {
		const message = "There is no user with email addresss";
		return next(new AppError(message, 404));
	}

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;

	const message = `Forgot your passort? Submit a PATCH request with your with your new password and confirmPassword to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Your password reset token (valid for 10 minutes)",
			message,
		});

		res.status(200).json({
			status: "success",
			message: "Token sent to email!",
		});
	} catch (error) {
		console.log(error.message);

		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		const message = "There was an error sending the email. Try it again later!";
		return next(new AppError(message, 500));
	}
});

const resetPassword = catchAsync((req, res, next) => {});

export default {
	signup,
	login,
	verifyToken,
	verifyPerson,
	forgotPassword,
	resetPassword,
};
