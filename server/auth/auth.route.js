const router = require("express").Router();
const authController = require('./auth.controller');
const authValidate = require('./auth.validate')

router.post('/register', authValidate , authController.register); 
router.post('/register/:referralCode' , authController.registerWithReferral);
router.post('/login', authValidate ,authController.login);
router.post('/refresh-token', authController.refreshToken);
router.delete('/logout', authController.logout);

module.exports = router;