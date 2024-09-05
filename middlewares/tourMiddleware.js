import upload from "../utils/upload.js";

const aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price,-ratingAverage";
	req.query.fields = "name,price,ratingAverage,summary,difficulty";
	next();
};

const uploadTourImages = upload.fields([
	{ name: "coverImage", maxCount: 1 },
	{ name: "images", maxCount: 3 },
]);

export default {
	aliasTopTours,
	uploadTourImages,
};
