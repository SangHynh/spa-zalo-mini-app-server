const mongoose = require('mongoose');

const bookingHistorySchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId },
    serviceName: { type: String, required: true },
    date: { type: Date, required: true },
    price: { type: Number, required: true },
    discountApplied: { type: Boolean, required: true },
    brand: { type: String, required: true },
    rating: { type: Number, required: true },
    feedback: { type: String, required: true },
    status: { type: String, enum: ['completed', 'pending', 'cancelled'], required: true },
},{
    timestamps: true
});

const BookingHistory = mongoose.model('BookingHistory', bookingHistorySchema);

module.exports = BookingHistory;
