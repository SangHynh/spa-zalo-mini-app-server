import {
  Box,
  Button,
  Grid2,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import path from "../../utils/path";
import CustomerTable from "../users/CustomerTable";
import { FaPlus, FaSearch } from "react-icons/fa";
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useLoading } from "../../context/LoadingProvider";
import { toast } from "react-toastify";
import { apiUpdateAllUserRank } from "../../apis/rank";

const CustomerManagement = () => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleRefreshRank = async () => {
    try {
      showLoading();
      const response = await apiUpdateAllUserRank();
      if (response.status === 200) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch(error) {
      toast.error(error.message)
    } finally {
      hideLoading();
    }
  }

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("customer-mgmt")}</Typography>
      <Box sx={{ flexGrow: 1 }}>
        <Grid2 container spacing={2}>
          <Grid2 size="grow">
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
          <Grid2 size="auto">
            <Button color="secondary" variant="outlined" startIcon={<RestartAltIcon />} onClick={handleRefreshRank}>
              {t("refresh-rank")}
            </Button>
          </Grid2>
        </Grid2>
      </Box>
      <CustomerTable searchTerm={searchTerm} />
    </Box>
  );
};

export default CustomerManagement;
