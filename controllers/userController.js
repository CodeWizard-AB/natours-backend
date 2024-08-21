import User from "../models/userModel.js";
import ApiFeature from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";

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

const getUser = catchAsync(async (req, res) => {
	const user = await User.findById(req.params.id);
	res.status(200).json({ status: "success", data: { user } });
});

const createUser = async (req, res) => {
	const user = await User.create(req.body);
	res.status(201).json({ status: "success", data: { user } });
};

const deleteUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		const err = "No user found with that ID";
		return next(new AppError(err, 404));
	}

	res.status(204).json({ status: "success", data: { user: null } });
});

const updateUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
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
