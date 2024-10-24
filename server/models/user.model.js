const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  city: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  number: { type: String, required: true },
});

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
      // enum: ["Member", "Silver", "Gold", "Diamond"],
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
      referredAt: { type: Date },
    },
    // Danh sách giảm giá
    discountsUsed: { type: [String], default: [] },
    //Lịch sử dịch vụ
    serviceHistory: { type: [String], default: [] },
    addresses: { type: [addressSchema], default: [] },
    suggestions: [
      {
        categoryId: { type: String },  // ID của sản phẩm
        categoryName: { type: String },  // Tên sản phẩm
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
      volume: { type: String, required: false }
    }],
    vouchers: [{
      code: { type: String, required: true },
      voucherId: { type: mongoose.Schema.Types.ObjectId },
      usageLimit: { type: Number, default: 1 }
    }],
    rankPoints: { type: Number, default: 0 },
    amounts: { type: Number, default: 0 },
  }, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  try {
    const user = this;

    const ranks = await mongoose.model('Rank').find().sort({ minPoints: -1 });

    let newTier = 'Member'; // Default tier
    for (let rank of ranks) {
      if (user.rankPoints >= rank.minPoints) {
        newTier = rank.tier;
        break;
      }
    }

    if (user.membershipTier !== newTier) {
      user.membershipTier = newTier;
    }

    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
