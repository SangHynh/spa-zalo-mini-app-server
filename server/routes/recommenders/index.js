const express = require('express');
const router = express.Router();
const userController = require('../../controllers/users.controller');
const upload = require('../../middlewares/upload.middlewares');
const MAX_FILES = 10;

// GET
router.get('/', userController.getAllusers);
router.get('/:id', userController.getuserById);


module.exports = router;
