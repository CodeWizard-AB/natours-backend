import { Router } from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";
import userMiddleware from "../middlewares/userMiddleware.js";

const router = Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.verifyToken);

router.patch("/updatePassword", authController.updatePassword);
router.get("/me", userMiddleware.getMe, userController.getUser);
router.delete("/deleteMe", userMiddleware.getMe, userController.deleteUser);
router.patch(
	"/updateMe",
	userMiddleware.getMe,
	userMiddleware.filterUserBody,
	userController.updateUser
);

router.use(authController.verifyPerson("admin"));

router
	.route("/")
	.get(userController.getUsers)
	.post(userController.createUser)
	.patch(userController.updateUser);

export default router;
