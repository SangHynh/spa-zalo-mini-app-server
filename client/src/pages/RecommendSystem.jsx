import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../apis/products";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaSearch } from "react-icons/fa";
import PreviewRecommend from "./recommends/PreviewRecommend";
import { toast } from "react-toastify";
import Loading from "../components/loading/Loading";
import { apiUpdateProductRS } from "../apis/recommend-system";
import path from "../utils/path";

const RecommendSystem = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // GET PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await apiGetProduct(id);
        if (productResponse.status === 200) {
          const product = productResponse.data;
          setProductName(product.name);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await apiGetProducts();
        if (response.status === 200) {
          const transformedRows = response.data.map((product) => ({
            id: product._id,
            name: product.name,
            category: product.category,
            subCategory: product.subCategory,
          }));
          setProducts(transformedRows);
          setRows(transformedRows);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: `${t("product-name")}` },
    { field: "category", headerName: `${t("category")}` },
    { field: "subCategory", headerName: `${t("sub-category")}` },
  ];

  const paginationModel = { pageSize: 5, page: 0 };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Lọc rows dựa trên searchTerm
    const filteredRows = products.filter(
      (product) =>
        product.name.toLowerCase().includes(value.toLowerCase()) ||
        product.id.toLowerCase().includes(value.toLowerCase())
    );
    if (filteredRows.length === 0) {
      console.warn("No products found");
    }
    setRows(filteredRows);
  };

  const handleSelectionChange = (newSelection) => {
    console.log(newSelection);
    setSelectedIds(newSelection);
    const selectedRows = products.filter((product) =>
      newSelection.includes(product.id)
    );
    setSelectedProducts(selectedRows);
  };

  const handleOpen = () => {
    if (selectedProducts.length > 0) {
      console.log(selectedProducts);
      setOpen(true);
    } else {
      toast.info(`${t("no-change")}`);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    if (selectedProducts.length > 0) {
      const selectedIds = selectedProducts.map((product) => product.id);

      const data = {
        id,
        selectedIds,
      };

      console.log("Data gửi lên API:", data);

      try {
        const response = await apiUpdateProductRS(data);
        if (response.status === 200) {
          console.log("Phản hồi từ API:", response.data);
          toast.success(`${t("update-success")}`);
        } else {
          toast.error(`${t("update-failed")}`);
        }
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
        toast.error(`${t("update-failed")}`);
      }
    } else {
      toast.info(`${t("no-change")}`);
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`);
  };

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5" gutterBottom>
        {t("recommend-system")}
      </Typography>
      <TextField
        id="productId"
        label="ID"
        variant="standard"
        fullWidth
        margin="dense"
        value={id}
        disabled
      />
      <TextField
        id="productName"
        label={t("product-name")}
        variant="standard"
        fullWidth
        margin="dense"
        value={productName}
        disabled
      />
      <Typography variant="h6" gutterBottom>
        {t("select-recommended-products")}
      </Typography>
      <div className="flex items-center justify-between">
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
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={handleChange}
              name="myCheckbox"
              color="secondary"
            />
          }
          label={t("show-available-suggestions")}
        />
      </div>
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box className="flex justify-center py-4">
            <Loading />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns.map((col) => ({ ...col, flex: 1 }))}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
          />
        )}
      </Paper>
      {/* Preview */}
      <PreviewRecommend
        open={open}
        onClose={handleClose}
        previewRows={selectedProducts}
      />
      <Box className="mt-2 flex justify-end gap-2">
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={handleUpdate}
        >
          {t("update")}
        </Button>
        <Button variant="outlined" color="success" onClick={handleOpen}>
          {t("preview")}
        </Button>
        <Button variant="outlined" color="warning" onClick={handleCancel}>
          {t("cancel")}
        </Button>
      </Box>
    </Box>
  );
};

export default RecommendSystem;
