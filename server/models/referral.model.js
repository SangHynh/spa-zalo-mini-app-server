const mongoose = require('mongoose');

const referralSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId },
    referredUserId: { type: mongoose.Schema.Types.ObjectId },
    tierLevel: { type: Number, required: true },
    commissionPercentage: { type: Number, required: true },
    referredAt: { type: Date, required: true },
},{
    timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);

module.exports = Referral;
