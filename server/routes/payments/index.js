const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller')

// GET
router.post('/createMac', paymentController.createMac);
router.post('/zaloNotify', paymentController.zaloNotify);
router.post('/createOrder', paymentController.createTestOrder);

module.exports = router;