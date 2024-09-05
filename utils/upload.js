import multer from "multer";

const upload = multer({
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
});

export default upload;
