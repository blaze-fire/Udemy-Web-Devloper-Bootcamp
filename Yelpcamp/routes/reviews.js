const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/reviews");
const ExpressError = require("../utils/ExpressError");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

// route to link reviews with campground user
router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
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
  })
);

//delete a review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, async (req, res) => {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Successfully Deleted Review!");
  res.redirect(`/campgrounds/${id}`);
});

module.exports = router;
