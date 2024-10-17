const express = require("express");
const router = express.Router();
const RankController = require("../../controllers/rank.controller");
const { verifyAccessToken } = require("../../configs/jwt.config");

//GET
router.get("/", verifyAccessToken, RankController.getRanks);

// GET CURRENT USER RANK
router.get("/current", verifyAccessToken, RankController.getCurrentUserRank)

// CREATE
router.post("/", verifyAccessToken, RankController.createRank);

// UPDATE
router.put("/:rankId", verifyAccessToken, RankController.updateRank);

// DELETE
router.delete("/:rankId", verifyAccessToken, RankController.deleteRank);

module.exports = router;
