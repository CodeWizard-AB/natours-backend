import multer from "multer";
import AppError from "./appError.js";
import _ from "lodash";

const filterUserBody = (req, res, next) => {
	if (req.body.password || req.body.confirmPassword) {
		const message =
			"This is route is not for password update. Please use /updatePassword";
		return next(new AppError(message, 400));
	}

	req.body = _.pick(req.body, ["name", "email", "photo"]);
	if (req.file) req.body.photo = req.file.originalname;
	console.log(req.body, req.file);
	next();
};

const getMe = (req, res, next) => {
	req.params.id = req.user.id;
	next();
};

const uploadPhoto = multer({
	storage: multer.diskStorage({
		destination(req, file, cb) {
			cb(null, "./public/img/users");
		},
		filename(req, file, cb) {
			const ext = file.mimetype.split("/").at(-1);
			cb(null, `user-${req.user._id}-${Date.now()}.${ext}`);
		},
	}),
	fileFilter(req, file, cb) {
		if (file.mimetype.startsWith("image")) {
			cb(null, true);
		} else {
			const message = "Not an image! Please upload only images.";
			cb(new AppError(message, 400), false);
		}
	},
}).single("photo");

export default {
	filterUserBody,
	uploadPhoto,
	getMe,
};
