import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const Commission = () => {
  const { t } = useTranslation();

  return (
    <Box className="w-full gap-6">
      <Typography variant="h5">{t("commission")}</Typography>
    </Box>
  );
};

export default Commission;
