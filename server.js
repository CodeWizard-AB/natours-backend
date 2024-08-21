import dotenv from "dotenv";
import mongoose from "mongoose";

// * SYNCHRONOUS ERROR HANDLER 
process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
	console.log(err.message);
	process.exit(1);
});

import app from "./app.js";
dotenv.config({ path: "./.env" });

// * DATABASE
(async () => {
	const DB = process.env.DB_CONNECTION_GLOBAL.replace(
		"<password>",
		process.env.DB_PASSWORD
	);
	await mongoose.connect(DB);
	console.log("MongoDb connected successfully!");
})();

// * APP LISTEN
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log("App running on port", port);
});

// * ASYNCHRONOUS ERROR HANDLER
process.on("unhandledRejection", (err) => {
	console.log("UNHANDLED REJECTTION! SHUTTING DOWN");
	console.log(err.message);
	server.close(() => {
		process.exit(1);
	});
});
