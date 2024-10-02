const axios = require("axios");
const crypto = require("crypto");
const { create } = require("../models/admin.model");
require("dotenv").config();
const createError = require("http-errors");

/* Hàm này để xác thực token Zalo có hợp lệ không */
const zaloService = async (accessToken) => {

  // Hàm tính toán appsecret_proof
  const calculateHMacSHA256 = (data, secretKey) => {
    const hmac = crypto.createHmac("sha256", secretKey);
    hmac.update(data);
    return hmac.digest("hex");
  };

  // Cấu hình yêu cầu
  const options = {
    url: "https://graph.zalo.me/v2.0/me",
    method: "GET",
    headers: {
      access_token: accessToken,
      appsecret_proof: calculateHMacSHA256(
        accessToken,
        process.env.ZALO_APP_SECRET_KEY
      ),
    },
    params: {
      fields: "id,name,birthday,picture",
    },
  };

  try {
    const response = await axios(options);
    return response.data;
  } catch (error) {
    console.error(error);
    
  }
};

module.exports = zaloService;
