import ApiFeature from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const getAll = (Model) => {
	return catchAsync(async (req, res, next) => {
		let filter = {};
		if (req.params.tourId) filter = { tour: req.params.tourId };
		const feature = new ApiFeature(Model.find(filter), req.query)
			.filter()
			.sort()
			.select()
			.paginate();
		const documents = await feature.query;

		res.status(200).json({
			status: "success",
			result: documents.length,
			data: { data: documents },
		});
	});
};

const createOne = (Model) => {
	return catchAsync(async (req, res) => {
		console.log(req.body);
		const document = await Model.create(req.body);
		res.status(201).json({
			status: "success",
			data: { data: document },
		});
	});
};

const getOne = (Model, popOptions) => {
	return catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const document = await query;

		if (!document) {
			const err = "No document found with that ID";
			return next(new AppError(err, 404));
		}

		res.status(200).json({
			status: "success",
			data: { data: ddocument },
		});
	});
};

const updateOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		if (!document) {
			const err = "No document found with that ID";
			return next(new AppError(err, 404));
		}

		res.status(200).json({
			status: "success",
			data: { data: document },
		});
	});
};

const deleteOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const document = await Model.findByIdAndDelete(req.params.id);

		if (!document) {
			const err = "No document found with that ID";
			return next(new AppError(err, 404));
		}

		res.status(204).json({
			status: "success",
			data: { data: document },
		});
	});
};

export default {
	updateOne,
	deleteOne,
	getOne,
	createOne,
	getAll,
};
