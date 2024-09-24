const express = require('express');
const router = express.Router();
const voucherController = require('../../controllers/voucher.controller')

// GET
router.get('/', voucherController.getVouchers);
router.get('/:id', voucherController.getVoucherById);

// POST
router.post('/', voucherController.createVoucher);

// PUT
router.put('/:id', voucherController.updateVoucher);

// DELETE
router.delete('/:id', voucherController.deleteVoucher);

module.exports = router;