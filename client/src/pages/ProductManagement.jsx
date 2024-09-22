import React, { useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import path from "../utils/path";
import ProductTable from "./products/ProductTable";
import { useTranslation } from "react-i18next";

const ProductManagement = () => {
  const { t } = useTranslation();

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("product_mgmt")}</Typography>
      <Button variant="outlined" href={path.CREATE_PRODUCT} className="w-fit">
        {t("create")}
      </Button>
      <ProductTable />
    </Box>
  );
};

export default ProductManagement;
