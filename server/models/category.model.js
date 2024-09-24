const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
})

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    subCategory: [subCategorySchema]
},{
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
