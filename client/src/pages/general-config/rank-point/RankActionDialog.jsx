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

const RankActionDialog = ({ open, onClose, isEdit, isCreate, handleUpdate, handleCreate, handleCancelEdit, handleCancelCreate, id, rank, point, commissionPercent, rankColor, benefits, setRank, setPoint, setCommissionPercent, setRankColor, setBenefits }) => {
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
                        <>
                            <TextField
                                id="id"
                                label="Id"
                                variant="standard"
                                fullWidth
                                margin="dense"
                                value={id}
                                style={{ display: "none" }}
                            />
                        </>
                    )}
                    <Grid2 size={6}>
                        <TextField
                            id="rank"
                            label={t("rank")}
                            variant="standard"
                            fullWidth
                            margin="dense"
                            value={rank}
                            onChange={(e) => setRank(e.target.value)}
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
                    <Grid2 size={6}>
                        <TextField
                            id="commissionPercent"
                            label={t("commission-percent")}
                            variant="standard"
                            fullWidth
                            margin="dense"
                            value={commissionPercent}
                            onChange={(e) => setCommissionPercent(e.target.value)}
                        />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField
                            id="commissionColor"
                            label={t("color")}
                            variant="standard"
                            fullWidth
                            margin="dense"
                            color={rankColor}
                            value={rankColor}
                            onChange={(e) => setRankColor(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <Chip className='mb-4' label={rank ? rank : 'Rank'} variant="outlined" sx={{ color: (rankColor), borderColor: (rankColor) }} />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid2>
                    <Grid2 size={12}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel>{t("benefits")}</InputLabel>
                            <Input
                                id="ingredientUsageInstructions"
                                multiline
                                rows={3}
                                value={benefits}
                                onChange={(e) => setBenefits(e.target.value)}
                            />
                        </FormControl>
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

export default RankActionDialog;
