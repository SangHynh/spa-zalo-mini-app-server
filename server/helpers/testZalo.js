/* npm run checkZaloToken */

const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const calculateHMacSHA256 = (data, secretKey) => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(data);
  return hmac.digest("hex");
};

// Hàm kiểm tra Zalo Token
const testZalo = async () => {
  const userAccessToken = process.env.ZALO_ACCOUNT_ACCESS_TOKEN;
  const secretKey = process.env.ZALO_APP_SECRET_KEY;

  try {
    // Gọi API để lấy thông tin người dùng
    const userInfoOptions = {
      url: "https://graph.zalo.me/v2.0/me",
      method: "GET",
      headers: {
        access_token: userAccessToken,
        appsecret_proof: calculateHMacSHA256(userAccessToken, secretKey),
      },
      params: {
        fields: "id,name,picture",
      },
    };

    const userInfoResponse = await axios(userInfoOptions);
    const userInfo = {
      userInfo: {
        code: userInfoResponse.status,
        data: userInfoResponse.data,
      },
    };

    // Gọi API để lấy thông tin từ phone token
    const token = process.env.ZALO_PHONE_TOKEN;
    const endpoint = "https://graph.zalo.me/v2.0/me/info";

    const phoneTokenOptions = {
      url: endpoint,
      method: "GET",
      headers: {
        access_token: userAccessToken,
        code: token,
        secret_key: secretKey,
      },
    };

    const phoneTokenResponse = await axios(phoneTokenOptions);
    userInfo.phoneTokenInfo = {
      code: phoneTokenResponse.status,
      data: phoneTokenResponse.data,
    };

    // Trả về kết quả chung
    console.log("Combined Response:", JSON.stringify(userInfo, null, 2));
    return userInfo; // Bạn có thể trả về hoặc xử lý dữ liệu này theo nhu cầu

  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
  }
};

// Gọi hàm kiểm tra Zalo Token
testZalo();
