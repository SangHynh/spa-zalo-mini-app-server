const CryptoJS = require('crypto-js');
const TestOrder = require('../models/testorder.model');

class PaymentController {
    async createTestOrder(req, res) {
        try {
            const data = req.body;

            const order = await TestOrder.create(data)

            return res.status(201).json(order);
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
        } catch (e) {
            console.log(e);
            return res.json({
                returnCode: 0,
                returnMessage: 'Fail',
            });
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