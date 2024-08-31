import _ from "lodash";

const filterUserBody = (req, res, next) => {
	if (req.body.password || req.body.confirmPassword) {
		const message =
			"This is route is not for password update. Please use /updatePassword";
		return next(new AppError(message, 400));
	}

	req.body = _.pick(req.body, ["name", "email"]);
	next();
};

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

export default {
	filterUserBody,
	getMe,
};
