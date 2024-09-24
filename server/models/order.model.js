const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, required: false },
    customerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    orderDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    discountApplied: { type: Boolean, required: true },
    discountAmount: { type: Number, required: true },
    finalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, required: true },
    transactionId: { type: String, required: false },
    remarks: { type: String, required: false },
    referralId: { type: mongoose.Schema.Types.ObjectId, required: false },
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
    }],
    voucherId: { type: mongoose.Schema.Types.ObjectId, required: false },
},{
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
