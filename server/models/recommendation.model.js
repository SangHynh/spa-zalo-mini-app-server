const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm gợi ý
const recommendationSchema = new mongoose.Schema({
  mainProductId: { type: mongoose.Schema.Types.ObjectId, required: true },
  mainProductName: { type: String, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      productName: { type: String, required: true }
    }
  ]
}, {
  timestamps: true
});

// Đặt tên mô hình với chữ hoa đầu tiên
const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
