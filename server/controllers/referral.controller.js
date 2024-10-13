const Users = require("../models/user.model");

// Tìm thông tin tiếp thị liên kết người dùng theo Zalo ID
const getReferralInfo = async (req, res) => {
  try {
    const { zaloId } = req.params;
    const user = await Users.findOne({ zaloId: zaloId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      zaloId: user._id,
      name: user.name,
      membershipTier: user.membershipTier,
      referralCode: user.referralCode,
      referralInfo: user.referralInfo,
    });
  } catch (error) {}
};

// Đăng ký người dùng theo mã tiếp thị liên kết
/* 

auth/auth.controller.js

*/

// Mở trang đăng ký điều hướng khi quét mã qr
const getRegisterPage = async (req, res) => {
  try {
    const { referralCode } = req.params; 
    res.render("register", { referralCode });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to render the registration page",
      error: error.message,
    });
  }
};

module.exports = { getReferralInfo, getRegisterPage };
