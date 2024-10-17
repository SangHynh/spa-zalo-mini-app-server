const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Service = require("../models/service.model");

class StatisticsController {
    async getRevenueStatistics(req, res) {
        try {
            const { period } = req.query; // "week", "month", "year"
            let startDate;
            let endDate = new Date();
    
            if (period === 'week') {
                startDate = new Date();
                const dayOfWeek = startDate.getDay(); 
                startDate.setDate(startDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
                endDate.setDate(startDate.getDate() + 6);
            } else if (period === 'month') {
                startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
                endDate = new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0);
            } else if (period === 'year') {
                startDate = new Date(endDate.getFullYear(), 0, 1);
                endDate = new Date(endDate.getFullYear(), 11, 31);
            } else {
                return res.status(400).json({ message: "Invalid period. Please use 'week', 'month', or 'year'." });
            }
    
            const orders = await Order.find({
                orderDate: { $gte: startDate, $lte: endDate },
                paymentStatus: 'completed',
            });
    
            let revenueData = [];
            if (period === 'week' || period === 'month') {
                const days = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1;
                revenueData = Array.from({ length: days }, () => 0);
    
                orders.forEach(order => {
                    const orderDate = new Date(order.orderDate);
                    const dayIndex = Math.floor((orderDate - startDate) / (1000 * 60 * 60 * 24)); // Tính chỉ số của ngày trong tuần hoặc tháng
                    revenueData[dayIndex] += order.finalAmount;
                });
            } else if (period === 'year') {
                revenueData = Array(12).fill(0);
    
                orders.forEach(order => {
                    const orderMonth = new Date(order.orderDate).getMonth();
                    revenueData[orderMonth] += order.finalAmount;
                });
            }
    
            return res.status(200).json({
                revenueData,
                from: startDate,
                to: endDate,
                period,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            })
        }
    }

    async getTopProductsAndServices(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;

            // Top products
            const topProducts = await Product.find({ salesQuantity: { $gt: 0 } })
                .sort({ salesQuantity: -1 })
                .limit(limit)
                .select('name price salesQuantity');

            // Top Service
            const topServices = await Service.find({ timesUsed: { $gt: 0 } })
                .sort({ timesUsed: -1 })
                .limit(limit)
                .select('name price timesUsed');

            return res.status(200).json({
                topProducts,
                topServices
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message,
            });
        }
    }
}

module.exports = new StatisticsController()