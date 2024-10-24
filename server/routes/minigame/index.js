const express = require('express');
const router = express.Router();
const minigameController = require('../../controllers/minigame.controller');
const { verifyAccessToken } = require('../../configs/jwt.config')// miniapp-> minigame-> server

router.get('/play-count', minigameController.getPlayCount);
router.post('/play', minigameController.playMinigame);
router.put('/update-points', minigameController.updatePoints);
router.put('/update-play-count', minigameController.updatePlayCount);

module.exports = router