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
import {
  apiConfigProductRS,
  apiGetProductRecommendations,
} from "../apis/recommend-system";
import path from "../utils/path";
import Swal from "sweetalert2";

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

  // GET PRODUCTS và GET RECOMMENDATIONS
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const productsResponse = await apiGetProducts();
        if (productsResponse.status === 200) {
          const transformedRows = productsResponse.data.map((product) => ({
            id: product._id,
            name: product.name,
            category: product.category,
            subCategory: product.subCategory,
            isRecommended: false, // Khởi tạo
          }));
          setProducts(transformedRows);

          // Fetch recommendations
          const recommendationsResponse = await apiGetProductRecommendations(
            id
          );
          if (recommendationsResponse.status === 200) {
            const recommendedProductIds =
              recommendationsResponse.data.products.map((product) =>
                product.productId.toString()
              );

            // Đánh dấu isRecommended
            const updatedRows = transformedRows.map((row) => ({
              ...row,
              isRecommended: recommendedProductIds.includes(row.id),
            }));

            // Sắp xếp các sản phẩm gợi ý lên đầu
            const sortedRows = [...updatedRows].sort((a, b) => {
              if (a.isRecommended && !b.isRecommended) return -1;
              if (!a.isRecommended && b.isRecommended) return 1;
              return 0;
            });

            setRows(sortedRows);
          } else {
            setRows(transformedRows);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "name", headerName: `${t("product-name")}`, flex: 1 },
    { field: "category", headerName: `${t("category")}`, flex: 1 },
    { field: "subCategory", headerName: `${t("sub-category")}`, flex: 1 },
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

    // Áp dụng isRecommended và sắp xếp lại
    const updatedRows = filteredRows.map((row) => ({
      ...row,
      isRecommended: rows.find((r) => r.id === row.id)?.isRecommended || false,
    }));

    const sortedRows = [...updatedRows].sort((a, b) => {
      if (a.isRecommended && !b.isRecommended) return -1;
      if (!a.isRecommended && b.isRecommended) return 1;
      return 0;
    });

    setRows(sortedRows);
  };

  // Cập nhật selectedIds mỗi khi rows thay đổi
  useEffect(() => {
    const recommendedProductIds = rows
      .filter((row) => row.isRecommended)
      .map((row) => row.id);
    setSelectedIds(recommendedProductIds); // Chọn các sản phẩm gợi ý
  }, [rows]);

  const handleSelectionChange = (newSelection) => {
    if (newSelection.length > 12) {
      toast.error("Đã vượt quá số lượng gợi ý");
      return; // Ngăn không cho cập nhật selection nếu vượt quá 12
    }

    setSelectedIds(newSelection); // Cập nhật các ID được chọn

    const selectedRows = rows.filter((product) =>
      newSelection.includes(product.id)
    );
    setSelectedProducts(selectedRows); // Cập nhật các sản phẩm được chọn
  };

  const handleOpen = () => {
    const selectedRows = rows.filter((row) => selectedIds.includes(row.id));
    // console.log(selectedRows);
    setSelectedProducts(selectedRows);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    const initiallyRecommendedProductIds = rows
      .filter((row) => row.isRecommended)
      .map((row) => row.id);

    const currentlySelectedProductIds = selectedIds.map((id) => ({
      productId: id,
    }));

    const initiallySelectedButNowUnselected =
      initiallyRecommendedProductIds.filter(
        (id) => !currentlySelectedProductIds.includes(id)
      );

    const newlySelectedProducts = currentlySelectedProductIds.filter(
      (id) => !initiallyRecommendedProductIds.includes(id)
    );

    if (
      initiallySelectedButNowUnselected.length === 0 &&
      newlySelectedProducts.length === 0
    ) {
      toast.info(`${t("no-change")}`);
    } else {
      try {
        // console.log(id, currentlySelectedProductIds);

        const response = await apiConfigProductRS(id, {
          mainProductId: id,
          suggestions: currentlySelectedProductIds, // Dữ liệu là các ID sản phẩm được chọn
        });

        if (response.status === 200) {
          Swal.fire({
            title: `${t("success")}!`,
            text: `${t("update-success")}`,
            icon: "success",
            confirmButtonText: "Ok",
          }).then(() => {
            window.location.reload();
          });
        } else {
          console.error("Failed to update recommendations");
          Swal.fire({
            title: `${t("error")}!`,
            text: `${t("update-failed")}`,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
      } catch (error) {
        console.error("Error calling API:", error);
      }
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`);
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
        <Box>
          <span>{t("number-of-suggested-products")} : </span>
          <span>{selectedIds.length}</span>
          <span>/12</span>
        </Box>
      </div>
      <Paper sx={{ width: "100%" }}>
        {loading ? (
          <Box className="flex justify-center py-4">
            <Loading />
          </Box>
        ) : (
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            pageSizeOptions={[6, 12]}
            checkboxSelection
            onRowSelectionModelChange={handleSelectionChange}
            rowSelectionModel={selectedIds} // Sử dụng state để lưu ID của các sản phẩm được chọn
            disableSelectionOnClick
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
