import { Schema, Types, model } from "mongoose";
import slugify from "slugify";

// * TOUR SCHEMA
const tourSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "A tour must have a name"],
			unique: true,
			trim: true,
			maxLength: [50, "A tour name must have less or equal than 50 characters"],
			minLength: [10, "A tour name must have more or equal than 10 characters"],
		},
		duration: {
			type: Number,
			required: [true, "A tour must have a duration"],
		},
		maxGroupSize: {
			type: Number,
			required: [true, "A tour must have a group size"],
		},
		difficulty: {
			type: String,
			required: [true, "A tour must have a difficulty"],
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "Difficulty is either: easy, medium, or difficult",
			},
		},
		rating: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be more or equal than 1.0"],
			max: [5, "Rating must be less or equal than 5.0"],
		},
		ratingAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be more or equal than 1.0"],
			max: [5, "Rating must be less or equal than 5.0"],
		},
		ratingQuantity: {
			type: Number,
			required: [true, "A tour must have a rating quantity"],
		},
		price: {
			type: Number,
			required: [true, "A tour must have a price"],
		},
		priceDiscount: {
			type: Number,
			validate: {
				validator(value) {
					return value <= this.price;
				},
				message: "Discount price ({VALUE}) should be below the regular price",
			},
		},
		summary: {
			type: String,
			trim: true,
			required: [true, "A tour must have a description"],
		},
		description: {
			type: String,
			trim: true,
		},
		coverImage: {
			type: String,
			required: [true, "A tour must have a cover image"],
		},
		images: [String],
		startDates: [Date],
		slug: String,
		secretTour: {
			type: Boolean,
			default: false,
		},
		startLocation: {
			type: {
				type: String,
				enum: ["Point"],
				default: "Point",
			},
			coordinates: [Number],
			address: String,
			description: String,
		},
		locations: [
			{
				type: {
					type: String,
					default: "Point",
					enum: ["Point"],
				},
				coordinates: [Number],
				address: String,
				description: String,
				day: Number,
			},
		],
		guides: [
			{
				type: Types.ObjectId,
				ref: "User",
			},
		],
	},
	{ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// * VIRTUAL PROPERTIES
tourSchema.virtual("durationWeeks").get(function () {
	return +(this.duration / 7).toFixed(2);
});

tourSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

// * DOCUMENT MIDDLEWARE
tourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
});

// * QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
	this.find({ secretTour: { $ne: true } }).populate({
		path: "guides",
		select: "-__v -passwordChangedAt",
	});
	this.start = Date.now();
	next();
});

// * AGGREGATION MIDDLEWARE
tourSchema.pre("aggregate", function (next) {
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

// * TOUR MODEL
const Tour = model("Tour", tourSchema);

export default Tour;
