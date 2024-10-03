const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/booking.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', verifyAccessToken, bookingController.getBookingHistories); // FOR ADMIN
router.get('/single/:id', verifyAccessToken, bookingController.getBookingById); // FOR ADMIN
router.get('/user', verifyAccessToken, bookingController.getBookingHistoriesByUserId);

// POST
/* Body:

{
  "serviceId": "66f57a740b5d33c57aeb19b1",
  "date": "30-10-2024",
  "price": 400000,
  "discountApplied": true,
  "brand": "INCOM",
  "rating": 4,
  "feedback": "Very good service"
  "products": [
    {
      "productId":
      "productName":
      "price":
      "quantity":
    }
  ]
}

*/
router.post('/', verifyAccessToken, bookingController.createBooking);

// PUT
router.put('/:id', verifyAccessToken, bookingController.updateBooking);
router.put('/cancel/:id', verifyAccessToken, bookingController.cancelBooking);
router.put('/status/:id/', verifyAccessToken, bookingController.updateBookingStatus); // FOR ADMIN

// DELETE
router.delete('/:id', verifyAccessToken, bookingController.removeBooking);

module.exports = router;