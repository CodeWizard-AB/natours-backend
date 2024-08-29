import _ from "lodash";
import User from "../models/userModel.js";
import ApiFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import factoryController from "./factoryController.js";

const getUsers = catchAsync(async (req, res) => {
	const features = new ApiFeature(User.find(), req.query)
		.filter()
		.sort()
		.select()
		.paginate();
	const users = await features.query;

	res
		.status(200)
		.json({ status: "success", results: users.length, data: { users } });
});

const getUser = factoryController.getOne(User);
const createUser = factoryController.createOne(User);
const deleteUser = factoryController.deleteOne(User);

const updateUser = catchAsync(async (req, res, next) => {
	if (req.body.password || req.body.confirmPassword) {
		const message =
			"This is route is not for password update. Please use /updatePassword";
		return next(new AppError(message, 400));
	}

	const filterBody = _.pick(req.body, ["name", "email"]);
	const user = await User.findByIdAndUpdate(req.params.id, filterBody, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		const err = "No user found with that ID";
		return next(new AppError(err, 404));
	}

	res.status(200).json({ status: "success", data: { user } });
});

export default {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
};
