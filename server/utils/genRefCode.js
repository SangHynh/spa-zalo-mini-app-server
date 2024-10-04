const crypto = require("crypto");
const User = require("../models/user.model");

const generateReferralCode = async () => {
  let referralCode;
  let doesExist;

  // Vòng lặp tạo referralCode cho đến khi không trùng
  do {
    // Tạo 16 ký tự ngẫu nhiên
    const randomCode = crypto.randomBytes(8).toString("hex").toUpperCase(); 
    referralCode = randomCode;
    // Kiểm tra xem mã có trùng trong cơ sở dữ liệu không
    doesExist = await User.findOne({ referralCode });
  } while (doesExist);

  return referralCode;
};

module.exports = generateReferralCode;
