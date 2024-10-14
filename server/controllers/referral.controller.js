const Users = require("../models/user.model");

// Tìm thông tin tiếp thị liên kết người dùng theo referralCode và trả về cha và các con gần nhất và tổng số con cháu
const getReferralInfo = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const user = await Users.findOne({ referralCode: referralCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Tìm thông tin của cha (parent)
    const parentPath = user.referralInfo.paths;
    let parent = null;
    if (parentPath) {
      const parentReferralCode = parentPath.split(",").pop(); // Đoạn mã của cha
      parent = await Users.findOne({ referralCode: parentReferralCode });
    }
    
    // Tìm các con gần nhất dựa trên referralInfo.paths
    const immediateDescendants = await Users.find({
      "referralInfo.paths": { 
        $regex: `^${parentPath},[^,]+$` // tìm paths bắt đầu với parentPath, tiếp theo là một nhánh con
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
      parent: parent ? {  // Nếu có cha, trả về thông tin của cha
        zaloId: parent.zaloId,
        name: parent.name,
        membershipTier: parent.membershipTier,
        referralCode: parent.referralCode,
        referralInfo: parent.referralInfo,
      } : null,  // Nếu không có cha thì null
      user: {
        zaloId: user._id,
        name: user.name,
        membershipTier: user.membershipTier,
        referralCode: user.referralCode,
        referralInfo: user.referralInfo,
      },
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
