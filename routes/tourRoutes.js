import { Router } from "express";
import tourController from "../controllers/tourController.js";
import tourMiddleware from "../middlewares/tourMiddleware.js";

const router = Router();

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
	.route("/top-5-cheap")
	.get(tourMiddleware.aliasTopTours, tourController.getTours);

router.route("/").get(tourController.getTours).post(tourController.createTour);

router
	.route("/:id")
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour);

export default router;
