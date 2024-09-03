import { Router } from "express";
import reviewController from "../controllers/reviewController.js";
import authController from "../controllers/authController.js";
import reviewMiddleware from "../middlewares/reviewMiddleware.js";

const router = Router({ mergeParams: true });

// router.use(authController.verifyToken);

router
	.route("/")
	.get(reviewController.getReviews)
	.post(
		authController.verifyPerson("user"),
		reviewMiddleware.setTourUserIds,
		reviewController.createReview
	);

router
	.route("/:id")
	.get(reviewController.getReview)
	.all(authController.verifyPerson("user", "admin"))
	.delete(reviewController.deleteReview)
	.patch(reviewController.updateReview);

export default router;
