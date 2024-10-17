import React from "react";
import {
    Modal,
    Box,
    Typography,
    ImageList,
    ImageListItem,
    List,
    ListItem,
    ListItemText,
    Button,
    Grid2,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const PreviewVoucher = ({
    open,
    handleClose,
    voucherCode,
    voucherDescription,
    voucherDiscountType,
    voucherDiscountValue,
    voucherValidFrom,
    voucherValidTo,
    voucherUsageLimit,
    voucherPriceApplied,
    voucherExchangePoints
}) => {
    const { t } = useTranslation();

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "75%",
                    height: "80vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    overflow: "auto",
                }}
            >
                <Typography variant="h5" component="h2">
                    {t("preview-voucher")}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("code")} :</strong> {voucherCode}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("price-applied")} :</strong> {voucherPriceApplied}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("description")} :</strong> {voucherDescription}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("discount-type")} :</strong> {voucherDiscountType}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("discount-value")} :</strong> {voucherDiscountValue}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("valid-from")} :</strong>{" "}
                    {voucherValidFrom.format("DD/MM/YYYY")}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("valid-to")} :</strong>{" "}
                    {voucherValidTo.format("DD/MM/YYYY")}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("usage-limit")} :</strong> {voucherUsageLimit}
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    <strong>{t("exchange-points")} :</strong> {voucherExchangePoints}
                </Typography>

                <Grid2
                    container
                    fullWidth
                    spacing={2}
                    sx={{ mt: 2, justifyContent: "flex-end" }}
                >
                    <Grid2>
                        <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">
                            {t("close")}
                        </Button>
                    </Grid2>
                </Grid2>
            </Box>
        </Modal>
    );
};

export default PreviewVoucher;
