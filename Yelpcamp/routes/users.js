const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const user = require("../controllers/user");

router
  .route("/register")
  .get((req, res) => {
    res.render("users/register");
  })
  .post(catchAsync(user.createUser));

router
  .route("/login")
  .get((req, res) => {
    res.render("users/login");
  })
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    user.loginUser
  );

router.get("/logout", user.logoutUser);

module.exports = router;
