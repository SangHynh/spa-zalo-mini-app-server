const Category = require("../models/category.model")

class CategoryController {
    // GET CATEGORIES
    async getCategories(req, res) {
        try {
            const categories = await Category.find()
            return res.status(200).json(categories)
        } catch (error) {
            return res.status(500).json({
                error: error,
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
            return res.status(200).json({ category });
        } catch (error) {
            return res.status(500).json({
                error: error,
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
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // PUT CATEGORY
    async updateCategory(req, res) {
        try {
            const { name, description, subCategory } = req.body;

            const updatedCategory = await Category.findByIdAndUpdate(
                req.params.id,
                {
                    name,
                    description,
                    subCategory: subCategory || []
                },
                { new: true }
            );

            if (!updatedCategory) {
                return res.status(404).json({ message: 'Category not found' });
            }

            return res.status(200).json(updatedCategory);
        } catch (error) {
            return res.status(400).json({
                error: error,
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
                error: error,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new CategoryController()