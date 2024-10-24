const express = require('express');
const router = express.Router();
const paymentController = require('../../controllers/payment.controller');
const { verifyAccessToken } = require('../../configs/jwt.config');

// GET
router.get('/order/:id', paymentController.getOrder)
router.get('/', verifyAccessToken, paymentController.getOrders)
router.get('/user-histories', verifyAccessToken, paymentController.getOrdersByUser)

// POST
// mac gồm 3 loại: 
router.post('/createMac', paymentController.createMac); // 1. Dành cho phương thức Payment.createOrder 
router.post('/order/get/createMac', paymentController.createMacForGetOrderStatus); // 2. Dàng cho API getOrderStatus
router.post('/order/update/createMac', paymentController.createMacForUpdateOrderStatus); // 3. Dành cho API updateOrderStatus

// notify API cho COD hoặc BANK method
router.post('/zaloNotify', paymentController.zaloNotify);

// callback url
router.post('/callback', paymentController.callback);

// POST
/* có 2 loại body:
{
    "bookingId": , // null nếu không phải booking
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
    "address": , // THÊM ĐỊA CHỈ
}

Trong đó:

"products": [
    {
        "productId":
        "variantId":
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
            "variantId": ,
            "name": ,
            "price": 
        },
        "quantity": 
    },
] // Vì Zalo yêu cầu

*/
router.post('/createOrder', verifyAccessToken, paymentController.createOrder);

// PUT
// API này dùng để thêm OrderId của zalo vào Order trên server này (lưu vào transactionId)
router.put('/:id', verifyAccessToken, paymentController.updateOrderWithZaloOrderId)

// DELETE
router.delete('/single/:id', verifyAccessToken, paymentController.deleteOrder);
router.delete('/mass', verifyAccessToken, paymentController.deleteOrders);

module.exports = router;
