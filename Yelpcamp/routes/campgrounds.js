const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const campgrounds = require("../controllers/campground");

// Using router routes express

//show and create a campground
router.route("/")
      .get(catchAsync(campgrounds.index))
      .post(isLoggedIn,validateCampground,catchAsync(campgrounds.createCampground));

      //new campground
router.get("/new", isLoggedIn, campgrounds.newCampground);


router.route('/:id')
      .get(catchAsync(campgrounds.showCampground))       //show single campground
      .put(validateCampground,isAuthor,catchAsync(campgrounds.editCampground))
      .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));        //delete campground

router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.editForm))        //edit campground

module.exports = router;
