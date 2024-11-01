const express = require('express');
const router = express.Router();
const voucherController = require('../../controllers/voucher.controller')
const { verifyAccessToken } = require('../../configs/jwt.config')

// GET
router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);
router.get('/user/vouchers', verifyAccessToken, voucherController.getUserVouchers);
router.get('/user/invalid-vouchers', verifyAccessToken, voucherController.getUserInvalidVouchers);
router.get('/user/can-exchange', verifyAccessToken, voucherController.getVouchersUserCanExchange);

// POST
router.post('/', verifyAccessToken, voucherController.createVoucher);
router.post('/giveAway', verifyAccessToken, voucherController.giveAwayVouchers)

// PUT
router.put('/:id', verifyAccessToken, voucherController.updateVoucher);

// DÙNG ĐIỂM ĐỔI VOUCHER
router.put('/exchange/:id', verifyAccessToken, voucherController.exchangeVoucher);

// DELETE
router.delete('/:id', verifyAccessToken, voucherController.deleteVoucher);

module.exports = router;