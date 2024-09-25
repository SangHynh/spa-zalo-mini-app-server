const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/cart.controller')

// GET
router.get('/:id', cartController.getCartByUserId);

// PUT
router.put('/add/:id', cartController.addCartItem);
router.put('/remove/:id', cartController.removeCartItem)

module.exports = router;