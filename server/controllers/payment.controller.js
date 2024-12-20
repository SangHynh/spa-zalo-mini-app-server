const CryptoJS = require('crypto-js');
const TestOrder = require('../models/testorder.model');
const Order = require('../models/order.model');
const moment = require('moment');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Voucher = require('../models/voucher.model');
const AppConfig = require('../models/appconfig.model');
const Rank = require('../models/rank.model');
const BookingHistory = require('../models/bookinghistory.model');
const { calculateReferralCommission } = require('../services/referral.service');

class PaymentController {
    // GET ORDERS
    async getOrders(req, res) {
        try {
            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const skip = (page - 1) * limit;

            const { keyword, status } = req.query;

            const query = {};
            let userMap = {};

            if (keyword) {
                const users = await User.find({
                    $or: [
                        { name: { $regex: keyword, $options: 'i' } },
                        { phone: { $regex: keyword, $options: 'i' } }
                    ]
                }).select('_id name phone');

                const userIds = users.map(user => user._id);

                if (userIds.length === 0) {
                    return res.status(200).json({
                        orders: [],
                        currentPage: page,
                        totalPages: 0,
                        totalOrders: 0,
                    });
                }

                users.forEach(user => {
                    userMap[user._id] = { name: user.name, phone: user.phone };
                });

                query.customerId = { $in: userIds };
            }

            if (status) {
                query.paymentStatus = status
            }

            const orders = await Order.find(query)
                .populate({
                    path: 'customerId',
                    select: 'name phone',
                })
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });

            const totalOrders = await Order.countDocuments(query);

            const enrichedOrders = orders.map(order => {
                const customerInfo = userMap[order.customerId] || {};
                return {
                    ...order.toObject(),
                    customerName: customerInfo.name || 'Unknown',
                    customerPhone: customerInfo.phone || 'Unknown'
                };
            });

