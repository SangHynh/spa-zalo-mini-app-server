const express = require("express");
const router = express.Router();
const RankController = require("../../controllers/rank.controller");
const { verifyAccessToken } = require("../../configs/jwt.config");

//GET
router.get("/", verifyAccessToken, RankController.getRanks);

// UPDATE
router.put("/:rankId", verifyAccessToken, RankController.updateRank);

module.exports = router;
