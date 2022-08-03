const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ email, username });
      const registerdUser = await User.register(user, password);
      
      //to auto login after register
      req.login(registerdUser, err => {
        if(err) return next(err);
        req.flash("success", "Welcome to Yelpcamp!");
        res.redirect("/campgrounds");
      })

    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }

  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    console.log("Login URL: ", req.session.returnTo, req.originalUrl, req.path)
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
  });
});

module.exports = router;
