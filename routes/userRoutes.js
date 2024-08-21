import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.route("/").get(userController.getUsers).post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

export default router;
