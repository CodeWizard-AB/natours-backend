import catchAsync from "../utils/catchAsync.js";

const setTourUserIds = catchAsync((req, res, next) => {
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
});

export default { setTourUserIds };
