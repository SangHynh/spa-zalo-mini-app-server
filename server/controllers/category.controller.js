const Category = require("../models/category.model")
const mongoose = require('mongoose');

class CategoryController {
    // GET CATEGORIES
    async getCategories(req, res) {
        try {
            console.log(req.payload)
            const categories = await Category.find()
            return res.status(200).json(categories)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            })
        }
    }

    // GET CATEGORY
    async getCategoryById(req, res) {
        try {
            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }
            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // POST CATEGORY
    async createCategory(req, res) {
        try {
            const { name, description, subCategory } = req.body;
            const category = new Category({
                name,
                description,
                subCategory: subCategory || []
            });

            const savedCategory = await category.save();
            return res.status(201).json(savedCategory);
        } catch (error) {
            return res.status(400).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // PUT CATEGORY
    async updateCategory(req, res) {
        try {
            const { name, description, subCategory } = req.body;

            const category = await Category.findById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            category.name = name;
            category.description = description;

            // Cập nhật subCategory
            const existingSubCategoryIds = category.subCategory.map(subCat => subCat._id.toString());

            const updatedSubCategories = subCategory.map(subCat => {
                if (existingSubCategoryIds.includes(subCat._id)) {
                    // Nếu subCategory có ID, cập nhật
                    return { ...subCat };
                } else {
                    // Nếu không có ID, thêm mới
                    return { ...subCat, _id: new mongoose.Types.ObjectId() };
                }
            });

            category.subCategory = updatedSubCategories;

            const updatedCategory = await category.save();

            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(400).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // DELETE CATEGORY
    async deleteCategory(req, res) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            return res.status(200).json({ message: 'Category deleted successfully' });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new CategoryController()