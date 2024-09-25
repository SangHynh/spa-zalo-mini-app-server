const createError = require("http-errors");
const Account = require("../models/account.model");
const User = require("../models/user.model");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../configs/jwt.config");
const redis = require("../configs/redis.config");

const register = async (req, res, next) => {
  try {
    const { email, zaloId, password, role, name, urlImage } = req.body;
    // Kiểm tra role không khớp
    if (!role || !["admin", "user"].includes(role)) {
      throw createError.BadRequest("Invalid role");
    }
    // Kiểm tra xem email hoặc zaloId có bị trùng lặp không
    if (role === "admin" && email) {
      const doesExist = await Account.findOne({ email });
      if (doesExist) {
        throw createError.Conflict(`Account is already registered`);
      }
    } else if (role === "user" && zaloId) {
      const doesExist = await Account.findOne({ zaloId });
      if (doesExist) {
        throw createError.Conflict(`Account is already registered`);
      }
    } else {
      //Lỗi sai vai trò với email hoặc zaloId
      throw createError.BadRequest("Invalid role");
    }
    // Tạo tài khoản mới tùy theo role
    let accountData = { role };
    if (role === "admin") {
      accountData.email = email;
      accountData.password = password; // Mật khẩu sẽ được hash ở schema trước khi lưu
    } else if (role === "user") {
      accountData.zaloId = zaloId;
    }
    // Lưu tài khoản
    const account = new Account(accountData);
    const savedAccount = await account.save();
    // Tạo hồ sơ người dùng cho user
    if (role === "user") {
      const userProfile = new User({
        accountId: savedAccount._id,
        name,
        urlImage,
        membershipTier: "Member", // Giá trị mặc định,
        referralCode: "ABC123",
      });
      await userProfile.save();
    }
    // Tạo token sau khi tài khoản được lưu thành công
    const accessToken = await signAccessToken(savedAccount.id);
    const refreshToken = await signRefreshToken(savedAccount.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, zaloId, password } = req.body;

    let account;
    if (email) {
      account = await Account.findOne({ email });
    } else if (zaloId) {
      account = await Account.findOne({ zaloId });
    }

    //chưa đăng ký tài khoản
    if (!account) throw createError.NotFound("Invalid username or password");

    // Nếu tài khoản là admin, kiểm tra mật khẩu
    if (account.role === "admin") {
      const isMatch = await account.isValidPassword(password);
      if (!isMatch)
        throw createError.Unauthorized("Invalid username or password");
    }

    const accessToken = await signAccessToken(account.id);
    const refreshToken = await signRefreshToken(account.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({ accessToken: accessToken, refreshToken: refToken });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);
    redis
      .DEL(userId)
      .then((result) => {
        res.sendStatus(204);
      })
      .catch(() => {
        next(createError.InternalServerError());
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
};
