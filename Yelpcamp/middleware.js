const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    //to store url they are requesting
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in");
    return res.redirect("/login");
  }
  next();
};

module.exports = isLoggedIn;
