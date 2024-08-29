import { Router } from "express";
import reviewController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";
import reviewMiddleware from "../middlewares/reviewMiddleware.js";

const router = Router({ mergeParams: true });

router
	.route("/")
	.get(reviewController.getReviews)
	.post(
		authController.verifyToken,
		authController.verifyPerson("user"),
		reviewMiddleware.setTourUserIds,
		reviewController.createReview
	);

router
	.route("/:id")
	.all(authController.verifyToken)
	.get(reviewController.getReview)
	.delete(reviewController.deleteReview)
	.patch(authController.verifyPerson("user"), reviewController.updateReview);

export default router;
