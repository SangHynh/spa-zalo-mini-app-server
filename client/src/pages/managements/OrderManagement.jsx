import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import OrderTable from "../orders/OrderTable";
import { FaPlus, FaSearch } from "react-icons/fa";

const OrderManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("order-mgmt")}</Typography>
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <input
            type="text"
            placeholder={t("search...")}
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
        </div>
      </div>
      <OrderTable searchTerm={searchTerm} />
    </Box>
  );
};

export default OrderManagement;
