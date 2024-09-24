const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: { type: String, required: true },
    subCategoryId: { type: mongoose.Schema.Types.ObjectId },
    subCategory: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] }, // Bổ sung
}, {
    timestamps: true
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;
