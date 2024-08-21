const aliasTopTours = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "price,-ratingAverage";
	req.query.fields = "name,price,ratingAverage,summary,difficulty";
	next();
};

export default {
	aliasTopTours,
};
