import { model, Schema, Types } from "mongoose";
import Tour from "./tourModel.js";

const reviewSchema = new Schema(
	{
		review: {
			type: String,
			required: [true, "A review cannot be empty"],
		},
		rating: {
			type: Number,
			required: [true, "A review must have ratings"],
			min: [1, "Rating must be equal or above 1.00"],
			max: [5, "Rating must be below or equal to 5.00"],
		},
		tour: {
			type: Types.ObjectId,
			ref: "Tour",
			required: [true, "Review must belong to a tour"],
		},
		user: {
			type: Types.ObjectId,
			ref: "User",
			required: [true, "Review must belong to a user"],
		},
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// * QUERY MIDDLEWARE
reviewSchema.pre(/^find/, function (next) {
	this.populate({
		path: "user",
		select: "name photo",
	});
	next();
});

// * STATIC METHODS
reviewSchema.statics.calcAverageRatings = async function (tourId) {
	const stats = await this.aggregate([
		{ $match: { tour: tourId } },
		{
			$group: {
				_id: `$tour`,
				numRating: { $sum: 1 },
				avgRating: { $avg: "$rating" },
			},
		},
	]);

	if (stats.length) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingQuantity: stats[0].numRating,
			ratingAverage: stats[0].avgRating,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingQuantity: 0,
			ratingAverage: 4.5,
		});
	}
};

// * DOCUMENT MIDDLEWARE
reviewSchema.post("save", function () {
	this.constructor.calcAverageRatings(this.tour);
});

// * QUERY MIDDLEWARE
// reviewSchema.pre(/^findOneAnd/, async function (next) {
// 	const review = await this.findOne({});
// 	console.log(review);
// 	next();
// });

// reviewSchema.post(/^findOneAnd/, async function () {
// 	this.constructor.calcAverageRatings();
// });

const Review = model("Review", reviewSchema);

export default Review;
