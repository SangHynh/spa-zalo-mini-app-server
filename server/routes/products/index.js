const express = require('express');
const router = express.Router();
const productController = require('../../controllers/product.controller');
const upload = require('../../middlewares/upload.middlewares');
const MAX_FILES = 10;

// GET
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// POST 
router.post('/', (req, res, next) => {
    req.folder = process.env.PRODUCT_FOLDER; // Folder name in cloud
    next();
},
    upload.array('images', MAX_FILES), 
    productController.createProduct
);

// PUT
router.put('/:id', productController.updateProduct);

// DELETE
router.delete('/:id', productController.deleteProduct);

module.exports = router;
