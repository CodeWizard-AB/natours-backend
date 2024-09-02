const setTourUserIds = (req, res, next) => {
	console.log(req.params, req.user)
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user._id;
	next();
};

export default { setTourUserIds };
