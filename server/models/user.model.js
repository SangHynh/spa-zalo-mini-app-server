const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String },//hiện tại chưa rõ gồm những gì
    membershipTier: {
        type: String,
        enum: ["Member", "Silver", "Gold", "Diamond"],
        default: "Member"
    },
    points: { type: Number, default: 0 },
    history: { type: [String], default: [] },
    referralCode: { type: String },
    discountsUsed: { type: [String], default: [] },
    serviceHistory: { type: [String], default: [] },
    carts: [{
        productId: { type: mongoose.Schema.Types.ObjectId },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        images: { type: [String], default: [] },
    }]
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
