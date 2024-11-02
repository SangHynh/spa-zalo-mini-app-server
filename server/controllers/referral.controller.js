const ReferralHistory = require("../models/referralhistory.model");
const Users = require("../models/user.model");

// Tìm thông tin tiếp thị liên kết người dùng theo referralCode và trả về cha và các con gần nhất và tổng số con cháu
const getReferralInfo = async (req, res) => {
  try {
    const { referralCode } = req.params;
    const user = await Users.findOne({ referralCode: referralCode });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userPath = user.referralInfo.paths;

    // Tìm thông tin của tổ tiên đầu tiên
    let ancestor = null; // Khai báo biến cho tổ tiên
    if (userPath) {
      const pathSegments = userPath.split(",").filter(Boolean); // Tách các đoạn mã và lọc bỏ phần tử rỗng
      if (pathSegments.length > 0) {
        ancestor = pathSegments[0]; // Mã tổ tiên là phần tử đầu tiên
      }
    }

    // Tìm thông tin của cha (parent)
    let parent = null;
    if (userPath) {
      const pathSegments = userPath.split(",").filter(Boolean); 
      if (pathSegments.length > 1) {
        // Kiểm tra nếu có ít nhất 2 phần tử
        const parentReferralCode = pathSegments[pathSegments.length - 2]; // Mã cha là phần tử kế cuối
        parent = await Users.findOne({ referralCode: parentReferralCode });
      }
    }

    // Tìm các con gần nhất dựa trên referralInfo.paths
    const immediateDescendants = await Users.find({
      "referralInfo.paths": {
        $regex: `^${userPath},[^,]+$`, // tìm paths bắt đầu với parentPath, tiếp theo là một nhánh con
      },
    });

    // Tìm tất cả con cháu (bao gồm các cấp con cháu nhiều nhánh)
    const allDescendants = await Users.find({
      "referralInfo.paths": {
        $regex: `^${userPath},`, // tìm paths bắt đầu với parentPath, có thể có nhiều dấu phẩy
      },
    });

    // Tổng số tất cả con cháu (bao gồm cả các cấp con cháu)
    const totalDescendants = allDescendants.length;

    const descendantsWithEarnings = await Promise.all(immediateDescendants.map(async (child) => {
      // Tính tổng số tiền child đã kiếm được cho user
      const totalEarned = await ReferralHistory.aggregate([
        { $match: { userId: user._id, childId: child._id } },
        { $group: { _id: null, total: { $sum: "$earnedAmount" } } }
      ]);

      return {
        userId: child._id.toString(),
        zaloId: child.zaloId,
        name: child.name,
        membershipTier: child.membershipTier,
        rankColor: child.rankColor,
        referralCode: child.referralCode,
        referralInfo: child.referralInfo,
        totalEarned: totalEarned.length > 0 ? totalEarned[0].total : 0
      };
    }));

    // Trả về thông tin người dùng, tổng số con cháu và danh sách các con gần nhất
    return res.status(200).json({
      ancestor: ancestor,
      parent: parent
        ? {
            // Nếu có cha, trả về thông tin của cha
            zaloId: parent.zaloId,
            name: parent.name,
            membershipTier: parent.membershipTier,
            rankColor: parent.rankColor,
            referralCode: parent.referralCode,
            referralInfo: parent.referralInfo,
          }
        : null, // Nếu không có cha thì null
      user: {
        zaloId: user.zaloId,
        name: user.name,
        membershipTier: user.membershipTier,
        rankColor: user.rankColor,
        referralCode: user.referralCode,
        referralInfo: user.referralInfo,
      },
      totalDescendants: totalDescendants, // tổng số tất cả con cháu
      descendants: descendantsWithEarnings // danh sách con cháu giới thiệu gần nhất
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

// Lịch sử kiếm tiền cho user giới thiệu
const getChildReferralHistoryByParent = async (req, res) => {
  try {
    const { userId, childId } = req.body;

    if (!userId || !childId) {
      return res.status(400).json({ message: "User and child are required" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const history = await ReferralHistory.find({ userId, childId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalRecords = await ReferralHistory.countDocuments({ userId, childId });
    const totalPages = Math.ceil(totalRecords / limit);

    return res.status(200).json({
      history,
      currentPage: page,
      totalPages,
      totalRecords,
    });
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

module.exports = { getReferralInfo, getRegisterPage, getChildReferralHistoryByParent };
