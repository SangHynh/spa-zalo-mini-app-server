const mongoose = require('mongoose');

// Định nghĩa schema cho đánh giá sản phẩm
const reviewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
  volume: { type: String, required: true },
  productName: { type: String, required: true },                        
  comment: { type: String, required: true },                           
  rating: { type: Number, required: true, min: 0, max: 5 },             
  images: [                                                           
    { type: String }
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },  
}, {
  timestamps: true                                                       
});

// Đặt tên mô hình với chữ hoa đầu tiên
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
