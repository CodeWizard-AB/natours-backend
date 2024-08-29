import { model, Schema, Types } from "mongoose";

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

const Review = model("Review", reviewSchema);

export default Review;
