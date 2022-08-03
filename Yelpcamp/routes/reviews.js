const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const review = require("../controllers/review");

// route to link reviews with campground user
router.post("/", validateReview, isLoggedIn, catchAsync(review.createReview));

//delete a review
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, review.deleteReview);

module.exports = router;
