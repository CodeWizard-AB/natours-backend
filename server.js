import dotenv from "dotenv";

// * SYNCHRONOUS ERROR HANDLER
process.on("uncaughtException", (err) => {
	console.log("UNCAUGHT EXCEPTION! SHUTTING DOWN");
	console.log(err.message);
	process.exit(1);
});

import app from "./app.js";
import connectionDb from "./config/db.js";
dotenv.config({ path: "./.env" });

// * DATABASE
connectionDb();

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
