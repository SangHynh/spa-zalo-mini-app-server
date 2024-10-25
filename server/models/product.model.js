const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  volume: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true }
});

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  percentage: { type: Number, required: true },
  usageInstructions: { type: String }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], default: [] },
  price: { type: Number, required: true },
  subCategoryId: { type: mongoose.Schema.Types.ObjectId },
  subCategory: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId },
  category: { type: String, required: true },
  stock: { type: Number, required:  true },
  variants: [variantSchema],
  ingredients: [ingredientSchema],
  benefits: [String],
  expiryDate: { type: Date, required: false },
  usageInstructions: { type: String, required: false },
  salesQuantity: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 }
},{
    timestamps: true
});

const Product = mongoose.model('products', productSchema);

module.exports = Product;
