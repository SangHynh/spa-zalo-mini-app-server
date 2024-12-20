const BookingHistory = require("../models/bookinghistory.model");
const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Service = require("../models/service.model");
const User = require("../models/user.model");
const mongoose = require('mongoose');
const moment = require('moment');
const AppConfig = require("../models/appconfig.model");
const Rank = require("../models/rank.model");
const { calculateReferralCommission } = require("../services/referral.service");

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

            let sortCriteria = { createdAt: -1 };
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

            const response = await BookingHistory.find({ customerId: user._id, ...query }).sort({ createdAt: -1 });

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

    // GET USER BOOKING BY ID
    async getUserBookingById(req, res) {
        try {
            const userId = req.payload.aud

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ message: "User not found" })

            const booking = await BookingHistory.findById(req.params.id);

            if (!booking) {
                return res.status(404).json({ message: 'Booking not found' });
            }

            if (booking.customerId.toString() !== userId) {
                return res.status(403).json({ message: "You do not have permission to view this booking" });
            }

            const servicesDetails = await Promise.all(
                booking.services.map(async (serviceItem) => {
                    const service = await Service.findById(serviceItem.serviceId).select('name price images');
                    return {
                        ...serviceItem._doc, // Giữ lại thông tin ban đầu từ booking
                        images: service?.images || [] // Lấy từ DB hoặc để trống
                    };
                })
            );

            const productsDetails = await Promise.all(
                booking.products.map(async (productItem) => {
                    const product = await Product.findById(productItem.productId).select('name price variants images');
                    const variant = product?.variants.id(productItem.variantId); // Tìm variant theo variantId
                    return {
                        ...productItem._doc, // Giữ lại thông tin ban đầu từ booking
                        volume: variant?.volume || productItem.volume,
                        images: product?.images || [] // Lấy hình ảnh từ DB hoặc để trống
                    };
                })
            );

            const servicesTotal = servicesDetails.reduce((acc, service) => acc + service.price, 0);
            const productsTotal = productsDetails.reduce((acc, product) => acc + (product.price * product.quantity), 0);
            const total = servicesTotal + productsTotal;

            return res.status(200).json({
                ...booking._doc,
                services: servicesDetails,
                products: productsDetails,
                totalAmount: total
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
                        volume: selectedVariant.volume
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
            let discountApplied = false;
            let discountAmount = 0;
            let finalAmount = totalAmount;

            if (req.body.voucherId) {
                const voucher = await Voucher.findById(req.body.voucherId);
                if (!voucher) {
                    return res.status(404).json({ message: `Voucher not found: ${req.body.voucherId}` });
                }

                const now = new Date();
                if (voucher.validFrom <= now && voucher.validTo >= now && voucher.usageLimit > 0) {
                    discountApplied = true;

                    discountAmount = totalAmount * (voucher.discountValue / 100);
                    finalAmount = Math.max(0, totalAmount - discountAmount);

                    await voucher.save();
                } else {
                    return res.status(400).json({ message: 'Voucher is not valid or has reached usage limit.' });
                }
            }

            // Create order after booking
            const order = new Order({
                bookingId: newBooking._id,
                customerId: user._id,
                orderDate: new Date(),
                totalAmount: totalAmount,
                discountApplied: discountApplied,
                discountAmount: discountAmount,
                finalAmount: finalAmount,
                paymentMethod: '',
                paymentStatus: 'pending',
                products: productDetails,
                services: serviceDetails,
                voucherId: req.body.voucherId ? req.body.voucherId : undefined
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
                const commissionResult = await calculateReferralCommission(existingOrder, existingOrder.customerId);
                if (!commissionResult.success) {
                    return res.status(500).json({ message: commissionResult.message });
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