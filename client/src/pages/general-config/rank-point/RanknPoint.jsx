import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import ForUser from "./ForUser";
import ForOrder from "./ForOrder";

const RanknPoint = () => {
  const { t } = useTranslation();

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("rank-point")}</Typography>
      <ForUser />
      <ForOrder />
    </Box>
  );
};

export default RanknPoint;
