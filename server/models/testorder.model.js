const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    total: { type: Number, required: true },
    items: [{
        product: {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
        },
        quantity: { type: Number, required: true }
    }],
},{
    timestamps: true
});

const TestOrder = mongoose.model('TestOrder', orderSchema);

module.exports = TestOrder;
