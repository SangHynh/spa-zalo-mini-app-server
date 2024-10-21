const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const productController = require('../../controllers/product.controller');
const referralController = require('../../controllers/referral.controller');
const {validateUpdateUserInfo} = require('../../validations/user.validation');
const { verifyAccessToken } = require('../../configs/jwt.config')

// BASIC ROUTES
router.post('/',verifyAccessToken, userController.createUser); 

// GET: /api/users?page=...&limit=...&keyword=...
router.get('/',verifyAccessToken, userController.getAllUsers);   

router.get('/:id',verifyAccessToken, userController.getUserById);  
router.put('/:id',verifyAccessToken, userController.updateUser);   
router.delete('/:id',verifyAccessToken, userController.deleteUser); 

// USER INFO ROUTES
router.put('/update-user-info/:zaloId',verifyAccessToken, validateUpdateUserInfo, userController.updateUserInfo);
router.put('/update-user-phone/:zaloId',verifyAccessToken, validateUpdateUserInfo, userController.updateUserPhone);

// USER ADDRESSES
router.get('/address/all', verifyAccessToken, userController.getUserAddresses)
/*
Body:
{
    "number": "",
    "ward": "",
    "district": "",
    "city": "Thành phố Hồ Chí Minh"
}
*/
router.post('/address', verifyAccessToken, userController.addUserAddress)
router.delete('/address/:addressId', verifyAccessToken, userController.removeUserAddress); 

// REFERRAL ROUTES
router.get('/referral-info/:referralCode', referralController.getReferralInfo);
router.get('/register-page/:referralCode', referralController.getRegisterPage); // chuyển đến trang đăng ký

module.exports = router;
