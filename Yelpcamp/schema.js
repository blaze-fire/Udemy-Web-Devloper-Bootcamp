const Joi = require("joi");
const ExpressError = require("./utils/ExpressError");

const validateSchema = (req, res, next) => {
  const campgroundsSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      description: Joi.string().required(),
    }).required(),
  });

  const { error } = campgroundsSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(".");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports = validateSchema;
