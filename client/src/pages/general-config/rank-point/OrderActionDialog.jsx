import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid2,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Input,
    Button,
    Box,
    Chip,
    InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const OrderActionDialog = ({
    open,
    onClose,
    isEdit,
    isCreate,
    handleUpdate,
    handleCreate,
    handleCancelEdit,
    handleCancelCreate,
    id,
    price,
    point,
    setPrice,
    setPoint
}) => {
    const { t } = useTranslation();
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth='sm'
            fullWidth={true}
        >
            <DialogTitle>
                {isEdit ? t("edit") : t("create")}
            </DialogTitle>
            <DialogContent>
                <Grid2 container spacing={2}>
                    {isEdit && (
                        <TextField
                            id="id"
                            label="Id"
                            variant="standard"
                            fullWidth
                            margin="dense"
                            value={id}
                            style={{ display: "none" }}
                        />
                    )}
                    <Grid2 size={6}>
                        <TextField
                            id="price"
                            label={t("price")}
                            variant="standard"
                            fullWidth
                            margin="dense"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            id="point"
                            label={t("point")}
                            variant="standard"
                            fullWidth
                            margin="dense"
                            value={point}
                            onChange={(e) => setPoint(e.target.value)}
                        />
                    </Grid2>
                </Grid2>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    color={isEdit ? "primary" : "secondary"}
                    onClick={isEdit ? handleUpdate : handleCreate}
                >
                    {isEdit ? t("update") : t("create")}
                </Button>
                <Button
                    variant="outlined"
                    color="warning"
                    onClick={isEdit ? handleCancelEdit : handleCancelCreate}
                >
                    {t("cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderActionDialog;
