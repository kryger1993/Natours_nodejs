const Review = require('../models/review-model');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handler-factory');

exports.setTourUserIds = (req, res, next) => {
  req.body.tour = req.body.tour ? req.body.tour : req.params.id;
  req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
