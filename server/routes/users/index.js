const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controller');
const productController = require('../../controllers/product.controller');
const {validateUpdateUserInfo} = require('../../validations/user.validation');
const { verifyAccessToken } = require('../../configs/jwt.config')

router.post('/',verifyAccessToken, userController.createUser); 
router.get('/',verifyAccessToken, userController.getAllUsers);   
router.get('/:id',verifyAccessToken, userController.getUserById);  
router.put('/:id',verifyAccessToken, userController.updateUser);   
router.delete('/:id',verifyAccessToken, userController.deleteUser); 

// router.get('/user-info/:zaloId', userController.getUserInfo);
router.put('/update-user-info/:zaloId',verifyAccessToken, validateUpdateUserInfo, userController.updateUserInfo);
router.put('/update-user-phone/:zaloId', validateUpdateUserInfo, userController.updateUserPhone);

router.put('/suggested-score/:id', productController.findProductToUpdateSuggestScoreOfUser);
router.put('/rating-product/:id', productController.ratingToUpdateSuggestScoreOfUser);
router.put('/suggest-products-for-user/:id', userController.suggestProductsForUser);
router.put('/update-suggest-products-for-multiple-products/:id', productController.updateSuggestedScoresForMultipleProducts);
router.put('/find-product-to-update-suggest-score-of-user/:productName', productController.findProductToUpdateSuggestScoreOfUser);
module.exports = router;
