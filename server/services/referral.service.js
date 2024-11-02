const AppConfig = require("../models/appconfig.model");
const Rank = require("../models/rank.model");
const ReferralHistory = require("../models/referralhistory.model");
const User = require("../models/user.model");

async function calculateReferralCommission(order, customerId) {
    try {
        const commissionInf = await AppConfig.findOne();
        const baseCommissionPercent = commissionInf.baseCommissionPercent; // Phần trăm hoa hồng mặc định
        const reductionPerLevelPercent = commissionInf.reductionPerLevelPercent; // Tỷ lệ giảm giữa các cấp

        // Tìm khách hàng
        const user = await User.findById(customerId);
        if (!user) return { success: false, message: "User not found" };

        // Nếu user có đường dẫn referral
        if (user.referralInfo && user.referralInfo.paths) {
            const referralPaths = user.referralInfo.paths.split(',').filter(path => path.trim() !== "");

            // Bắt đầu từ cấp trên user hiện tại, duyệt qua từng cấp trên
            for (let i = referralPaths.length - 2, n = 1; i >= 0; i--, n++) {
                const refCode = referralPaths[i]; // Mã giới thiệu của user cấp trên
                const refUser = await User.findOne({ referralCode: refCode });

                if (refUser) {
                    const refUserRank = await Rank.findOne({ tier: refUser.membershipTier });

                    if (refUserRank) {
                        // Lấy hoa hồng theo hạng của user
                        const userCommissionPercent = refUserRank.commissionPercent;

                        // Tính phần trăm hoa hồng theo công thức
                        const commissionPercent = (baseCommissionPercent * Math.pow(1 - (reductionPerLevelPercent / 100), n - 1)) / 100;
                        const totalCommissionPercent = commissionPercent * (1 + (userCommissionPercent / 100));

                        // Tính hoa hồng cho user cấp trên (refUser)
                        const userCommissionAmount = order.finalAmount * totalCommissionPercent;

                        // Cộng hoa hồng cho user cấp trên
                        refUser.amounts += userCommissionAmount;

                        // Lưu user cấp trên sau khi cộng hoa hồng
                        await refUser.save({ validateBeforeSave: false });

                        const history = new ReferralHistory({
                            userId: customerId,
                            childId: refUser._id,
                            childReferralCode: refUser.referralCode,
                            childName: refUser.name,
                            childPhone: refUser.phone || '',
                            childAvatar: refUser.avatar,
                            earnedAmount: userCommissionAmount,
                        });

                        // Lưu lịch sử hoa hồng
                        await history.save();
                    }
                }
            }
        }
        
        return { success: true, message: "Commission calculated successfully" };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

module.exports = { calculateReferralCommission };