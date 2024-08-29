import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import rateLimit from "express-rate-limit";
import AppError from "./utils/appError.js";
import { xss } from "express-xss-sanitizer";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import mongoSanitize from "express-mongo-sanitize";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import hpp from "hpp";

// * APP
const app = express();

// * APP MIDDLEWARE
const limiter = rateLimit({
	limit: 100,
	windowMs: 60 * 60 * 1000,
	message: "Too many requests from this IP, please try again in an hour!",
});

app.use(
	hpp({
		whitelist: [
			"duration",
			"ratingQuantity",
			"ratingAverage",
			"price",
			"maxGroupSize",
			"difficulty",
		],
	})
); // * PREVENT PARAMETERS POLLUTION
app.use(xss()); // * CROSS SITE ATTACK PREVENTION
app.use(helmet()); // * HEADER SECURITY
app.use(cors()); // * CROSS-ORIGIN REQUEST
app.use(express.json({ limit: "10kb" })); // * BODY PARSER
app.use(mongoSanitize()); // * DATA SANITIZATION QUERY
app.use("/api", limiter); // * REQUEST RATE LIMIT
app.use(express.static("./public")); // * STATIC FOLDER

if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}

// * APP ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// * NOT FOUND ROUTE HANDLER
app.all("*", (req, res, next) => {
	const err = `Can't find ${req.originalUrl} on this server`;
	next(new AppError(err, 404));
});

// * GLOBAL ERROR MIDDLEWARE
app.use(errorMiddleware.globalError);

export default app;
