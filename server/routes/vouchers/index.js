const express = require('express');
const router = express.Router();
const voucherController = require('../../controllers/voucher.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);

// POST
router.post('/', verifyAccessToken, voucherController.createVoucher);

// PUT
router.put('/:id', verifyAccessToken, voucherController.updateVoucher);

// DELETE
router.delete('/:id', verifyAccessToken, voucherController.deleteVoucher);

module.exports = router;