const Voucher = require("../models/voucher.model")
const moment = require('moment');

class VoucherController {
    // GET VOUCHERS
    async getVouchers(req, res) {
        try {
            const vouchers = await Voucher.find()
            return res.status(200).json(vouchers)
        } catch (error) {
            return res.status(500).json({
                error: error,
                message: 'An error occurred' 
            })
        }
    }

    // GET VOUCHER
    async getVoucherById(req, res) {
        try {
            const voucher = await Voucher.findById(req.params.id);
            if (!voucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }
            return res.status(200).json({ voucher });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }
    
    // POST CATEGORY
    async createVoucher(req, res) {
        try {
            if (req.body.validFrom) {
                req.body.validFrom = moment(req.body.validFrom, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            if (req.body.validTo) {
                req.body.validTo = moment(req.body.validTo, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const voucher = new Voucher({
                ...req.body
            });

            const savedVoucher = await voucher.save();

            if (!savedVoucher) {
                return res.status(400).json({
                    message: 'Cannot create voucher'
                });
            }

            return res.status(201).json(savedVoucher);
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // PUT CATEGORY
    async updateVoucher(req, res) {
        try {
            if (req.body.validFrom) {
                req.body.validFrom = moment(req.body.validFrom, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            if (req.body.validTo) {
                req.body.validTo = moment(req.body.validTo, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const updatedVoucher = await Voucher.findByIdAndUpdate(
                req.params.id,
                {
                    ...req.body
                },
                { new: true }
            );

            if (!updatedVoucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            return res.status(200).json(updatedVoucher);
        } catch (error) {
            return res.status(400).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }

    // DELETE CATEGORY
    async deleteVoucher(req, res) {
        try {
            const voucher = await Voucher.findByIdAndDelete(req.params.id);

            if (!voucher) {
                return res.status(404).json({ message: 'Voucher not found' });
            }

            return res.status(200).json({ message: 'Voucher deleted successfully' });
        } catch (error) {
            return res.status(500).json({
                error: error.message,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = new VoucherController()