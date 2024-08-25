import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.route("/").get(userController.getUsers).post(userController.createUser);

router
	.route("/:id")
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(
		authController.verifyToken,
		authController.verifyPerson("admin", "lead-guide"),
		userController.deleteUser
	);

export default router;
