const Review = require("../models/reviews");
const Campground = require("../models/campground");

module.exports.createReview = async (req, res) => {
  if (!req.body.review.body) throw new ExpressError("Invalid Data", 400);
  const { id } = req.params;
  const review = new Review(req.body.review);
  review.author = req.user._id;
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Successfully Added a Review!!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Successfully Deleted Review!");
  res.redirect(`/campgrounds/${id}`);
};
