import mongoose from "mongoose";

const connectionDb = async () => {
	const DB = process.env.DB_CONNECTION_GLOBAL.replace(
		"<password>",
		process.env.DB_PASSWORD
	);
	try {
		await mongoose.connect(DB);
		console.log("MongoDb connected successfully!");
	} catch (error) {
		throw new Error(error.message);
	}
};

export default connectionDb;
