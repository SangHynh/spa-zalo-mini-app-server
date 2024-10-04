const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const { upload } = require('../../middlewares/upload.middlewares');
const { verifyAccessToken } = require('../../configs/jwt.config')
const MAX_FILES = 10;

// GET
router.get('/:id', productController.getProductById);

// GET: /api/products?page=...&limit=...&keyword=...&subCategoryId=...
router.get('/', productController.getAllProducts);

// POST 
router.post('/', (req, res, next) => {
    req.folder = process.env.PRODUCT_FOLDER; // Folder name in cloud
    next();
},
    verifyAccessToken, 
    upload.array('images', MAX_FILES), 
    productController.createProduct
);

// PUT
router.put('/:id', (req, res, next) => {
    req.folder = process.env.PRODUCT_FOLDER; // Folder name in cloud
    next();
},
    verifyAccessToken, 
    upload.array('images', MAX_FILES),
    productController.updateProduct
);

// DELETE
router.delete('/:id', verifyAccessToken, productController.deleteProduct);

module.exports = router;
