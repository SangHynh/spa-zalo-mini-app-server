const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const productController = require('../../controllers/product.controller');
const {validateUpdateUserInfo} = require('../../validations/user.validation');
const { verifyAccessToken } = require('../../configs/jwt.config')

router.post('/',verifyAccessToken, userController.createUser); 

// GET: /api/users?page=...&limit=...&keyword=...
router.get('/',verifyAccessToken, userController.getAllUsers);   

router.get('/:id',verifyAccessToken, userController.getUserById);  
router.put('/:id',verifyAccessToken, userController.updateUser);   
router.delete('/:id',verifyAccessToken, userController.deleteUser); 

// router.get('/user-info/:zaloId', userController.getUserInfo);
router.put('/update-user-info/:zaloId',verifyAccessToken, validateUpdateUserInfo, userController.updateUserInfo);
router.put('/update-user-phone/:zaloId',verifyAccessToken, validateUpdateUserInfo, userController.updateUserPhone);

module.exports = router;
