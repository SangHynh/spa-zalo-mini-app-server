const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/service.controller');
const { upload } = require('../../middlewares/upload.middlewares');
const { verifyAccessToken } = require('../../configs/jwt.config')
const MAX_FILES = 10;

// GET
router.get('/:id', serviceController.getServiceById);

// GET: /api/products?page=...&limit=...&keyword=...&subCategoryId=...&sortBy=...&sortOrder=...
router.get('/', serviceController.getServices);

// POST 
router.post('/', (req, res, next) => {
    req.folder = process.env.SERVICE_FOLDER; // Folder name in cloud
    next();
},
    verifyAccessToken, 
    upload.array('images', MAX_FILES), 
    serviceController.createService
);

// PUT
router.put('/:id', (req, res, next) => {
    req.folder = process.env.SERVICE_FOLDER; // Folder name in cloud
    next();
},
    verifyAccessToken, 
    upload.array('images', MAX_FILES),
    serviceController.updateService
);

// DELETE
router.delete('/:id', verifyAccessToken, serviceController.deleteService);

module.exports = router;
