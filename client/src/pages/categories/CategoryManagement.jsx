import { Box, Button, Typography } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaPlus, FaSearch } from "react-icons/fa";
import path from "../../utils/path";
import CategoryTable from "../categories/CategoryTable";

const CategoryManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("category-mgmt")}</Typography>
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
        <Button
          variant="contained"
          color="secondary"
          href={path.CREATE_CATEGORY}
          className="w-fit flex items-center gap-2"
        >
          <FaPlus />
          {t("create")}
        </Button>
      </div>
      <CategoryTable searchTerm={searchTerm} />
    </Box>
  );
};

export default CategoryManagement;
