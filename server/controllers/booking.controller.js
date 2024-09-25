const BookingHistory = require("../models/bookinghistory.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");

class BookingController {
    // GET BOOKING HISTORIES
    async getBookingHistories(req, res) {
        try {
            const response = await BookingHistory.find();
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // GET BOOKING HISTORIES BY USERID
    async getBookingHistoriesByUserId(req, res) {
        try {
            const response = await BookingHistory.find({ where: { customerId: req.params.id} });
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // GET BOOKING BY ID
    async getBookingById(req, res) {
        try {
            const response = await BookingHistory.findOne(req.params.id);
            return res.status(200).json(response)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // CREATE BOOKING
    async createBooking(req, res) {
        try {
            // const { userId } = req.payload.userId
            const { userId } = req.params.id
            const { serviceId } = req.body.serviceId
            
            const user = await User.findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const service = await Service.findOne({ where: { id: serviceId } })
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            if (req.body.date) {
                req.body.date = moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const booking = new BookingHistory({
                ...req.body,
                customerId: userId,
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
                error: error,
                message: 'An error occurred'
            });
        }
    }

    // UPDATE BOOKING
    async updateBooking(req, res) {
        try {
            // TODO:
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
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred'
            });
        }
    }
}

exports.module = BookingController;