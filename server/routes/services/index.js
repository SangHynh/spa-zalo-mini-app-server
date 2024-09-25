const express = require('express');
const router = express.Router();
const serviceController = require('../../controllers/service.controller');
const { upload } = require('../../middlewares/upload.middlewares');
const MAX_FILES = 10;

// GET
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getServiceById);

// POST 
router.post('/', (req, res, next) => {
    req.folder = process.env.PRODUCT_FOLDER; // Folder name in cloud
    next();
},
    upload.array('images', MAX_FILES), 
    serviceController.createService
);

// PUT
router.put('/:id', (req, res, next) => {
    req.folder = process.env.PRODUCT_FOLDER; // Folder name in cloud
    next();
},
    upload.array('images', MAX_FILES),
    serviceController.updateService
);

// DELETE
router.delete('/:id', serviceController.deleteService);

module.exports = router;
