import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import path from "../utils/path";
import CustomerTable from "./users/CustomerTable";

const CustomerManagement = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("customer_mgmt")}</Typography>
      <Button variant="outlined" href={path.CREATE_CUSTOMER} className="w-fit">
        {t("create")}
      </Button>
      <CustomerTable />
    </Box>
  );
};

export default CustomerManagement;
