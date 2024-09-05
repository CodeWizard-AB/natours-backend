import _ from "lodash";
import AppError from "../utils/appError.js";
import upload from "../utils/upload.js";

const filterUserBody = (req, res, next) => {
	if (req.body.password || req.body.confirmPassword) {
		const message =
			"This is route is not for password update. Please use /updatePassword";
		return next(new AppError(message, 400));
	}

	req.body = _.pick(req.body, ["name", "email", "photo"]);
	if (req.file) req.body.photo = req.file.originalname;

	console.log(req.file);

	next();
};

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

const uploadAvatar = upload.single("photo");

export default {
	filterUserBody,
	uploadAvatar,
	getMe,
};
