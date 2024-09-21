const createError = require('http-errors');

const authValidate = (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(createError.BadRequest('Email and password are required'));
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(createError.BadRequest('Invalid email format'));
    }
    if (password.length < 6) {
        return next(createError.BadRequest('Password must be at least 6 characters long'));
    }
    next();
};

module.exports = authValidate;
