const createError = require("http-errors");

const authValidate = (req, res, next) => {
  const { email, password, zaloId } = req.body;
  if (!email && !zaloId) {
    return next(createError.BadRequest("Username is required"));
  }
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError.BadRequest("Invalid email format"));
    }
  }
  if (zaloId) {
    const zaloIdRegex = /^[a-zA-Z0-9]+$/;
    if (!zaloIdRegex.test(zaloId)) {
      return next(
        createError.BadRequest("Invalid user name")
      );
    }
  }
  if (!password || password.length < 6) {
    return next(
      createError.BadRequest("Password must be at least 6 characters long")
    );
  }
  next();
};

module.exports = authValidate;
