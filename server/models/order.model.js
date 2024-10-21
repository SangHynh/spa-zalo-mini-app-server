const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: false },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    orderDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    discountApplied: { type: Boolean, required: true },
    discountAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: false },
    paymentStatus: { type: String, required: false },
    transactionId: { type: String, required: false }, // ZALO ORDERID
    remarks: { type: String, required: false },
    referralId: { type: mongoose.Schema.Types.ObjectId, required: false },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    services: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId },
        serviceName: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    voucherId: { type: mongoose.Schema.Types.ObjectId, required: false },
    address: { type: String, required: false, default: "" }
},{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
