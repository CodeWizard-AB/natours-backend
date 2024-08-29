import { Router } from "express";
import tourController from "../controllers/tourController.js";
import tourMiddleware from "../middlewares/tourMiddleware.js";
import authController from "../controllers/authController.js";
import reviewRouter from "../routes/reviewRoutes.js";

const router = Router();

router.use("/:tourId/reviews", reviewRouter);

router.route("/tour-stats").get(tourController.getTourStats);
router.route("/monthly-plan/:year").get(tourController.getMonthlyPlan);

router
	.route("/top-5-cheap")
	.get(tourMiddleware.aliasTopTours, tourController.getTours);

router
	.route("/")
	.get(tourController.getTours)
	.post(
		authController.verifyToken,
		authController.verifyPerson("admin"),
		tourController.createTour
	);

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
