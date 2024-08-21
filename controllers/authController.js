import catchAsync from "../utils/catchAsync.js";
import User from "../models/userModel.js";

const signup = catchAsync(async (req, res) => {
	// const newUser = await User.create(req.body);

	// const user = new User();
	// const newUser = await user.save(req.body);

	res.status(201).json({
		status: "success",
		data: { user: newUser },
	});
});

const login = catchAsync(async (req, res) => {
	res.status(200).json({
		status: "success",
		data: { message: "login" },
	});
});

export default { signup, login };
