const mongoose = require('mongoose');

// Định nghĩa schema cho sản phẩm gợi ý hoặc dịch vụ gợi ý
const recommendationSchema = new mongoose.Schema({
  mainItemId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Có thể là service hoặc product
  mainItemName: { type: String, required: true },
  itemType: { type: String, enum: ['Product', 'Service'], required: true }, // Phân biệt loại
  items: [
    {
      itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
      itemName: { type: String, required: true },
      itemType: { type: String, enum: ['Product', 'Service'], required: true } // Phân biệt sản phẩm/dịch vụ
    }
  ]
}, {
  timestamps: true
});

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

module.exports = Recommendation;
