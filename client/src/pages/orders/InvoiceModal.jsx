import React, { Fragment } from 'react';
import { toPng } from 'html-to-image';
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

const InvoiceModal = ({
    isOpen,
    setIsOpen,
    invoiceInfo,
    items,
}) => {
    const closeModal = () => {
        setIsOpen(false);
    };

    const SaveAsPDFHandler = () => {
        const dom = document.getElementById('print');
        toPng(dom)
            .then((dataUrl) => {
                const img = new Image();
                img.crossOrigin = 'annoymous';
                img.src = dataUrl;
                img.onload = () => {
                    const pdf = new jsPDF({
                        orientation: 'portrait',
                        unit: 'in',
                        format: [5.5, 8.5],
                    });

                    const imgProps = pdf.getImageProperties(img);
                    const imageType = imgProps.fileType;
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pxFullHeight = imgProps.height;
                    const pxPageHeight = Math.floor((imgProps.width * 8.5) / 5.5);
                    const nPages = Math.ceil(pxFullHeight / pxPageHeight);
                    let pageHeight = pdf.internal.pageSize.getHeight();

                    const pageCanvas = document.createElement('canvas');
                    const pageCtx = pageCanvas.getContext('2d');
                    pageCanvas.width = imgProps.width;
                    pageCanvas.height = pxPageHeight;

                    for (let page = 0; page < nPages; page++) {
                        if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
                            pageCanvas.height = pxFullHeight % pxPageHeight;
                            pageHeight = (pageCanvas.height * pdfWidth) / pageCanvas.width;
                        }
                        const w = pageCanvas.width;
                        const h = pageCanvas.height;
                        pageCtx.fillStyle = 'white';
                        pageCtx.fillRect(0, 0, w, h);
                        pageCtx.drawImage(img, 0, page * pxPageHeight, w, h, 0, 0, w, h);

                        if (page) pdf.addPage();

                        const imgData = pageCanvas.toDataURL(`image/${imageType}`, 1);
                        pdf.addImage(imgData, imageType, 0, 0, pdfWidth, pageHeight);
                    }
                    pdf.save(`invoice-${invoiceInfo.invoiceNumber}.pdf`);
                };
            })
            .catch((error) => {
                console.error('oops, something went wrong!', error);
            });
    };

    return (
        <Dialog open={isOpen} onClose={closeModal} maxWidth="md" fullWidth>
            <DialogContent>
                <Box id="print" p={4}>
                    <Typography variant="h6" align="center" gutterBottom>
                        INVOICE
                    </Typography>
                    <Box mt={6}>
                        <Box mb={4}>
                            <Typography><strong>Invoice Number:</strong> {invoiceInfo.invoiceNumber}</Typography>
                            <Typography><strong>Cashier:</strong> {invoiceInfo.cashierName}</Typography>
                            <Typography><strong>Customer:</strong> {invoiceInfo.customerName}</Typography>
                        </Box>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ITEM</TableCell>
                                    <TableCell align="center">QTY</TableCell>
                                    <TableCell align="right">PRICE</TableCell>
                                    <TableCell align="right">AMOUNT</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell align="center">{item.qty}</TableCell>
                                        <TableCell align="right">${Number(item.price).toFixed(2)}</TableCell>
                                        <TableCell align="right">${Number(item.price * item.qty).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <Box mt={4}>
                            <Divider />
                            <Box display="flex" justifyContent="space-between" pt={2}>
                                <Typography><strong>Subtotal:</strong></Typography>
                                <Typography>${invoiceInfo.subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography><strong>Discount:</strong></Typography>
                                <Typography>${invoiceInfo.discountRate.toFixed(2)}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between">
                                <Typography><strong>Tax:</strong></Typography>
                                <Typography>${invoiceInfo.taxRate.toFixed(2)}</Typography>
                            </Box>
                            <Divider />
                            <Box display="flex" justifyContent="space-between" py={2}>
                                <Typography variant="h6"><strong>Total:</strong></Typography>
                                <Typography variant="h6"><strong>${invoiceInfo.total.toFixed(2)}</strong></Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" color="primary" onClick={SaveAsPDFHandler}>
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InvoiceModal;
