const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //Thông tin người dùng
    zaloId: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true, unique: false },
    avatar: { type: String, default: "", unique: false },
    phone: { type: String, default: null, unique: false },
    gender: { type: String, enum: ["male", "female"], default: "male" },
    membershipTier: {
      type: String,
      enum: ["Member", "Silver", "Gold", "Diamond"],
      default: "Member",
    },
    points: { type: Number, default: 0 },
    // Lịch sử
    history: { type: [String], default: [] },
    // Tiếp thị liên kết
    referralCode: { type: String, unique: true },
    referralInfo: {
      paths: { type: String, required: true }, // ",ABC,DEF,GHI,JKL,..."
      // tierLevel: { type: Number, required: true },
      // commissionPercentage: { type: Number, default: 0 },
      referredAt: { type: Date},
    },
    // Danh sách giảm giá
    discountsUsed: { type: [String], default: [] },
    //Lịch sử dịch vụ
    serviceHistory: { type: [String], default: [] },
    //Sản phẩm gợi ý
    productSuggestions: [
      {
        productId: { type: String },
        productName: { type: String },
        suggestedScore: { type: Number },
      },
    ],
    // Giỏ hàng
    carts: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        images: { type: [String], default: [] },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