            return res.status(200).json({
                orders: enrichedOrders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error.message);
        }
    }

    // CREATE ORDER
    async createOrder(req, res) {
        try {
            let data = req.body;

            // Kiểm tra nếu body có object cart
            if (data.items) {
                const { items } = data;

                // Chuyển đổi các items trong cart thành products cho bảng Order
                data.products = items.map(item => ({
                    productId: item.product.id,
                    variantId: item.product.variantId,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                }));
            } else {
                // Nếu không phải cart, xử lý trường products thông thường
                data.products = data.products;
            }

            if (data.orderDate) {
                data.orderDate = moment(data.orderDate).format('YYYY-MM-DD');
            }

            const userId = req.payload.aud

            const user = await User.findById(userId);

            if (!user) return res.status(404).json({ message: "User not found" })

            // Check product stock availability
            for (let productOrder of data.products) {
                const product = await Product.findById(productOrder.productId);
                if (!product) {
                    return res.status(404).json({ message: `Product with ID ${productOrder.productId} not found` });
                }

                // Nếu sản phẩm có variant, kiểm tra số lượng của variant
                if (productOrder.variantId) {
                    const variant = product.variants.id(productOrder.variantId);
                    if (!variant) {
                        return res.status(404).json({ message: `Variant with ID ${productOrder.variantId} not found` });
                    }

                    if (variant.stock < productOrder.quantity) {
                        return res.status(400).json({ message: `Insufficient stock for variant ${variant._id}` });
                    }
                } else {
                    // Nếu không có variant, kiểm tra stock của sản phẩm chính
                    if (product.stock < productOrder.quantity) {
                        return res.status(400).json({ message: `Insufficient stock for product ${product._id}` });
                    }
                }
            }

            let discountAmount = 0;
            let discountApplied = false;
            let finalAmount = data.totalAmount;

            if (data.voucherId && data.voucherId !== "") {
                const voucher = await Voucher.findById(data.voucherId);
                if (!voucher) return res.status(404).json({ message: "Voucher not found" });

                const now = new Date();
                if (now < voucher.validFrom || now > voucher.validTo) {
                    return res.status(400).json({ message: "Voucher is not valid" });
                }

                discountApplied = true;

                discountAmount = (data.totalAmount * voucher.discountValue) / 100;

                if (discountAmount > data.totalAmount) {
                    discountAmount = data.totalAmount;
                }

                finalAmount = data.totalAmount - discountAmount;
            } else {
                data.voucherId = null
            }

            const order = new Order({
                ...data,
                customerId: user._id,
                discountApplied,
                discountAmount,
                finalAmount,
                address: data.address,
            });

            // Tạo order
            const newOrder = await Order.create(order);

            return res.status(201).json(newOrder);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    // GET ORDER
    async getOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id)
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    // UPDATE ORDER
    async updateOrderWithZaloOrderId(req, res) {
        try {
            const { transactionId, paymentStatus } = req.body;

            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const checkedStatus = order.paymentStatus;

            order.transactionId = transactionId;
            order.paymentStatus = paymentStatus;

            // Cập nhật thành completed và giảm só lượng sản phẩm
            if (paymentStatus === "completed" && checkedStatus !== "completed") {
                // CẬP NHẬT SỐ LƯỢNG SẢN PHẨM
                for (let productOrder of order.products) {
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

                    await product.save();
                }

                // CẬP NHẬT ĐIỂM CHO USER + CẬP NHẬT ĐIỂM CHO NGƯỜI GIỚI THIỆU (PLANNED)
                const appConfig = await AppConfig.findOne()
                const user = await User.findById(order.customerId);
                if (!user) return res.status(404).json({ message: "User not found" });

                // CẬP NHẬT ĐIỂM
                if (appConfig) {
                    const sortedOrderPoints = appConfig.orderPoints.sort((a, b) => b.price - a.price);
                    for (let pointLevel of sortedOrderPoints) {
                        if (order.finalAmount >= pointLevel.price) {

                            user.points += pointLevel.minPoints;
                            user.rankPoints += pointLevel.minPoints;

                            break;
                        }
                    }
                }

                // CẬP NHẬT VOUCHER
                if (order.voucherId && order.discountApplied) {
                    const existingVoucherIndex = user.vouchers.findIndex(v => v.voucherId.toString() === order.voucherId.toString());
                
                    if (existingVoucherIndex !== -1 && user.vouchers[existingVoucherIndex].usageLimit > 0) {
                        user.vouchers[existingVoucherIndex].usageLimit -= 1;
                    }
                }

                // CẬP NHẬT GIỎ HÀNG NẾU CÓ SAU KHI MUA THÀNH CÔNG
                if (user.carts && user.carts.length > 0) {
                    user.carts = user.carts.filter(cartItem =>
                        !order.products.some(productOrder =>
                            cartItem.productId.toString() === productOrder.productId.toString() &&
                            cartItem.variantId?.toString() === productOrder.variantId?.toString()
                        )
                    );
                }
                
                await user.save({ validateBeforeSave: false });

                // TÍNH TIỀN HOA HỒNG
                const commissionResult = await calculateReferralCommission(order, order.customerId);
                if (!commissionResult.success) {
                    return res.status(500).json({ message: commissionResult.message });
                }
            }

            const updatedOrder = await order.save();

            return res.status(200).json(updatedOrder);
        } catch (error) {
            console.log(error.message)
            return res.status(500).json(error.message);
        }
    }

    // CREATE MAC
    async createMac(req, res) {
        try {
            const body = req.body;
            const dataMac = Object.keys(body)
                .sort()
                .map(
                    (key) =>
                        `${key}=${typeof body[key] === "object"
                            ? JSON.stringify(body[key])
                            : body[key]
                        }`
                )
                .join('&');

            // console.log(dataMac)

            const mac = CryptoJS.HmacSHA256(
                dataMac,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();
            return res.status(200).json({ mac });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    // ZALO NOTIFY
    async zaloNotify(req, res) {
        try {
            const { data, mac } = req.body || {};
            if (!data || !mac) {
                return res.json({
                    returnCode: 0,
                    returnMessage: 'Missing data or mac',
                });
            }
            const { method, orderId, appId } = data || {};
            if (!method || !orderId || !appId) {
                return res.json({
                    returnCode: 0,
                    returnMessage: 'Missing method or orderId or appId',
                });
            }
            const str = `appId=${appId}&orderId=${orderId}&method=${method}`;
            const reqMac = CryptoJS.HmacSHA256(
                str,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();

            if (reqMac == mac) {
                // console.log("SUCCESS: ", str)
                return res.json({
                    returnCode: 1,
                    returnMessage: 'Success',
                });
            } else {
                return res.json({
                    returnCode: 0,
                    returnMessage: 'Fail',
                });
            }
        } catch (e) {
            console.log(e);
            return res.json({
                returnCode: 0,
                returnMessage: 'Fail',
            });
        }
    }

    async createMacForGetOrderStatus(req, res) {
        try {
            const { appId, orderId } = req.body;

            const dataMac = `appId=${appId}&orderId=${orderId}&privateKey=${process.env.ZALO_CHECKOUT_SECRET_KEY}`;

            // console.log(dataMac)

            const mac = CryptoJS.HmacSHA256(
                dataMac,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();
            return res.status(200).json({ mac });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async createMacForUpdateOrderStatus(req, res) {
        try {
            const { appId, orderId, privateKey, resultCode } = req.body;

            const dataMac = data = `appId=${appId}&orderId=${orderId}&resultCode=${resultCode}&privateKey=${privateKey}`;

            // console.log(dataMac)

            const mac = CryptoJS.HmacSHA256(
                dataMac,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();
            return res.status(200).json({ mac });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async createMacForCreateRefund(req, res) {
        try {
            const { appId, transId, privateKey, amount, description } = req.body;

            const dataMac = data = `appId=${appId}&transId=${transId}&amount=${amount}&description=${description}&privateKey=${privateKey}`;

            // console.log(dataMac)

            const mac = CryptoJS.HmacSHA256(
                dataMac,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();
            return res.status(200).json({ mac });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async createMacForGetRefundStatus(req, res) {
        try {
            const { appId, refundId, privateKey } = req.body;

            const dataMac = data = `appId=${appId}&refundId=${refundId}&privateKey=${privateKey}`;

            // console.log(dataMac)

            const mac = CryptoJS.HmacSHA256(
                dataMac,
                process.env.ZALO_CHECKOUT_SECRET_KEY
            ).toString();
            return res.status(200).json({ mac });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async callback(req, res) {
        try {
            const { data, mac, overallMac } = req.body || {};

            if (!data || !mac) {
                return res.json({
                    returnCode: 0,
                    returnMessage: 'Missing data or mac',
                });
            }

            const { appId, amount, description, orderId, message, resultCode, transId, method, extradata } = data || {};
            if (!amount || !orderId || !appId || !description || !message || !resultCode || !transId) {
                return res.json({
                    returnCode: 0,
                    returnMessage: 'Missing method or orderId or appId',
                });
            }

            if (method && extradata) {
                const dataOverallMac = Object.keys(data)
                    .sort() // sắp xếp key của Object data theo thứ tự từ điển tăng dần
                    .map((key) => `${key}=${data[key]}`) // trả về mảng dữ liệu dạng [{key=value}, ...]
                    .join("&"); // chuyển về dạng string kèm theo "&", ví dụ: amount={amount}&appId={appId}&description={description}&extradata={extradata}&merchantTransId={merchantTransId}&message={message}&method={method}&orderId={orderId}&resultCode={resultCode}&transId={transId}&transTime={transTime}

                // Tạo overall mac từ dữ liệu
                const reqOveralMac = CryptoJS.HmacSHA256(
                    dataOverallMac,
                    process.env.ZALO_CHECKOUT_SECRET_KEY
                ).toString();

                // Kiểm tra tính hợp lệ của toàn bộ dữ liệu
                if (reqOveralMac == overallMac) {
                    return res.json({
                        returnCode: 1,
                        returnMessage: 'Success',
                    });
                } else {
                    return res.json({
                        returnCode: 0,
                        returnMessage: 'Fail',
                    });
                }
            } else {
                const dataForMac = `appId=${appId}&amount=${amount}&description=${description}&orderId=${orderId}&message=${message}&resultCode=${resultCode}&transId=${transId}`;

                const reqMac = CryptoJS.HmacSHA256(
                    dataForMac,
                    process.env.ZALO_CHECKOUT_SECRET_KEY
                ).toString();

                if (reqMac == mac) {
                    console.log(str)
                    return res.json({
                        returnCode: 1,
                        returnMessage: 'Success',
                    });
                } else {
                    return res.json({
                        returnCode: 0,
                        returnMessage: 'Fail',
                    });
                }
            }

        } catch (e) {
            console.log(e);
            return res.json({
                returnCode: 0,
                returnMessage: 'Fail',
            });
        }
    }

    async deleteOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id)

            if (!order) return res.status(404).json({ message: 'Order not found' });

            if (order.bookingId) {
                const booking = await BookingHistory.findById(order.bookingId)

                if (!booking) return res.status(404).json({ message: 'Booking not found' });

                await BookingHistory.findByIdAndDelete(order.bookingId);
            }

            await Order.findByIdAndDelete(req.params.id);

            return res.status(200).json({ message: 'Order and related booking (if any) deleted successfully' });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    async deleteOrders(req, res) {
        try {
            const { orderIds } = req.body;

            if (!orderIds || !Array.isArray(orderIds)) {
                return res.status(400).json({ message: 'Invalid orderIds array' });
            }

            await Promise.all(orderIds.map(async (orderId) => {
                const order = await Order.findById(orderId);

                if (order) {
                    // Nếu order có bookingId, tiến hành xóa booking trước
                    if (order.bookingId) {
                        const booking = await BookingHistory.findById(order.bookingId);
                        if (booking) {
                            await BookingHistory.findByIdAndDelete(order.bookingId);
                        }
                    }

                    await Order.findByIdAndDelete(orderId);
                }
            }));

            return res.status(200).json({ message: 'All orders and related bookings (if any) deleted successfully' });
        } catch (e) {
            return res.status(500).json(e.message);
        }
    }

    // GET USER HISTORY (PAYMENT WITHOUT BOOKING)
    async getOrdersByUser(req, res) {
        try {
            const userId = req.payload.aud;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            const page = Math.max(1, parseInt(req.query.page) || 1);
            const limit = Math.max(1, parseInt(req.query.limit) || 10);
            const skip = (page - 1) * limit;

            const { status = "completed" } = req.query;

            const query = { customerId: userId, products: { $ne: [] } };

            if (status) {
                query.paymentStatus = status;
            }

            const orders = await Order.find(query)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
                .lean();

            const totalOrders = await Order.countDocuments(query);

            for (const order of orders) {
                for (const product of order.products) {
                    const productData = await Product.findById(product.productId, 'images variants').lean();

                    product.images = productData ? productData.images : [];

                    if (productData && productData.variants) {
                        const variant = productData.variants.find(variant => variant._id.toString() === product.variantId.toString());
                        product.volume = variant ? variant.volume : null;
                    }
                }
            }

            return res.status(200).json({
                orders,
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new PaymentController();
