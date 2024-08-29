import _ from "lodash";
import Review from "../models/reviewModel.js";
import ApiFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import factoryController from "./factoryController.js";

const getReviews = catchAsync(async (req, res) => {
	const feature = new ApiFeature(Review.find(), req.query)
		.filter()
		.sort()
		.select()
		.paginate();
	const reviews = await feature.query;

	res
		.status(200)
		.json({ status: "success", result: reviews.length, data: { reviews } });
});

const createReview = catchAsync(async (req, res, next) => {
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;

	const review = await Review.create(req.body);
	res.status(201).json({ status: "success", data: { review } });
});

const getReview = factoryController.getOne(Review);
const updateReview = factoryController.updateOne(Review);
const deleteReview = factoryController.deleteOne(Review);

export default {
	getReview,
	getReviews,
	deleteReview,
	updateReview,
	createReview,
};
