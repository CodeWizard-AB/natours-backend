import { Router } from "express";
import reviewController from "../controllers/reviewController.js";

const router = Router();

router
	.route("/")
	.get(reviewController.getReviews)
	.post(reviewController.createReview);

router
	.route("/:id")
	.get(reviewController.getReview)
	.delete(reviewController.deleteReview)
	.patch(reviewController.updateReview);

export default router;
