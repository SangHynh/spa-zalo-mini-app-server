import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
    Autocomplete,
    Backdrop,
    Checkbox,
    CircularProgress,
    Container,
    FormControl,
    Grid2,
    IconButton,
    ImageList,
    ImageListItem,
    Input,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Modal,
    styled,
    TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
    benefits,
    categories,
    VisuallyHiddenInput,
} from "../../utils/constants";
import PaginationTable from "../../components/tables/PaginationTable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import path from "../../utils/path";
import { apiGetCategories } from "../../apis/categories";
import PreviewVoucher from "./PreviewVoucher";
import { useLoading } from "../../context/LoadingProvider";
import { useTranslation } from "react-i18next";
import { apiGetVoucher, apiUpdateVoucher } from "../../apis/voucher";

const EditVoucher = () => {
    // PREVIEW VOUCHER
    const [voucherCode, setVoucherCode] = useState("");
    const [voucherPriceApplied, setVoucherPriceApplied] = useState(0);
    const [voucherDescription, setVoucherDescription] = useState("");
    const [voucherDiscountType, setVoucherDiscountType] = useState("");
    const [voucherDiscountValue, setVoucherDiscountValue] = useState("");
    const [voucherValidFrom, setVoucherValidFrom] = useState(dayjs());
    const [voucherValidTo, setVoucherValidTo] = useState(dayjs());
    const [voucherUsageLimit, setVoucherUsageLimit] = useState(1);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // HANDLE FETCH VOUCHER
    const { id } = useParams();

    useEffect(() => {
        const fetchVoucher = async () => {
            // Fetch categories
            if (id) {
                const voucherResponse = await apiGetVoucher(id);
                if (voucherResponse.status === 200) {
                    const voucher = voucherResponse.data;

                    // Set voucher details
                    setVoucherCode(voucher.code)
                    setVoucherPriceApplied(voucher.priceApplied)
                    setVoucherDescription(voucher.description)
                    setVoucherDiscountType(voucher.discountType)
                    setVoucherDiscountValue(voucher.discountValue)
                    setVoucherValidFrom(dayjs(voucher.validFrom))
                    setVoucherValidTo(dayjs(voucher.validTo))
                    setVoucherUsageLimit(voucher.usageLimit)

                }
            }
        };

        fetchVoucher();
    }, [id]);

    // SUBMIT
    const { showLoading, hideLoading } = useLoading();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validFromDate = voucherValidFrom;
        const validToDate = voucherValidTo;

        if (validToDate.isBefore(validFromDate)) {
            Swal.fire({
                icon: "error",
                title: "Invalid Dates",
                text: "The end date must be later than the start date.",
            });
            hideLoading();
            return;
        }

        if (isNaN(voucherPriceApplied) || voucherPriceApplied < 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid Price",
                text: "The price must be a valid positive number.",
            });
            hideLoading();
            return;
        }

        showLoading();

        const formData = {
            code: voucherCode,
            description: voucherDescription,
            discountType: voucherDiscountType,
            discountValue: voucherDiscountValue,
            validFrom: voucherValidFrom.format("DD/MM/YYYY"),
            validTo: voucherValidTo.format("DD/MM/YYYY"),
            priceApplied: voucherPriceApplied,
            usageLimit: voucherUsageLimit
        }

        try {
            const response = await apiUpdateVoucher(id, formData);

            // console.log(response.data)
            console.log(response.status);

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Successfully update voucher!",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        navigate(`/${path.ADMIN_LAYOUT}/${path.VOUCHER_MANAGEMENT}`);
                    } else {
                        window.location.reload();
                    }
                });
            }
        } catch (error) {
            console.error("Error creating voucher:", error);
            // Handle error (e.g., show an error message)
        } finally {
            hideLoading();
        }
    };

    const { t } = useTranslation();

    const handleCancel = () => {
        navigate(`/${path.ADMIN_LAYOUT}/${path.VOUCHER_MANAGEMENT}`);
    };

    return (
        <Container className="m-5">
            <Typography variant="h5" gutterBottom>
                {t("edit-voucher")}
            </Typography>

            <form onSubmit={handleSubmit}>
                {/* Code */}
                <TextField
                    id="voucherCode"
                    label={t("code")}
                    variant="standard"
                    fullWidth
                    margin="dense"
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                />

                {/* Description */}
                <TextField
                    id="voucherDescription"
                    label={t("description")}
                    multiline
                    fullWidth
                    rows={4}
                    variant="standard"
                    margin="dense"
                    value={voucherDescription}
                    onChange={(e) => setVoucherDescription(e.target.value)}
                />

                <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
                    <Grid2 size={12}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="voucherPriceApplied">{t("price-applied")}</InputLabel>
                            <Input
                                id="voucherPriceApplied"
                                startAdornment={
                                    <InputAdornment position="start">{'>='}</InputAdornment>
                                }
                                endAdornment={
                                    <InputAdornment position="end">VNĐ</InputAdornment>
                                }
                                value={voucherPriceApplied}
                                onChange={(e) => setVoucherPriceApplied(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={6}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="voucherDiscountType">{t("discount-type")}</InputLabel>
                            <Input
                                id="voucherDiscountType"
                                value={voucherDiscountType}
                                onChange={(e) => setVoucherDiscountType(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={6}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="voucherDiscountValue">{t("discount-value")}</InputLabel>
                            <Input
                                id="voucherDiscountValue"
                                endAdornment={
                                    <InputAdornment position="end">%</InputAdornment>
                                }
                                value={voucherDiscountValue}
                                onChange={(e) => setVoucherDiscountValue(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>

                    <Grid2 size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    label={t("valid-from")}
                                    variant="standard"
                                    fullWidth
                                    margin="dense"
                                    value={voucherValidFrom}
                                    onChange={(e) => setVoucherValidFrom(e)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid2>

                    <Grid2 size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                                <DatePicker
                                    label={t("valid-to")}
                                    variant="standard"
                                    fullWidth
                                    margin="dense"
                                    value={voucherValidTo}
                                    onChange={(e) => setVoucherValidTo(e)}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid2>

                    <Grid2 size={4}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="voucherUsageLimit">{t("usage-limit")}</InputLabel>
                            <Input
                                id="voucherUsageLimit"
                                value={voucherUsageLimit}
                                onChange={(e) => setVoucherUsageLimit(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>
                </Grid2>

                <Grid2
                    container
                    fullWidth
                    spacing={2}
                    sx={{ mt: 2, justifyContent: "flex-end" }}
                >
                    <Grid2>
                        <Button type="submit" variant="contained" color="success">
                            {t("create")}
                        </Button>
                    </Grid2>
                    <Grid2>
                        <Button variant="outlined" color="success" onClick={handleOpen}>
                            {t("preview")}
                        </Button>
                    </Grid2>
                    <Grid2>
                        <Button variant="outlined" color="warning" onClick={handleCancel}>
                            {t("cancel")}
                        </Button>
                    </Grid2>
                </Grid2>

                {/* Preview Voucher Before Create */}
                <PreviewVoucher
                    open={open}
                    handleClose={handleClose}
                    voucherCode={voucherCode}
                    voucherDescription={voucherDescription}
                    voucherDiscountType={voucherDiscountType}
                    voucherDiscountValue={voucherDiscountValue}
                    voucherValidFrom={voucherValidFrom}
                    voucherValidTo={voucherValidTo}
                    voucherUsageLimit={voucherUsageLimit}
                    voucherPriceApplied={voucherPriceApplied}
                />
            </form>
        </Container>
    );
};

export default EditVoucher;
