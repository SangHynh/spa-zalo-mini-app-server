const BookingHistory = require("../models/bookinghistory.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const moment = require('moment');

class BookingController {
    // GET BOOKING HISTORIES
    async getBookingHistories(req, res) {
        try {
            const response = await BookingHistory.find();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // GET BOOKING HISTORIES BY USERID
    async getBookingHistoriesByUserId(req, res) {
        try {
            const accountId = req.payload.aud

            const user = await User.findOne({ accountId: accountId });

            if (!user) return res.status(404).json({ message: "User not found" })

            // console.log(user)

            const response = await BookingHistory.find({ customerId: user._id });

            // console.log(response)

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // GET BOOKING BY ID
    async getBookingById(req, res) {
        try {
            const response = await BookingHistory.findById(req.params.id);

            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // CREATE BOOKING
    async createBooking(req, res) {
        try {
            const accountId = req.payload.aud
            // const { userId } = req.params.id

            const { serviceId } = req.body

            const user = await User.findOne({ accountId: accountId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const service = await Service.findById(serviceId)
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            if (req.body.date) {
                req.body.date = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const booking = new BookingHistory({
                ...req.body,
                customerId: user._id,
                serviceId: serviceId,
                serviceName: service.name
            })

            const newBooking = await booking.save()

            if (!newBooking) {
                return res.status(400).json({ message: 'Cannot create booking' })
            }

            return res.status(201).json(newBooking)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }

    // UPDATE BOOKING
    async updateBooking(req, res) {
        try {
            // TODO:
            const accountId = req.payload.aud;
            const bookingId = req.params.id;
            const { serviceId, date, ...updateData } = req.body;

            const user = await User.findOne({ accountId: accountId });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const booking = await BookingHistory.findOne({ _id: bookingId, customerId: user._id });
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            if (serviceId) {
                const service = await Service.findById(serviceId)
                if (!service) {
                    return res.status(404).json({ message: 'Service not found' });
                }
                booking.serviceId = serviceId;
                booking.serviceName = service.name;
            }

            if (date) {
                booking.date = moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            Object.assign(booking, updateData);

            // Save the updated booking
            const updatedBooking = await booking.save();
            if (!updatedBooking) {
                return res.status(400).json({ message: 'Cannot update booking' });
            }

            return res.status(200).json(updatedBooking);
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // CANCEL BOOKING (FOR CUSTOMER)
    async cancelBooking(req, res) {
        try {
            const booking = await BookingHistory.findById(req.params.id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' })

            booking.status = 'cancelled';

            const savedBooking = await booking.save()

            if (!savedBooking) return res.status(400).json({ message: 'Cannot cancel booking' })

            return res.status(200).json(savedBooking)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // UPDATE BOOKING'S STATUS
    async updateBookingStatus(req, res) {
        try {
            // TODO:
            const booking = await BookingHistory.findById(req.params.id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' })

            booking.status = req.body.status;

            const savedBooking = await booking.save()

            if (!savedBooking) return res.status(400).json({ message: 'Cannot update booking status' })

            return res.status(200).json(savedBooking)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // REMOVE BOOKING
    async removeBooking(req, res) {
        try {
            // TODO:
            const bookingId = req.params.id;

            const booking = await BookingHistory.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Remove the booking
            const deletedBooking = await BookingHistory.findByIdAndDelete(bookingId);
            if (!deletedBooking) {
                return res.status(400).json({ message: 'Cannot delete booking' });
            }

            return res.status(200).json({ message: 'Booking removed successfully' });
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new BookingController();