const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const {validateUpdateUserInfo} = require('../../validations/user.validation');

router.post('/', userController.createUser); 
router.get('/', userController.getAllUsers);   
router.get('/:id', userController.getUserById);  
router.put('/:id', userController.updateUser);   
router.delete('/:id', userController.deleteUser); 
router.get('/user-info/:zaloId', userController.getUserInfo);
router.put('/update-user-info/:zaloId', validateUpdateUserInfo, userController.updateUserInfo); // Sử dụng hàm validate ở đây

module.exports = router;
