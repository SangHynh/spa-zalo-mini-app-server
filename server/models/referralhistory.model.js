const mongoose = require("mongoose");

const referralHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    childId: { type: mongoose.Schema.Types.ObjectId, required: true },
    childReferralCode: { type: String, required: true },
    childName: { type: String, required: true },
    childPhone: { type: String, required: false },
    childAvatar: { type: String, required: false },
    earnedAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const ReferralHistory = mongoose.model("ReferralHistory", referralHistorySchema);

module.exports = ReferralHistory;
