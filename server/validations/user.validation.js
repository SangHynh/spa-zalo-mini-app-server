const { body, validationResult } = require("express-validator");

const validateUpdateUserInfo = [
  body("name")
    .optional() // Trường này có thể không có
    .isString()
    .withMessage("Name must be a string")
    .not()
    .isEmpty()
    .withMessage("Name cannot be empty")
    .matches(/^[^\d`!@#$%^&*()_+={}\[\]:;"'<>,.?~\\|]+$/u)
    .withMessage("Name cannot contain numbers or special characters"),

  body("phone")
    .optional() // Trường này có thể không có
    .isString()
    .withMessage("Phone must be a string")
    .not()
    .isEmpty()
    .withMessage("Phone cannot be empty")
    .matches(/^\d+$/)
    .withMessage("Phone must contain only numbers")
    .isLength({ min: 10, max: 15 })
    .withMessage("Phone number must be between 10 and 15 digits"),

  body("gender")
    .optional() // Trường này có thể không có
    .isIn(["male", "female"])
    .withMessage('Gender must be either "male" or "female"'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUpdateUserInfo };
