import { Router } from "express";
import reviewController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";

const router = Router({ mergeParams: true });

router
	.route("/")
	.get(reviewController.getReviews)
	.post(
		authController.verifyToken,
		authController.verifyPerson("user"),
		reviewController.createReview
	);

router
	.route("/:id")
	.all(authController.verifyToken)
	.get(reviewController.getReview)
	.delete(reviewController.deleteReview)
	.patch(authController.verifyPerson("user"), reviewController.updateReview);

export default router;
