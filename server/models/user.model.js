const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      unique: true, 
    },
    name: { type: String, required: true },
    urlImage: {type: String, default: ""},
    phone: { type: String, default: "" },
    membershipTier: {
      type: String,
      enum: ["Member", "Silver", "Gold", "Diamond"],
      default: "Member",
    },
    points: { type: Number, default: 0 },
    history: { type: [String], default: [] },
    referralCode: { type: String },
    discountsUsed: { type: [String], default: [] },
    serviceHistory: { type: [String], default: [] },
    productSuggestions: [
        {
            productId: { type: String },  // ID của sản phẩm
            productName: { type: String },  // Tên sản phẩm
            suggestedScore: { type: Number }  // Điểm gợi ý sản phẩm
        }
    ]
}, {
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
