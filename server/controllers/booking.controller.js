const BookingHistory = require("../models/bookinghistory.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const mongoose = require('mongoose');
const moment = require('moment');
const AppConfig = require("../models/appconfig.model");
const Rank = require("../models/rank.model");

class BookingController {

    // GET BOOKING HISTORIES
    async getBookingHistories(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;

            const skip = (page - 1) * limit;

            const { keyword, status, sortBy, sortOrder } = req.query;

            // Tạo điều kiện tìm kiếm
            const query = {};
            let userIds = [];

            if (keyword) {
                const userSearchCriteria = {
                    $or: [
                        { phone: { $regex: keyword, $options: 'i' } }, // Case-insensitive search by phone
                        { name: { $regex: keyword, $options: 'i' } }  // Case-insensitive search by name
                    ]
                };

                const users = await User.find(userSearchCriteria).select('_id');
                userIds = users.map(user => user._id); // Extract user IDs

                const isObjectId = mongoose.Types.ObjectId.isValid(keyword);
                if (isObjectId) {
                    query.$or = [
                        { _id: new mongoose.Types.ObjectId(keyword) },
                        { customerId: new mongoose.Types.ObjectId(keyword) } // Also search by customerId
                    ];
                }

                // If users were found, include their IDs in the query
                if (userIds.length > 0) {
                    query.$or = query.$or || [];
                    query.$or.push({ customerId: { $in: userIds } }); // Add userIds to the query
                }
            }

            if (status) {
                query.status = { $regex: status, $options: 'i' }; // Case-insensitive search
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
            const userId = req.payload.aud

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ message: "User not found" })

            const { status } = req.query;
            // console.log(user)

            const query = {};

            if (status) {
                query.status = { $regex: status, $options: 'i' }; // Case-insensitive search
            }

            const response = await BookingHistory.find({ customerId: user._id, ...query });

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
            const userId = req.payload.aud
            // const { userId } = req.params.id

            console.log(userId)

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            if (req.body.date) {
                req.body.date = moment(req.body.date, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
            }

            // Check are there any booking exist at this time
            const existingBooking = await BookingHistory.findOne({
                customerId: user._id,
                date: { $eq: req.body.date }
            });

            if (existingBooking) {
                return res.status(409).json({ message: 'A booking already exists at this date and time.' });
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

            booking.status = "cancelled";

            const savedBooking = await booking.save()

            if (!savedBooking) return res.status(400).json({ message: 'Cannot update booking status' })

            const existingOrder = await Order.findOne({ bookingId: savedBooking._id });

            if (!existingOrder) return res.status(404).json({ message: 'Order not found for this booking' });

            existingOrder.paymentStatus = "cancelled";

            const savedOrder = await existingOrder.save()

            if (!savedOrder) return res.status(400).json({ message: 'Cannot update order status' })
            
            return res.status(200).json({
                message: 'Booking deleted ssavedOrderuccessfully',
                booking,
                order: savedOrder ? savedOrder : 'No associated order'
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

            // Booking đã completed thì không cập nhật nữa
            // if (booking.status === "completed") return res.status(400).json({ message: 'Booking is already completed' })

            booking.status = req.body.status;

            const savedBooking = await booking.save()

            if (!savedBooking) return res.status(400).json({ message: 'Cannot update booking status' })

            const existingOrder = await Order.findOne({ bookingId: savedBooking._id });

            if (!existingOrder) return res.status(404).json({ message: 'Order not found for this booking' });

            const checkedStatus = existingOrder.paymentStatus

            existingOrder.paymentStatus = req.body.status;

            if (existingOrder.paymentStatus === "completed" && checkedStatus !== "completed") {
                if (existingOrder.products && existingOrder.products.length > 0) {
                    // CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
                    for (let productOrder of existingOrder.products) {
                        const product = await Product.findById(productOrder.productId);
                        if (!product) {
                            return res.status(404).json({ message: `Product with ID ${productOrder.productId} not found` });
                        }

                        // Nếu sản phẩm có variant, tìm và cập nhật stock của variant
                        if (productOrder.variantId) {
                            const variant = product.variants.id(productOrder.variantId);
                            if (!variant) {
                                return res.status(404).json({ message: `Variant with ID ${productOrder.variantId} not found` });
                            }

                            if (variant.stock < productOrder.quantity) {
                                return res.status(400).json({ message: `Insufficient stock for variant ${variant._id}` });
                            }

                            variant.stock -= productOrder.quantity;
                            product.salesQuantity += productOrder.quantity;

                            // Tính lại tổng stock của sản phẩm từ tất cả các variant còn lại
                            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);

                            product.stock = totalStock;
                        } else {
                            if (product.stock < productOrder.quantity) {
                                return res.status(400).json({ message: `Insufficient stock for product ${product._id}` });
                            }

                            product.stock -= productOrder.quantity;
                            product.salesQuantity += productOrder.quantity;
                        }

                        await product.save({ validateBeforeSave: false });
                    }

                }

                // CẬP NHẬT SỐ LẦN SỬ DỤNG DỊCH VỤ
                if (existingOrder.services && existingOrder.services.length > 0) {
                    for (let serviceOrder of existingOrder.services) {
                        const service = await Service.findById(serviceOrder.serviceId);
                        if (!service) {
                            return res.status(404).json({ message: `Service with ID ${serviceOrder.serviceId} not found` });
                        }

                        service.timesUsed += 1;
                        await service.save({ validateBeforeSave: false });
                    }
                }

                // CẬP NHẬT ĐIỂM CHO USER + CẬP NHẬT ĐIỂM CHO NGƯỜI GIỚI THIỆU (PLANNED)
                const appConfig = await AppConfig.findOne()
                const user = await User.findById(existingOrder.customerId);
                if (!user) return res.status(404).json({ message: "User not found" });
                if (appConfig) {
                    const sortedOrderPoints = appConfig.orderPoints.sort((a, b) => b.price - a.price);
                    for (let pointLevel of sortedOrderPoints) {
                        console.log(pointLevel)
                        if (existingOrder.finalAmount >= pointLevel.price) {

                            user.points += pointLevel.minPoints;
                            user.rankPoints += pointLevel.minPoints;

                            await user.save({ validateBeforeSave: false }) 

                            break;
                        }
                    }
                }
                // TÍNH TIỀN HOA HỒNG
                if (user.referralInfo && user.referralInfo.paths) {
                    const referralPaths = user.referralInfo.paths.split(',').filter(path => path.trim() !== "");

                    // Get commission percentage for the user based on their rank
                    const userRank = await Rank.findOne({ tier: user.membershipTier });
                    let commissionAmount = existingOrder.finalAmount * (userRank.commissionPercent / 100);

                    for (let i = referralPaths.length - 2; i >= 0; i--) {
                        const refCode = referralPaths[i];
                        const refUser = await User.findOne({ referralCode: refCode });

                        if (refUser) {
                            const refUserRank = await Rank.findOne({ tier: refUser.membershipTier });
                            if (refUserRank) {
                                refUser.amounts += commissionAmount;
                                await refUser.save();

                                commissionAmount *= (refUserRank.commissionPercent / 100);
                            }
                        }
                    }
                }   
            }

            const updatedOrder = await existingOrder.save({ validateBeforeSave: false });

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