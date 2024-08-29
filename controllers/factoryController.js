import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";

const createOne = (Model) => {
	return catchAsync(async (req, res) => {
		const document = await Tour.create(req.body);
		res.status(201).json({
			status: "success",
			data: { [`${Model}`.toLowerCase()]: document },
		});
	});
};

const getOne = (Model) => {
	return catchAsync(async (req, res, next) => {
		const document = await Model.findById(req.params.id);

		if (!document) {
			const message = "No document found with that ID";
			return next(new AppError(message, 404));
		}

		res.status(200).json({
			status: "success",
			data: { [`${Model}`.toLowerCase()]: document },
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
			data: { [`${Model}`.toLowerCase()]: document },
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
			data: { [`${Model}`.toLowerCase()]: document },
		});
	});
};

export default {
	updateOne,
	deleteOne,
	getOne,
	createOne,
};
