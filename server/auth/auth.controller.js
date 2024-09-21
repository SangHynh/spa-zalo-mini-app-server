const createError = require("http-errors");
const Account = require("../models/account.model");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../configs/jwt.config");
const redis = require("../configs/redis.config");

const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const doesExist = await Account.findOne({ email: email });
    if (doesExist) {
      throw createError.Conflict(`${email} is already registered`);
    }
    const account = new Account({
      email,
      password,
    });
    const savedAccount = await account.save();
    const accessToken = await signAccessToken(savedAccount.id);
    const refreshToken = await signRefreshToken(savedAccount.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email: email });
    if (!account) throw createError.NotFound("Account not registered");
    const isMatch = await account.isValidPassword(password);
    if (!isMatch) throw createError.Unauthorized("Invalid email or password");
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
    redis.DEL(userId).then((result) => {
      res.sendStatus(204); 
    }).catch((err) => {
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
