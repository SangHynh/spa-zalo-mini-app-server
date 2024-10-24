const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/statistics.controller");
const { verifyAccessToken } = require("../../configs/jwt.config");
const { hasPermission } = require("../../middlewares/permission.middleware");

// GET OVERVIEW STATISTICS
router.get("/overview", verifyAccessToken, hasPermission(['all']), statisticsController.getOverviewStatistic)

// GET STATISTICS INFORMATION
router.get("/revenue", verifyAccessToken, hasPermission(['all']), statisticsController.getRevenueStatistics);

// GET TOP PRODUCTS, SERVICES
router.get("/top-products-services", verifyAccessToken, hasPermission(['all']), statisticsController.getTopProductsAndServices);

module.exports = router;