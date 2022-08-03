const User = require("../models/user");

module.exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await new User({ email, username });
    const registerdUser = await User.register(user, password);

    //to auto login after register
    req.login(registerdUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelpcamp!");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back!");
  console.log("Login URL: ", req.session.returnTo, req.originalUrl, req.path);
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out!");
    res.redirect("/campgrounds");
  });
};
