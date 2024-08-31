import _ from "lodash";
import Review from "../models/reviewModel.js";
import factoryController from "./factoryController.js";

const getReviews = factoryController.getAll(Review);
const createReview = factoryController.createOne(Review);
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
