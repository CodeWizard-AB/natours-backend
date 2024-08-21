import morgan from "morgan";
import express from "express";
import AppError from "./utils/appError.js";
import tourRouter from "./routes/tourRoutes.js";
import userRouter from "./routes/userRoutes.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// * APP
const app = express();

// * APP MIDDLEWARE
app.use(express.json());
app.use(express.static("./public"));

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
