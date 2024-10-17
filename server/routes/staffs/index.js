const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const { upload } = require('../../middlewares/upload.middlewares');
const { verifyAccessToken } = require('../../configs/jwt.config');
const { hasPermission } = require('../../middlewares/permission.middleware');
const MAX_FILES = 1;

// GET STAFFS
router.get('/', userController.getAllStaffs)

// POST 
router.post('/', (req, res, next) => {
    req.folder = process.env.STAFF_FOLDER; // Folder name in cloud
    next();
},
    verifyAccessToken, 
    hasPermission(['admin']),
    upload.array('images', MAX_FILES), 
    userController.createStaff
);

module.exports = router;
