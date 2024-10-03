const crypto = require("crypto");
const User = require("../models/user.model");

const generateReferralCode = async (zaloId) => {
  let referralCode;
  let doesExist;

  // Vòng lặp tạo referralCode cho đến khi không trùng
  do {
    const randomPart = crypto.randomBytes(4).toString("hex").toUpperCase(); // Tạo 8 ký tự ngẫu nhiên
    const userPart = zaloId.slice(-8).toUpperCase(); // Lấy 8 ký tự cuối của zaloId
    referralCode = `${userPart}${randomPart}`;

    // Kiểm tra xem mã có trùng trong cơ sở dữ liệu không
    doesExist = await User.findOne({ referralCode });
  } while (doesExist);

  return referralCode;
};

module.exports = generateReferralCode;
