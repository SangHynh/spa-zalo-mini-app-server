const CryptoJS = require('crypto-js');
const TestOrder = require('../models/testorder.model');
const Order = require('../models/order.model');
const moment = require('moment');
const User = require('../models/user.model');

class PaymentController {
    // GET ORDERS
    async getOrders(req, res) {
        try {
            const orders = await Order.find().populate({
                path: 'customerId',
                select: 'name phone'
            });
            
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    // CREATE ORDER
    async createOrder(req, res) {
        try {
            let data = req.body;

            // Kiểm tra nếu body có object cart
            if (data.items) {
                const { name, total, items } = data;

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
                data.orderDate = moment(data.orderDate, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const accountId = req.payload.aud

            const user = await User.findOne({ accountId: accountId });

            if (!user) return res.status(404).json({ message: "User not found" })

            const order = new Order({
                ...data,
                customerId: user._id
            })
    
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

            order.transactionId = transactionId;
            order.paymentStatus = paymentStatus;

            const updatedOrder = await order.save();

            return res.status(200).json(updatedOrder);
        } catch (error) {
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
            const { appId, orderId, privateKey } = req.body;

            const dataMac = data = `appId=${appId}&orderId=${orderId}&privateKey=${privateKey}`;

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

    // async callback(req, res) {
    //     try {
    //         const { data, mac, overallMac } = req.body || {};

    //         if (!data || !mac) {
    //             return res.json({
    //                 returnCode: 0,
    //                 returnMessage: 'Missing data or mac',
    //             });
    //         }

    //         const { appId, amount, description, orderId, message, resultCode, transId } = data || {};
    //         if (!amount || !orderId || !appId || !description || !message || !resultCode || !transId) {
    //             return res.json({
    //                 returnCode: 0,
    //                 returnMessage: 'Missing method or orderId or appId',
    //             });
    //         }
    //         dataForMac = `appId=${appId}&amount=${amount}&description=${description}&orderId=${orderId}&message=${message}&resultCode=${resultCode}&transId=${transId}`;
    //         const reqMac = CryptoJS.HmacSHA256(
    //             dataForMac,
    //             process.env.ZALO_CHECKOUT_SECRET_KEY
    //         ).toString();

    //         if (reqMac == mac) {
    //             console.log(str)
    //             return res.json({
    //                 returnCode: 1,
    //                 returnMessage: 'Success',
    //             });
    //         } else {
    //             return res.json({
    //                 returnCode: 0,
    //                 returnMessage: 'Fail',
    //             });
    //         }
    //     } catch (e) {
    //         console.log(e);
    //         return res.json({
    //             returnCode: 0,
    //             returnMessage: 'Fail',
    //         });
    //     }
    // }
}

module.exports = new PaymentController();