const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/category.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', categoryController.getCategories);
router.get('/:id', categoryController.getCategoryById);

// POST
router.post('/', verifyAccessToken, categoryController.createCategory);

// PUT
router.put('/:id', verifyAccessToken, categoryController.updateCategory);

// DELETE
router.delete('/:id', verifyAccessToken, categoryController.deleteCategory);

module.exports = router;