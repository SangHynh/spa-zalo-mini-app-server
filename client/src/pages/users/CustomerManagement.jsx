import { Box, Button, Grid2, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import path from "../../utils/path";
import CustomerTable from "../users/CustomerTable";
import { FaPlus, FaSearch } from "react-icons/fa";

const CustomerManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("customer-mgmt")}</Typography>
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
        </Grid2>
        <Button
          variant="contained"
          color="secondary"
          href={path.CREATE_CUSTOMER}
          className="w-fit flex items-center gap-2"
        >
          <FaPlus />
          {t("create")}
        </Button>
      </div>
      <CustomerTable searchTerm={searchTerm} />
    </Box>
  );
};

export default CustomerManagement;
