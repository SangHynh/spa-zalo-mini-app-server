const Order = require("../models/order.model");
const Product = require("../models/product.model");
const Service = require("../models/service.model");

class StatisticsController {
    async getRevenueStatistics(req, res) {
        try {
            const currentYear = new Date().getFullYear(); // Lấy năm hiện tại
            const { year = currentYear } = req.query; // Nếu không có year, dùng năm hiện tại
    
            if (isNaN(year)) {
                return res.status(400).json({ message: "Invalid year. Please provide a valid year." });
            }
    
            const startDate = new Date(parseInt(year), 0, 1); // Ngày đầu tiên của năm
            const endDate = new Date(parseInt(year), 11, 31); // Ngày cuối cùng của năm
    
            const orders = await Order.find({
                orderDate: { $gte: startDate, $lte: endDate },
                paymentStatus: 'completed',
            });
    
            // Tạo mảng chứa doanh thu cho từng tháng trong năm
            let revenueData = Array(12).fill(0);
    
            orders.forEach(order => {
                const orderMonth = new Date(order.orderDate).getMonth(); // Lấy chỉ số tháng từ 0-11
                revenueData[orderMonth] += order.finalAmount; // Cộng doanh thu vào tháng tương ứng
            });
    
            return res.status(200).json({
                revenueData, // Doanh thu theo từng tháng
                from: startDate,
                to: endDate,
                year,
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }    

    async getTopProductsAndServices(req, res) {
        try {
            const productLimit = parseInt(req.query.productLimit) || 10;
            const serviceLimit = parseInt(req.query.serviceLimit) || 10;

            // Top products
            const topProducts = await Product.find({ salesQuantity: { $gt: 0 } })
                .sort({ salesQuantity: -1 })
                .limit(productLimit)
                .select('name price salesQuantity');

            // Top Service
            const topServices = await Service.find({ timesUsed: { $gt: 0 } })
                .sort({ timesUsed: -1 })
                .limit(serviceLimit)
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