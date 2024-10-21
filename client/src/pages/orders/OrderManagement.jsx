import { Box, FormControl, Grid2, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderTable from "../orders/OrderTable";
import { FaPlus, FaSearch } from "react-icons/fa";
import dayjs from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

const OrderManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("order-mgmt")}</Typography>
      <div className="flex justify-between items-center">
        <Grid2 container spacing={2}>
          <TextField
            size="small"
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
          <FormControl size="small" sx={{ minWidth: 200, maxWidth: 200 }}>
            <InputLabel shrink id="status">{t("status")}</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={status}
              label={t("status")}
              onChange={(e) => setStatus(e.target.value)}
              displayEmpty
            >
              <MenuItem value={''}>{t('every')}</MenuItem>
              <MenuItem value={'pending'}>pending</MenuItem>
              <MenuItem value={'completed'}>completed</MenuItem>
              <MenuItem value={'approved'}>approved</MenuItem>
              <MenuItem value={'cancelled'}>cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid2>
      </div>
      <OrderTable searchTerm={searchTerm} status={status} />
    </Box>
  );
};

export default OrderManagement;
