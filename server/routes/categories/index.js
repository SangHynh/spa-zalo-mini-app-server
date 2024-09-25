const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller')

// GET
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// POST
router.post('/', categoryController.createCategory);

// PUT
router.put('/:id', categoryController.updateCategory);

// DELETE
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;