const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();
const createError = require("http-errors");
const { client } = require('zmp-openapi-nodejs');

/* Hàm này để xác thực Zalo access token có hợp lệ không */
const zaloTokenService = async (accessToken) => {

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
    return {
      status: response.status,
      data: response.data,
      accessToken: accessToken
    };
  } catch (error) {
    console.error("Zalo Service Error:", error.response ? error.response.data : error.message);
    throw createError.BadRequest("Invalid Zalo Access Token");
  }
  
};

// Hàm lấy thông tin số điện thoại qua phone token
const zaloPhoneService = async (phoneToken, zaloAccessToken) => {
  const secretKey = process.env.ZALO_APP_SECRET_KEY;

  const options = {
    url: "https://graph.zalo.me/v2.0/me/info",
    method: "GET",
    headers: {
      access_token: zaloAccessToken, 
      code: phoneToken,
      secret_key: secretKey,
    },
  };

  try {
    const response = await axios(options);
    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    console.error("Zalo Phone Service Error:", error.response ? error.response.data : error.message);
    throw createError.BadRequest("Invalid Zalo Phone Token");
  }
};

// Hàm tạo QR Code Short Link
const createQrCodeShortLink = async () => {
  const createQrCodeRequest = {
    miniAppId: process.env.ZALO_MINI_APP_ID || "",
    originUrl: `https://zalo.me/s/${process.env.ZALO_MINI_APP_ID}/?utm_source=zalo-qr&utm_medium=qr_code&utm_campaign=qr_code_short_link`,
  };

  try {
    const response = await client.createQrCodeShortUrl(createQrCodeRequest);
    console.log(response);
  } catch (error) {
    console.error("Create QR Code Error:", error.message);
  }
};

module.exports = {zaloTokenService, zaloPhoneService, createQrCodeShortLink};
