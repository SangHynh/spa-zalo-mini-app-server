import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import path from "../../utils/path";
import ProductTable from "../products/ProductTable";
import { useTranslation } from "react-i18next";
import { FaPlus, FaSearch } from "react-icons/fa";
import { FormControl, Grid2, IconButton, InputAdornment, InputLabel, ListSubheader, MenuItem, Select, TextField } from "@mui/material";
import { apiGetCategories } from "../../apis/categories";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import RefreshIcon from '@mui/icons-material/Refresh';

const ProductManagement = () => {
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortStates, setSortStates] = useState({
    stock: "",
    price: "",
    expiryDate: ""
  });

  // GET CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetCategories();
      if (response.status === 200) setCategories(response.data);
    };

    fetchCategories();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSort = (field) => {
    setSortStates(prevState => ({
      ...prevState,
      [field]: prevState[field] === "asc" ? "desc" : "asc"
    }));
  };

  const getSortIcon = (field) => {
    if (sortStates[field] === "asc" || sortStates[field] === "") {
      return <ArrowUpwardIcon />;
    } else if (sortStates[field] === "desc") {
      return <ArrowDownwardIcon />;
    }
    return null;
  };

  const handleRefresh = () => {
    setSearchTerm("");
    setSubCategoryId("");
    setSortStates({
      stock: "",
      price: "",
      expiryDate: ""
    });
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("product-mgmt")}</Typography>
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
          <FormControl size="small" sx={{ minWidth: 200, maxWidth: 200 }}>
            <InputLabel shrink htmlFor="grouped-select">{t("category")}</InputLabel>
            <Select
              value={subCategoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              id="grouped-select"
              label="Grouping"
              displayEmpty
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 250,
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>{t("every")}</em>
              </MenuItem>
              {categories?.map((category) => [
                <ListSubheader key={`header-${category._id}`}>{category.name}</ListSubheader>,
                ...category?.subCategory?.map((subCate) => (
                  <MenuItem key={subCate._id} value={subCate._id}>
                    {subCate.name}
                  </MenuItem>
                )),
              ])}
            </Select>
          </FormControl>
          <Button color="light" variant="outlined" onClick={() => handleSort('stock')} endIcon={getSortIcon('stock')} size="small">
            {t("stock")}
          </Button>
          <Button color="light" variant="outlined" onClick={() => handleSort('price')} endIcon={getSortIcon('price')} size="small">
            {t("price")}
          </Button>
          <Button color="light" variant="outlined" onClick={() => handleSort('expiryDate')} endIcon={getSortIcon('expiryDate')} size="small">
            {t("exp-date")}
          </Button>
          <IconButton aria-label="refresh" size="medium" onClick={handleRefresh}>
            <RefreshIcon fontSize="inherit" />
          </IconButton>
        </Grid2>
        <Button
          variant="contained"
          color="secondary"
          href={path.CREATE_PRODUCT}
          className="w-fit flex items-center gap-2"
        >
          <FaPlus />
          {t("create")}
        </Button>
      </div>
      <ProductTable searchTerm={searchTerm} subCategoryId={subCategoryId} stockSort={sortStates['stock']} priceSort={sortStates['price']} expiryDateSort={sortStates['expiryDate']} />
    </Box>
  );
};

export default ProductManagement;
