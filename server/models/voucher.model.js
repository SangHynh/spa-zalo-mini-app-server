const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  code: { type: String, required: true },
  description: { type: String, required: true },
  discountType: { type: String, required: true },
  discountValue: { type: Number, required: true },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  usageLimit: { type: Number, required: true },
  usedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId },
    usedAt: { type: Date, required: true },
  }]
},{
    timestamps: true
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
