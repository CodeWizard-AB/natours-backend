import { Router } from "express";
import tourController from "../controllers/tourController.js";
import tourMiddleware from "../middlewares/tourMiddleware.js";
import authController from "../controllers/authController.js";

const router = Router();

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
	.route("/top-5-cheap")
	.get(tourMiddleware.aliasTopTours, tourController.getTours);

router
	.route("/")
	.all(authController.verifyToken)
	.get(tourController.getTours)
	.post(tourController.createTour);

router
	.route("/:id")
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(
		authController.verifyToken,
		authController.verifyPerson("admin", "lead-guide"),
		tourController.deleteTour
	);

export default router;
