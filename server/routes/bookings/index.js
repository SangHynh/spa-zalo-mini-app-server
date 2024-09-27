const express = require('express');
const router = express.Router();
const bookingController = require('../../controllers/booking.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', verifyAccessToken, bookingController.getBookingHistories); // FOR ADMIN
router.get('/single/:id', verifyAccessToken, bookingController.getBookingById); // FOR ADMIN
router.get('/user', verifyAccessToken, bookingController.getBookingHistoriesByUserId);

// POST
router.post('/', verifyAccessToken, bookingController.createBooking);

// PUT
router.put('/:id', verifyAccessToken, bookingController.updateBooking);
router.put('/cancel/:id', verifyAccessToken, bookingController.cancelBooking);
router.put('/status/:id/', verifyAccessToken, bookingController.updateBookingStatus); // FOR ADMIN

// DELETE
router.delete('/:id', verifyAccessToken, bookingController.removeBooking);

module.exports = router;