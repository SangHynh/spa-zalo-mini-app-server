const createError = require("http-errors");

const authValidate = (req, res, next) => {
  const { email, password, zaloAccessToken, role } = req.body;

  // Kiểm tra vai trò và yêu cầu thông tin đăng nhập tương ứng
  if (role === "user") {
    // Người dùng chỉ cần zaloId
    if (!zaloAccessToken) {
      return next(createError.BadRequest("Token is required"));
    }
/*     const zaloIdRegex = /^[a-zA-Z0-9]+$/;
    if (!zaloIdRegex.test(zaloId)) {
      return next(createError.BadRequest("Invalid Zalo ID format"));
    } */
  } else if (role === "admin") {
    // Admin yêu cầu email và mật khẩu
    if (!email) {
      return next(createError.BadRequest("Email is required"));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(createError.BadRequest("Invalid email format"));
    }

    if (!password || password.length < 6) {
      return next(createError.BadRequest("Password must be at least 6 characters long"));
    }
  } else {
    // Nếu vai trò không hợp lệ
    return next(createError.BadRequest("Invalid role"));
  }

  next();
};

module.exports = authValidate;
