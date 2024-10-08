const BookingHistory = require("../models/bookinghistory.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const mongoose = require('mongoose');
const moment = require('moment');

class BookingController {

    // GET BOOKING HISTORIES
    async getBookingHistories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const { status, customerId, sortBy, sortOrder } = req.query;

            // Tạo điều kiện tìm kiếm
            const query = {};

            if (status) {
                query.status = { $regex: status, $options: 'i' }; // Case-insensitive search
            }

            if (customerId) {
                const isObjectId = mongoose.Types.ObjectId.isValid(customerId);
                if (isObjectId) {
                    query.customerId = mongoose.Types.ObjectId(customerId); // Exact match on ObjectId
                } else {
                    return res.status(400).json({ message: 'Invalid customerId format' });
                }
            }

            const totalBookingHistories = await BookingHistory.countDocuments(query);

            let sortCriteria = {};
            if (sortBy) {
                const validSortFields = ['date']; // Chỉ sắp xếp theo `date`
                if (validSortFields.includes(sortBy)) {
                    sortCriteria[sortBy] = sortOrder === 'desc' ? -1 : 1;
                }
            }

            const bookingHistories = await BookingHistory.find(query)
                .skip(skip)
                .limit(limit)
                .sort(sortCriteria)

            if (!bookingHistories || bookingHistories.length === 0) {
                return res.status(200).json({ total: 0, bookings: [] });
            }

            const bookingsWithCustomers = await Promise.all(
                bookingHistories.map(async (booking) => {
                    const customer = await User.findById(booking.customerId).select('name phone');
                    return {
                        ...booking.toObject(),
                        customer: customer ? customer : null,
                    };
                })
            );

            return res.status(200).json({
                totalBookings: totalBookingHistories,
                currentPage: page,
                totalPages: Math.ceil(totalBookingHistories / limit),
                bookings: bookingsWithCustomers,
            });
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
            const userId = req.payload.audience

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ message: "User not found" })

            const { status } = req.query;
            // console.log(user)

            const query = {};

            if (status) {
                query.status = { $regex: status, $options: 'i' }; // Case-insensitive search
            }

            const response = await BookngHistory.find({ customerId: user._id, ...query });

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

            if (!response) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            const customer = await User.findById(response.customerId).select('name phone');

            return res.status(200).json({
                ...response.toObject(),
                customer: customer ? customer : null
            });
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
            const userId = req.payload.audience
            // const { userId } = req.params.id

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (req.body.date) {
                req.body.date = moment(req.body.date, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
            }

            // Handle services
            let serviceDetails = [];
            let totalServicePrice = 0;

            if (req.body.services && Array.isArray(req.body.services)) {
                for (const serviceId of req.body.services) {
                    const service = await Service.findById(serviceId);
                    if (!service) {
                        return res.status(404).json({ message: `Service not found: ${serviceId}` });
                    }
                    serviceDetails.push({
                        serviceId: service._id,
                        serviceName: service.name,
                        price: service.price,
                    });
                    totalServicePrice += service.price;
                }
            }

            // Handle products
            let productDetails = [];
            let totalProductPrice = 0;

            if (req.body.products && Array.isArray(req.body.products)) {
                for (const { productId, variantId, quantity } of req.body.products) {
                    const product = await Product.findById(productId);
                    if (!product) {
                        return res.status(404).json({ message: `Product not found: ${productId}` });
                    }

                    // Find the selected variant
                    let selectedVariant;
                    if (variantId) {
                        selectedVariant = product.variants.find(v => v._id.equals(variantId));
                        if (!selectedVariant) {
                            return res.status(404).json({ message: `Variant not found for product: ${productId}` });
                        }
                    }

                    const price = selectedVariant ? selectedVariant.price : product.price;
                    const totalPrice = price * quantity;

                    productDetails.push({
                        productId: product._id,
                        variantId: variantId,
                        productName: product.name,
                        price: price,
                        quantity: quantity,
                    });

                    totalProductPrice += totalPrice;
                }
            }

            const booking = new BookingHistory({
                customerId: user._id,
                date: req.body.date || new Date(),
                status: 'pending',
                services: serviceDetails,
                products: productDetails,
            });

            const newBooking = await booking.save();

            if (!newBooking) {
                return res.status(400).json({ message: 'Cannot create booking' })
            }

            const totalAmount = totalServicePrice + totalProductPrice;

            // Create order after booking
            const order = new Order({
                bookingId: newBooking._id,
                customerId: user._id,
                orderDate: new Date(),
                totalAmount: totalAmount,
                discountApplied: false,
                discountAmount: totalAmount,
                finalAmount: totalAmount,
                paymentMethod: '',
                paymentStatus: 'pending',
                products: productDetails,
                services: serviceDetails,
            });

            const newOrder = await order.save();

            if (!newOrder) {
                return res.status(400).json({ message: 'Cannot create order' });
            }

            return res.status(201).json({ booking: newBooking, order: newOrder });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }

    // UPDATE BOOKING
    async updateBooking(req, res) {
        try {
            const { bookingId } = req.params;

            const booking = await BookingHistory.findById(bookingId);
            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            // Handle services
            let serviceDetails = [];
            let totalServicePrice = 0;

            if (req.body.services && Array.isArray(req.body.services)) {
                for (const serviceId of req.body.services) {
                    const service = await Service.findById(serviceId);
                    if (!service) {
                        return res.status(404).json({ message: `Service not found: ${serviceId}` });
                    }
                    serviceDetails.push({
                        serviceId: service._id,
                        serviceName: service.name,
                        price: service.price,
                    });
                    totalServicePrice += service.price;
                }
            }

            // Handle products with variant
            let productDetails = [];
            let totalProductPrice = 0;

            if (req.body.products && Array.isArray(req.body.products)) {
                for (const { productId, variantId, quantity } of req.body.products) {
                    const product = await Product.findById(productId);
                    if (!product) {
                        return res.status(404).json({ message: `Product not found: ${productId}` });
                    }

                    // Find the selected variant
                    let selectedVariant;
                    if (variantId) {
                        selectedVariant = product.variants.find(v => v._id.equals(variantId));
                        if (!selectedVariant) {
                            return res.status(404).json({ message: `Variant not found for product: ${productId}` });
                        }
                    }

                    const price = selectedVariant ? selectedVariant.price : product.price;
                    const totalPrice = price * quantity;

                    productDetails.push({
                        productId: product._id,
                        variantId: variantId || null,
                        productName: product.name,
                        price: price,
                        quantity: quantity,
                    });

                    totalProductPrice += totalPrice;
                }
            }

            booking.services = serviceDetails.length > 0 ? serviceDetails : booking.services;
            booking.products = productDetails.length > 0 ? productDetails : booking.products;
            booking.status = req.body.status || booking.status;
            booking.date = req.body.date ? moment(req.body.date, 'DD/MM/YYYY').format('YYYY-MM-DD') : booking.date;

            const updatedBooking = await booking.save();
            if (!updatedBooking) {
                return res.status(400).json({ message: 'Cannot update booking' });
            }

            const totalAmount = totalServicePrice + totalProductPrice;

            const order = await Order.findOne({ bookingId: booking._id });
            if (order) {
                order.totalAmount = totalAmount;
                order.discountAmount = totalAmount;
                order.finalAmount = totalAmount;
                order.products = productDetails.length > 0 ? productDetails : order.products;
                order.services = serviceDetails.length > 0 ? serviceDetails : order.services;
                await order.save();
            }

            return res.status(200).json({ booking: updatedBooking });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
            });
        }
    }

    // CANCEL (DELETE) BOOKING (FOR CUSTOMER)
    async cancelBooking(req, res) {
        try {
            const booking = await BookingHistory.findById(req.params.id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' });

            const deletedOrder = await Order.findOneAndDelete({ bookingId: booking._id });
            if (deletedOrder) {
                console.log(`Order deleted successfully`);
            }

            const deletedBooking = await BookingHistory.findByIdAndDelete(req.params.id);
            if (!deletedBooking) return res.status(400).json({ message: 'Cannot delete booking' });

            return res.status(200).json({
                message: 'Booking deleted successfully',
                deletedBooking,
                deletedOrder: deletedOrder ? deletedOrder : 'No associated order'
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred while deleting the booking and order',
            });
        }
    }

    // UPDATE BOOKING'S STATUS
    async updateBookingStatus(req, res) {
        try {
            // TODO:
            const booking = await BookingHistory.findById(req.params.id);

            if (!booking) return res.status(404).json({ message: 'Booking not found' })

            // console.log(req.body.status)

            booking.status = req.body.status;

            const savedBooking = await booking.save()

            if (!savedBooking) return res.status(400).json({ message: 'Cannot update booking status' })

            const existingOrder = await Order.findOne({ bookingId: savedBooking._id });

            if (!existingOrder) return res.status(404).json({ message: 'Order not found for this booking' });

            existingOrder.paymentStatus = req.body.status;

            const updatedOrder = await existingOrder.save();

            if (!updatedOrder) return res.status(400).json({ message: 'Cannot update order' });

            return res.status(200).json(savedBooking)
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new BookingController();