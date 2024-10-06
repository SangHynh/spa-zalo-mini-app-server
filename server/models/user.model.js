const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    zaloId: {
      type: String,
      required: true,
      unique: true,
    },
    name: { type: String, required: true, unique: false },
    avatar: { type: String, default: "", unique: false },
    phone: { type: String, default: null, unique: false},
    gender: { type: String, enum: ["male", "female"], default: "male" },
    membershipTier: {
      type: String,
      enum: ["Member", "Silver", "Gold", "Diamond"],
      default: "Member",
    },
    points: { type: Number, default: 0 },
    history: { type: [String], default: [] },
    referralCode: { type: String, unique: true },
    discountsUsed: { type: [String], default: [] },
    serviceHistory: { type: [String], default: [] },
    address: { type: String, default: "" },
    productSuggestions: [
      {
        productId: { type: String },  // ID của sản phẩm
        productName: { type: String },  // Tên sản phẩm
        suggestedScore: { type: Number }  // Điểm gợi ý sản phẩm
      }
    ],
    carts: [{
      productId: { type: mongoose.Schema.Types.ObjectId },
      variantId: { type: mongoose.Schema.Types.ObjectId },
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      images: { type: [String], default: [] },
    }],
    vouchers: [{
      code: { type: String, required: true },
      voucherId: { type: mongoose.Schema.Types.ObjectId },
    }]
  }, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;
