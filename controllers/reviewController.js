import Review from "../models/reviewModel.js";
import ApiFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

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

const getReview = catchAsync(async (req, res, next) => {
	const review = await Review.findById(req.params.id);

	if (!review) {
		const message = "No review found with that ID";
		return next(new AppError(message, 404));
	}

	res.status(200).json({ status: "success", data: { review } });
});

const createReview = catchAsync(async (req, res, next) => {
	const review = await Review.create(req.body);

	res.status(201).json({ status: "success", data: { review } });
});

const updateReview = catchAsync(async (req, res, next) => {
	const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({ status: "success", data: { review } });
});

const deleteReview = catchAsync(async (req, res, next) => {});

export default {
	getReview,
	getReviews,
	deleteReview,
	updateReview,
	createReview,
};
