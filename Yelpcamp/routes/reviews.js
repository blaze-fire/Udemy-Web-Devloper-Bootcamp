const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { reviewSchema } = require("../schema");
const Review = require("../models/reviews")
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join('.');
      throw new ExpressError(msg, 400);
    }
    else {
      next();
    }
  }
  
// route to link reviews with campground user
router.post('/', validateReview, catchAsync(async (req, res) => {
    if (!req.body.review.body) throw new ExpressError("Invalid Data", 400);
    const { id } = req.params;
    const review = new Review(req.body.review);
    const campground = await Campground.findById(id);
    campground.reviews.push(review);
    await review.save()
    await campground.save();
    req.flash('success', 'Successfully Added a Review!!')
    res.redirect(`/campgrounds/${id}`);
  }));
  
  //delete a review
  router.delete('/:reviewId', async(req, res) => {
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash('success', 'Successfully Deleted Review!')
    res.redirect(`/campgrounds/${id}`);
  })

  module.exports = router;