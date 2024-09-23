import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import path from "../utils/path";

const StaffManagement = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("staff_mgmt")}</Typography>
      <Button variant="outlined" href={path.CREATE_STAFF} className="w-fit">
        {t("create")}
      </Button>
    </Box>
  );
};

export default StaffManagement;
