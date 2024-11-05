const express = require('express');
const router = express.Router();
const minigameController = require('../../controllers/minigame.controller');
const { verifyAccessToken } = require('../../configs/jwt.config')// miniapp-> minigame-> server

router.post('/play-count', minigameController.getPlayCount);
router.post('/play', minigameController.playMinigame);
router.post('/update-points', minigameController.updatePoints);
router.put('/update-play-count', minigameController.updatePlayCount);

module.exports = router