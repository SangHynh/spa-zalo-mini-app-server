const express = require("express");
const router = express.Router();
const RankController = require("../../controllers/rank.controller");
const { verifyAccessToken } = require("../../configs/jwt.config");

//GET
router.get("/ranks", verifyAccessToken, RankController.getRanks);

// UPDATE
router.put("/ranks/:rankId", verifyAccessToken, RankController.updateRank);

module.exports = router;
