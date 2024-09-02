import Tour from "../models/tourModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import factoryController from "./factoryController.js";

const getTours = factoryController.getAll(Tour);
const createTour = factoryController.createOne(Tour);
const updateTour = factoryController.updateOne(Tour);
const deleteTour = factoryController.deleteOne(Tour);
const getTour = factoryController.getOne(Tour, { path: "reviews" });

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

const getToursWithin = catchAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");
	const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		const message =
			"Please provide latitude and longitude in the format lat,lng";
		return next(new AppError(message, 400));
	}

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		status: "success",
		results: tours.length,
		data: { tours },
	});
});

const getDistances = catchAsync(async (req, res, next) => {
	const { latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");
	const multiplier = unit === "mi" ? 0.000621371 : 0.001;

	if (!lat || !lng) {
		const message =
			"Please provide latitude and longitude in the format lat,lng";
		return next(new AppError(message, 400));
	}

	const distances = await Tour.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [+lng, +lat],
				},
				distanceField: "distance",
				distanceMultiplier: multiplier,
			},
		},
		{ $project: { distance: 1, name: 1 } },
	]);

	res.status(200).json({
		status: "success",
		data: { data: distances },
	});
});

export default {
	getTours,
	getTour,
	updateTour,
	createTour,
	deleteTour,
	getTourStats,
	getMonthlyPlan,
	getToursWithin,
	getDistances,
};
