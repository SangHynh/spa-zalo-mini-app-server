const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/booking.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET: /api/bookings?page=...&limit=...&customerId=...&status=...&sortBy=date&sortOrder=...
router.get('/', verifyAccessToken, bookingController.getBookingHistories); // FOR ADMIN
router.get('/single/:id', verifyAccessToken, bookingController.getBookingById); // FOR ADMIN

// GET: /api/bookings?status=...
router.get('/user', verifyAccessToken, bookingController.getBookingHistoriesByUserId);

// POST
/* Body:

{
    "date": "05/10/2024 05:00",
    "voucherId": ""
    "services": [
        "66ffc8e9eb8a35fcbaffa9aa",
        "66ffc8e9eb8a35fcbaffa9ab"
    ],
    "products": [
        {
            "productId": "66ffc8e8eb8a35fcbaffa8af",
            "variantId": "66ffc8e8eb8a35fcbaffa8b1",
            "quantity": 2
        },
        {
            "productId": "66ffc8e8eb8a35fcbaffa8b9",
            "variantId": "66ffc8e8eb8a35fcbaffa8ba",
            "quantity": 1
        }
    ]
}

*/
router.post('/', verifyAccessToken, bookingController.createBooking);

// PUT
router.put('/:id', verifyAccessToken, bookingController.updateBooking);
router.put('/status/:id/', verifyAccessToken, bookingController.updateBookingStatus); // FOR ADMIN

// DELETE
router.delete('/:id', verifyAccessToken, bookingController.cancelBooking);

module.exports = router;