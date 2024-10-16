const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/statistics.controller");
const { verifyAccessToken } = require("../../configs/jwt.config");

// GET STATISTICS INFORMATION
router.get("/revenue", verifyAccessToken, statisticsController.getRevenueStatistics);

module.exports = router;