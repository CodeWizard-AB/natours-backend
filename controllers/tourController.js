import Tour from "../models/tourModel.js";
import ApiFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const getTours = catchAsync(async (req, res) => {
	const features = new ApiFeature(Tour.find(), req.query)
		.filter()
		.sort()
		.select()
		.paginate();
	const tours = await features.query;

	res.status(200).json({
		status: "success",
		results: tours.length,
		data: { tours },
	});
});

const createTour = catchAsync(async (req, res) => {
	const newTour = await Tour.create(req.body);
	res.status(201).json({ status: "success", data: { tour: newTour } });
});

const getTour = catchAsync(async (req, res, next) => {
	const selectedTour = await Tour.findById(req.params.id);

	if (!selectedTour) {
		const err = "No tour found with that ID";
		return next(new AppError(err, 404));
	}

	res.status(200).json({ status: "success", data: { tour: selectedTour } });
});

const updateTour = catchAsync(async (req, res, next) => {
	const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!updateTour) {
		const err = "No tour found with that ID";
		return next(new AppError(err, 404));
	}

	res.status(200).json({ status: "success", data: { tour: updatedTour } });
});

const deleteTour = catchAsync(async (req, res, next) => {
	const deletedTour = await Tour.findByIdAndDelete(req.params.id);

	if (!deletedTour) {
		const err = "No tour found with that ID";
		return next(new AppError(err, 404));
	}

	res.status(204).json({ status: "success", data: { tour: null } });
});

const getTourStats = catchAsync(async (req, res) => {
	const stats = await Tour.aggregate([
		{ $match: { ratingAverage: { $gte: 4.5 } } },
		{
			$group: {
				_id: "$difficulty",
				numRatings: { $sum: "$ratingQuantity" },
				numTours: { $sum: 1 },
				avgRating: { $avg: "$ratingAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{ $sort: { avgPrice: 1 } },
		{ $match: { _id: { $ne: "easy" } } },
	]);
	res.status(200).json({
		status: "success",
		data: { stats },
	});
});

const getMonthlyPlan = catchAsync(async (req, res) => {
	const year = req.params.year;
	const plan = await Tour.aggregate([
		{ $unwind: "$startDates" },
		{
			$match: {
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				_id: { $month: "$startDates" },
				numTourStarts: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{ $addFields: { month: "$_id" } },
		{ $project: { _id: 0 } },
		{ $sort: { numTourStarts: -1 } },
		{ $limit: 12 },
	]);

	res
		.status(200)
		.json({ status: "success", results: plan.length, data: { tours: plan } });
});

export default {
	getTours,
	getTour,
	updateTour,
	createTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
};
