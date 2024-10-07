import { Box, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

const AffiliateMarketing = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("affiliate-marketing")}</Typography>
    </Box>
  );
};

export default AffiliateMarketing;
