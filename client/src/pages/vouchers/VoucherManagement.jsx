import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import path from "../../utils/path";
import { useTranslation } from "react-i18next";
import { FaPlus, FaSearch } from "react-icons/fa";
import VoucherTable from "../vouchers/VoucherTable";
import ForwardToInboxIcon from "@mui/icons-material/ForwardToInbox";
import GiveVoucher from "./GiveVoucher";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Grid2, InputAdornment, TextField } from "@mui/material";

const VoucherManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [validFrom, setValidFrom] = useState(dayjs().subtract(10, 'year'));
  const [validTo, setValidTo] = useState(dayjs().add(10, 'year'));

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const [openModal, setOpenModal] = useState(false);

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("voucher-mgmt")}</Typography>
      <div className="flex justify-between items-center space-x-3">
        <Grid2 container spacing={2}>
          <Grid2 size={4}>
            <TextField
              // size="small"
              id="searchTerm"
              placeholder={t("search...")}
              variant="outlined"
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FaSearch />
                  </InputAdornment>
                ),
              }}
            />
          </Grid2>
          <Grid2 size={4}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label={t("valid-from")}
                  variant="standard"
                  value={validFrom}
                  onChange={(newValue) => setValidFrom(newValue)}
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
                  value={validTo}
                  onChange={(newValue) => setValidTo(newValue)}
                />
              </DemoContainer>
            </LocalizationProvider>

          </Grid2>
        </Grid2>
        <Button
          variant="outlined"
          color="success"
          onClick={handleOpenModal}
          className="flex-none gap-2"
        >
          <ForwardToInboxIcon color="success" />
          {t("give-voucher")}
        </Button>

        <Button
          variant="contained"
          color="secondary"
          href={path.CREATE_VOUCHER}
          className="flex-none gap-2"
        >
          <FaPlus />
          {t("create")}
        </Button>
      </div>
      <VoucherTable searchTerm={searchTerm} validFrom={validFrom.format("DD/MM/YYYY")} validTo={validTo.format("DD/MM/YYYY")} />
      <GiveVoucher open={openModal} onClose={handleCloseModal} />
    </Box>
  );
};

export default VoucherManagement;
