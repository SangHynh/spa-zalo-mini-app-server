const axios = require("axios");
const crypto = require("crypto");
require("dotenv").config();

const calculateHMacSHA256 = (data, secretKey) => {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(data);
  return hmac.digest("hex");
};

const options = {
  url: "https://graph.zalo.me/v2.0/me",
  method: "GET",
  headers: {
    access_token: process.env.ZALO_ACCOUNT_ACCESS_TOKEN,
    appsecret_proof: calculateHMacSHA256(
      process.env.ZALO_ACCOUNT_ACCESS_TOKEN,
      process.env.ZALO_APP_SECRET_KEY
    ),
  },
  params: {
    fields: "id,name,picture" 
  },
};

axios(options)
  .then((response) => {
    console.log("Response Code:", response.status);
    console.log("Response Body:", response.data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
