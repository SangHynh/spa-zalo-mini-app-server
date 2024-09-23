const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const redis = require("./redis.config");
const { convertToSeconds } = require("../utils/convertToSeconds");

module.exports = {
  //Tạo access token mới
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.ACCESS_TOKEN_SECRET;
      const options = {
        expiresIn: process.env.ACCESS_TOKEN_LIFETIME,
        audience: userId,
      };
      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  //Xác thực access token hợp lệ
  verifyAccessToken: (req, res, next) => {
    if (!req.headers["authorization"]) return next(createError.Unauthorized());
    const authHeader = req.headers["authorization"];
    const bearerToken = authHeader.split(" ");
    const token = bearerToken[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) {
        const message =
          err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
        return next(createError.Unauthorized(message));
      }
      req.payload = payload;
      next();
    });
  },

  //Tạo refresh token mới
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const payload = {};
      const secret = process.env.REFRESH_TOKEN_SECRET;
      const options = {
        expiresIn: process.env.REFRESH_TOKEN_LIFETIME,
        audience: userId,
      };

      JWT.sign(payload, secret, options, (err, token) => {
        if (err) {
          console.log(err.message);
          return reject(createError.InternalServerError());
        }
        // Lưu token vào Redis với thời gian sống
        redis.SET(
          userId,
          token,
          {
            EX: convertToSeconds(process.env.REFRESH_TOKEN_LIFETIME),
          },
          (err, res) => {
            if (err) {
              console.log(err);
              return reject(createError.InternalServerError());
            }
          }
        );
        resolve(token);
      });
    });
  },

  //Xác thực refresh token hợp lệ
  verifyRefreshToken: (refreshToken) => {
    return new Promise((resolve, reject) => {
      JWT.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError.Unauthorized("Invalid token"));
          const userId = payload.aud;
          // Tìm token trong redis để xem có hợp lệ không
          redis
            .GET(userId)
            .then((result) => {
              if (!result) {
                // token không tìm thấy trong redis (chưa được lưu, đăng xuất, bị xoá khỏi cachce)
                return reject(createError.Unauthorized("Token not found"));
              }
              if (refreshToken === result) {
                return resolve(userId);
              }
              // refresh token cũ bị thay thế bởi token mới nên không hợp lệ
              reject(createError.Unauthorized("Token is expired")); 
            })
            .catch((err) => {
              console.log(err.message);
              reject(createError.InternalServerError());
            });
        }
      );
    });
  },
};
