const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId },
    date: { type: Date, required: true },
    status: { type: String, enum: ['completed', 'pending', 'cancelled', 'approved'], required: true, default: 'pending' },
    services: [{
        serviceId: { type: mongoose.Schema.Types.ObjectId },
        serviceName: { type: String, required: true },
        price: { type: Number, required: true },
    }],
    products: [{
        productId: { type: mongoose.Schema.Types.ObjectId },
        variantId: { type: mongoose.Schema.Types.ObjectId },
        productName: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        volume: { type: String, required: false }
    }]
},{
    timestamps: true
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);

module.exports = BookingHistory;
