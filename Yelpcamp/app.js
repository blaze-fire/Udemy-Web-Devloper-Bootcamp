const express = require("express");
const mongoose = require("mongoose");
const Campground = require("./models/campground");
const Review = require("./models/reviews")
const methodOvereide = require("method-override");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schema");


mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();
const path = require("path");
const campground = require("./models/campground");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOvereide("_method"));

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

app.get("/", (req, res) => {
  res.render("home");
});

//All campgrounds list
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get(
  "/makecampground",
  catchAsync(async (req, res) => {
    const camp = new campground({ title: "My home", description: "cool home" });
    await camp.save();
    res.send(camp);
  })
);

//new campground
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//create a campground
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//show single campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { campground });
  })
);

//edit campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//delete campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// route to link reviews with campground user
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  if (!req.body.review.body) throw new ExpressError("Invalid Data", 400);
  const { id } = req.params;
  const review = new Review(req.body.review);
  const campground = await Campground.findById(id);
  campground.reviews.push(review);
  console.log(campground);
  await review.save()
  await campground.save();
  res.redirect(`/campgrounds/${id}`);
}));

//delete a review
app.delete('/campgrounds/:campId/reviews/:reviewId', async(req, res) => {
  const {campId, reviewId} = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}});
  res.redirect(`/campgrounds/${campId}`);
})

//404 error
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Hello World");
});
