const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller')

// GET
router.get('/:id', paymentController.getOrder)

// POST
/* mac gồm 3 loại: 
1. Dành cho phương thức Payment.createOrder 
2. Dàng cho API getOrderStatus
3. Dành cho API updateOrderStatus
4. Dành cho API createRefund
5. Dành cho API getRefundStatus
*/
router.post('/createMac', paymentController.createMac);
router.post('/order/get/createMac', paymentController.createMacForGetOrderStatus);
router.post('/order/update/createMac', paymentController.createMacForUpdateOrderStatus);

router.post('/zaloNotify', paymentController.zaloNotify);
router.post('/createOrder', paymentController.createOrder);

// PUT
// API này dùng để thêm OrderId của zalo vào Order trên server này (lưu vào transactionId)
router.put('/:id', paymentController.updateOrderWithZaloOrderId)

module.exports = router;