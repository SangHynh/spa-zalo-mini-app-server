const express = require('express');
const router = express.Router();
const minigameController = require('../../controllers/minigame.controller');
const { verifyAccessToken } = require('../../configs/jwt.config')

router.post('/play', minigameController.playMinigame);
router.put('/update-points', minigameController.updatePoints);

module.exports = router