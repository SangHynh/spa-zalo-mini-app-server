const createError = require("http-errors");
const Admin = require("../models/admin.model");
const User = require("../models/user.model");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../configs/jwt.config");
const redis = require("../configs/redis.config");
const zaloService = require("../services/zalo.service");
const generateReferralCode = require("../utils/genReffCode");
const { getUserInfo } = require("../controllers/user.controller");

const register = async (req, res, next) => {
  try {
    const { role} = req.body;
    // Kiểm tra role không khớp
    if (!role || !["admin", "user"].includes(role)) {
      throw createError.BadRequest("Invalid role");
    }
    // Kiểm tra xem email hoặc zaloId có bị trùng lặp không
    if (role === "admin") {
      const { email, password} = req.body;
      if (!email || !password) {
        throw createError.BadRequest("Email and password are required");
      }
      const doesExist = await Admin.findOne({ email });
      if (doesExist) {
        throw createError.Conflict(`Admin is already registered`);
      }
      // Tạo tài khoản admin mới
      const newAdmin = new Admin({ email, password });
      const savedAdmin = await newAdmin.save();
      // Tạo access token và refresh token
      const accessToken = await signAccessToken(savedAdmin.id);
      const refreshToken = await signRefreshToken(savedAdmin.id);
      // Trả về kết quả đăng ký thành công
      return res.send({ accessToken, refreshToken });
    } else if (role === "user" ) {
      const { zaloAccessToken } = req.body;
      if (!zaloAccessToken) {
        throw createError.BadRequest("Zalo Access Token is required");
      }
      const data = await zaloService(zaloAccessToken)
        .then((data) => data)
        .catch((error) => {
          throw createError.BadRequest("Invalid Zalo Access Token");
        });
        console.log(data);
      const zaloId = data.id;
      const name = data?.name;
      const avatar = data?.picture?.data?.url;
      const doesExist = await User.findOne({ zaloId });
      if (doesExist) {
        throw createError.Conflict(`User is already registered`);
      }
      // Tạo hồ sơ người dùng cho user
      const user = new User({
        zaloId,
        name,
        avatar,
        membershipTier: "Member",
        referralCode: await generateReferralCode(zaloId),
        points: 0,
      });
      await user.save();
      const userProfile = {
        zaloId: user.zaloId,
        name: user.name,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
        referralCode: user.referralCode,
        points: user.points,
      };
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      return res.send({ userProfile, accessToken, refreshToken });
    } else {
      throw createError.BadRequest("Invalid role or missing required fields");
    }
  } catch (error) {
    console.log("Error:", error);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password, zaloAccessToken, role } = req.body;
    // Kiểm tra role hợp lệ trước khi thực hiện các thao tác khác
    if (!role || !["admin", "user"].includes(role)) {
      throw createError.BadRequest("Invalid role");
    }
    // Kiểm tra đăng nhập cho admin qua email
    if (role === "admin" && email) {
      const admin = await Admin.findOne({ email });
      if (!admin) throw createError.NotFound("Admin not found");
      // Kiểm tra mật khẩu
      const isMatch = await admin.isValidPassword(password);
      if (!isMatch)
        throw createError.Unauthorized("Invalid username or password");
      // Tạo access token và refresh token sau khi đăng nhập thành công
      const accessToken = await signAccessToken(admin.id);
      const refreshToken = await signRefreshToken(admin.id);
      return res.send({ accessToken, refreshToken });
    } else if (role === "user" && zaloAccessToken) {
      // Kiểm tra đăng nhập qua Zalo Access Token
      const data = await zaloService(zaloAccessToken)
        .then((data) => data)
        .catch((error) => {
          throw createError.BadRequest("Invalid Zalo Access Token");
        });
        
      const zaloId = data.id;
      const user = await User.findOne({ zaloId });

      if (!user) throw createError.NotFound("User not found");

      const userProfile = {
        zaloId: user.zaloId,
        name: user.name,
        avatar: user.avatar,
        membershipTier: user.membershipTier,
        referralCode: user.referralCode,
        points: user.points,
      };
      if (!user) throw createError.NotFound("User not found");
      // Tạo access token và refresh token sau khi đăng nhập thành công
      const accessToken = await signAccessToken(user.id);
      const refreshToken = await signRefreshToken(user.id);
      return res.send({ userProfile, accessToken, refreshToken });
    } else {
      throw createError.BadRequest("Invalid login information");
    }
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
