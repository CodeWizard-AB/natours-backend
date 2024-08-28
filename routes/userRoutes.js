import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);
router.patch(
	"/updatePassword",
	authController.verifyToken,
	authController.updatePassword
);

router.route("/").get(userController.getUsers).post(userController.createUser);

router
	.route("/:id")
	.all(authController.verifyToken)
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(
		authController.verifyPerson("admin", "lead-guide", "user"),
		userController.deleteUser
	);

export default router;
