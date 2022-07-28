const express = require('express');
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { campgroundSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
      const msg = error.details.map(el => el.message).join('.');
      throw new ExpressError(msg, 400);
    }
    else {
      next();
    }
  }

router.get(
    "/",
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render("campgrounds/index", { campgrounds });
    })
  );
 
  //new campground
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  //create a campground
  router.post(
    "/",
    validateCampground,
    catchAsync(async (req, res) => {
      // if (!req.body.campground) throw new ExpressError("Invalid Data", 400);
      const campground = new Campground(req.body.campground);
      await campground.save();
      req.flash('success', 'Successfully made a new Campground!')
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  //show single campground
  router.get(
    "/:id",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id).populate('reviews');
      if(!campground){
        req.flash('error', 'Cannot find that Campground!');
        res.redirect('/campgrounds');
      }
      res.render("campgrounds/show", { campground });
    })
  );
  
  //edit campground
  router.get(
    "/:id/edit",
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      if(!campground){
        req.flash('error', 'Cannot find that Campground!');
        res.redirect('/campgrounds');
      }
      res.render("campgrounds/edit", { campground });
    })
  );
  
  router.put(
    "/:id",
    validateCampground,
    catchAsync(async (req, res) => {
      const { id } = req.params;
      const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
      });
      req.flash('success', 'Successfully Updated!!')
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  //delete campground
  router.delete(
    "/:id",
    catchAsync(async (req, res) => {
      const { id } = req.params;
      await Campground.findByIdAndDelete(id);
      req.flash('success', 'Successfully Deleted Campground!');
      res.redirect("/campgrounds");
    })
  );

  module.exports = router;