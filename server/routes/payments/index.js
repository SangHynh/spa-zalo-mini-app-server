const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller')

// GET
router.get('/:id', paymentController.getOrder)

// POST
// mac gồm 3 loại: 
router.post('/createMac', paymentController.createMac); // 1. Dành cho phương thức Payment.createOrder 
router.post('/order/get/createMac', paymentController.createMacForGetOrderStatus); // 2. Dàng cho API getOrderStatus
router.post('/order/update/createMac', paymentController.createMacForUpdateOrderStatus); // 3. Dành cho API updateOrderStatus

// notify API cho COD hoặc BANK method
router.post('/zaloNotify', paymentController.zaloNotify);

// POST
/* có 2 loại body:
{
    "bookingId": , // null nếu không phải booking
    "customerId": ,
    "orderDate": ,
    "totalAmount": , // tổng tiền
    "discountApplied": ,
    "discountAmount": ,
    "finalAmount": , // tổng tiền đã giảm
    "paymentMethod": ,
    "paymentStatus": ,
    "transactionId": , // orderId của zalo cấp (có thể thêm sau)
    "remarks": ,
    "referralId": ,
    "products": , hoặc "items": ,
    "voucherId": ,
}

Trong đó:

"products": [
    {
        "productId":
        "productName":
        "price":
        "quantity":
    },
]

hoặc

"items": [
    {
        "product": {
            "id": ,
            "name": ,
            "price": 
        },
        "quantity": 
    },
] // Vì Zalo yêu cầu

*/
router.post('/createOrder', paymentController.createOrder);

// PUT
// API này dùng để thêm OrderId của zalo vào Order trên server này (lưu vào transactionId)
router.put('/:id', paymentController.updateOrderWithZaloOrderId)

module.exports = router;