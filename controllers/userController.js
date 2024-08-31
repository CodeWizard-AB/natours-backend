import User from "../models/userModel.js";
import factoryController from "./factoryController.js";

const getUsers = factoryController.getAll(User);
const getUser = factoryController.getOne(User);
const createUser = factoryController.createOne(User);
const deleteUser = factoryController.deleteOne(User);
const updateUser = factoryController.updateOne(User);

export default {
	getUsers,
	getUser,
	createUser,
	updateUser,
	deleteUser,
};
