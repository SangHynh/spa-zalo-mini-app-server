const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', verifyAccessToken, cartController.getCartByUserId);

// PUT
router.put('/add/:id', verifyAccessToken, cartController.addCartItem);
router.put('/reduce/:id', verifyAccessToken, cartController.reduceCartItem)
router.put('/remove/:id', verifyAccessToken, cartController.removeCartItem)

module.exports = router;