import React, { Fragment, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import {
    Dialog,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Divider,
    Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const InvoiceModal = ({
    isOpen,
    setIsOpen,
    order
}) => {
    const { t } = useTranslation();
    const printRef = useRef();

    const closeModal = () => {
        setIsOpen(false);
    };

    const SaveAsPDFHandler = () => {
        
    };

    return (
        <Dialog open={isOpen} onClose={closeModal} maxWidth="md">
            <DialogContent>
                <Box id="print" p={4} ref={printRef}>
                    <Typography variant="h4" align="center" gutterBottom>
                        * {t('receipt')} *
                    </Typography>
                    <Box mt={4}>
                        <Box mb={4}>
                            <Typography><strong>{t('invoice-number')}:</strong> {order?._id}</Typography>
                            <Typography><strong>{t('order-date')}: </strong>
                                {new Date(order?.orderDate).toLocaleString("vi-VN", {
                                    timeZone: "Asia/Ho_Chi_Minh",
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false, // 24-hour format
                                })}
                            </Typography>
                            <Typography><strong>{t('customer')}:</strong> {order?.customerId?.name}</Typography>
                            <Typography><strong>{t('phone')}:</strong> {order?.customerId?.phone}</Typography>
                        </Box>

                        <Typography><strong>{t('products')}:</strong></Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('product')}</TableCell>
                                    <TableCell align="center">QTY</TableCell>
                                    <TableCell align="right">PRICE</TableCell>
                                    <TableCell align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order?.products?.map((item) => (
                                    <TableRow key={item?.productId}>
                                        <TableCell>{item?.productName}</TableCell>
                                        <TableCell align="center">{item?.quantity}</TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item?.price)}
                                        </TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item?.price * item?.quantity)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Typography><strong>{t('services')}:</strong></Typography>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t('service')}</TableCell>
                                    <TableCell align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {order?.services?.map((item) => (
                                    <TableRow key={item?.serviceId}>
                                        <TableCell>{item?.serviceName}</TableCell>
                                        <TableCell align="right">
                                            {new Intl.NumberFormat("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }).format(item?.price)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box mt={4}>
                            <Divider />
                            <Box display="flex" justifyContent="space-between" pt={2}>
                                <Typography><strong>Subtotal:</strong></Typography>
                                <Typography>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.totalAmount)}
                                </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography><strong>Discount:</strong></Typography>
                                <Typography>
                                    {new Intl.NumberFormat("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }).format(order?.discountAmount)}
                                </Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="space-between" py={2}>
                                <Typography variant="h6"><strong>Total:</strong></Typography>
                                <Typography variant="h6">
                                    <strong>
                                        {new Intl.NumberFormat("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        }).format(order?.finalAmount)}
                                    </strong>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={SaveAsPDFHandler}>
                    {t('print')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceModal;
