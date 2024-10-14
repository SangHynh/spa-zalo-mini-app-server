const Users = require("../models/user.model");

// Tìm thông tin tiếp thị liên kết người dùng theo referralCode và trả về các con gần nhất và tổng số con cháu
const getReferralInfo = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const user = await Users.findOne({ referralCode: referralCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Tìm các con gần nhất dựa trên referralInfo.paths
    const parentPath = user.referralInfo.paths;
    // Tìm những người dùng có referralInfo.paths chứa path của người dùng hiện tại và có thêm đúng một nhánh sau dấu phẩy
    const immediateDescendants = await Users.find({
      "referralInfo.paths": { 
        $regex: `^${parentPath},[^,]+$` // tìm paths bắt đầu với parentPath, tiếp theo là một nhánh con (không chứa dấu phẩy nữa)
      }
    });
    // Tìm tất cả con cháu (bao gồm các cấp con cháu nhiều nhánh)
    const allDescendants = await Users.find({
      "referralInfo.paths": { 
        $regex: `^${parentPath},` // tìm paths bắt đầu với parentPath, có thể có nhiều dấu phẩy
      }
    });
    // Tổng số tất cả con cháu (bao gồm cả các cấp con cháu)
    const totalDescendants = allDescendants.length;
    // Trả về thông tin người dùng, tổng số con cháu và danh sách các con gần nhất
    return res.status(200).json({
      zaloId: user._id,
      name: user.name,
      membershipTier: user.membershipTier,
      referralCode: user.referralCode,
      referralInfo: user.referralInfo,
      totalDescendants: totalDescendants, // tổng số tất cả con cháu 
      descendants: immediateDescendants.map((child) => ({
        zaloId: child.zaloId,
        name: child.name,
        membershipTier: child.membershipTier,
        referralCode: child.referralCode,
        referralInfo: child.referralInfo,
      })), // danh sách con cháu giới thiệu gần nhất
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while fetching referral information",
      error: error.message,
    });
  }
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
