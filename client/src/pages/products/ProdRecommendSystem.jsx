import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { apiGetProduct, apiGetProducts } from "../../apis/products";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FaSearch } from "react-icons/fa";
import PreviewRecommend from "../recommends/PreviewRecommend";
import { toast } from "react-toastify";
import {
  apiConfigProductRecommendations,
  apiGetProductRecommendations,
} from "../../apis/recommend-system";
import path from "../../utils/path";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingProvider";

const ProdRecommendSystem = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [rowsA, setRowsA] = useState([]); // Bảng A
  const [rowsB, setRowsB] = useState([]); // Bảng B
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set()); // Sản phẩm đã chọn
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  // Pagination states for table A
  const [currentPageA, setCurrentPageA] = useState(1);
  const [rowsPerPageA, setRowsPerPageA] = useState(5);
  const [totalPagesA, setTotalPagesA] = useState(0);
  const [totalRowCount, setTotalRowCount] = useState(50);

  // GET PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productResponse = await apiGetProduct(id);
        if (productResponse.status === 200) {
          setProductName(productResponse.data.name);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  // GET RECOMMENDATIONS (Table B)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendationsResponse = await apiGetProductRecommendations(id);
        if (recommendationsResponse.status === 200) {
          const recommendedProductIds =
            recommendationsResponse.data.products.map(
              (product) => product.productId
            );
          const transformedRowsB = recommendationsResponse.data.products.map(
            (product) => ({
              id: product.productId,
              name: product.productName,
              isRecommended: true,
            })
          );
          setRowsB(transformedRowsB);
          setSelectedIds(new Set(recommendedProductIds)); // Lưu các sản phẩm gợi ý
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendations();
  }, [id]);

  // GET PRODUCTS (Table A)
  useEffect(() => {
    const fetchProducts = async () => {
      showLoading();
      try {
        const productsResponse = await apiGetProducts(
          currentPageA,
          rowsPerPageA,
          searchTerm
        );
        if (productsResponse.status === 200) {
          // const productsFromB = new Set(rowsB.map((prod) => prod.id)); // Các sản phẩm đã có ở bảng B
          const transformedRowsA = productsResponse.data.products
            // .filter((product) => !productsFromB.has(product._id) && product._id !== id) // Loại bỏ các sản phẩm đã có trong bảng B
            .map((product) => ({
              id: product._id,
              name: product.name,
              category: product.category,
              subCategory: product.subCategory,
            }));
          setRowsA(transformedRowsA); // Cập nhật dữ liệu bảng A

          // Nếu server cung cấp tổng số lượng sản phẩm, cập nhật rowCount
          setTotalRowCount(productsResponse.data.totalProducts || -1);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        hideLoading();
      }
    };

    fetchProducts();
  }, [currentPageA, rowsPerPageA, searchTerm, rowsB]);

  const handleSelectionChange = (newSelection) => {
    const newSelectedIds = new Set(selectedIds);
    newSelection.forEach((id) => newSelectedIds.add(id));
    if (newSelectedIds.size > 12) {
      toast.error("Đã vượt quá số lượng gợi ý");
      return;
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdate = async () => {
    showLoading();
    try {
      const currentlySelectedProductIds = Array.from(selectedIds).map((id) => ({
        productId: id,
      }));
      const response = await apiConfigProductRecommendations(id, {
        mainProductId: id,
        suggestions: currentlySelectedProductIds,
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
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`);
  };

  const handleRefresh = () => {
    window.location.reload(); // Làm mới toàn bộ trang
  };

  const handleRemoveProduct = (id) => {
    // Xóa sản phẩm khỏi bảng B
    const updatedRowsB = rowsB.filter((product) => product.id !== id);
    setRowsB(updatedRowsB);
    const updatedSelectedIds = new Set(selectedIds);
    updatedSelectedIds.delete(id); // Xóa ID khỏi danh sách đã chọn
    setSelectedIds(updatedSelectedIds);
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5" gutterBottom>
        {t("prod-recommend-system")}
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
          <span>{selectedIds.size}</span>
          <span>/12</span>
        </Box>
      </div>
      <Paper sx={{ width: "100%" }}>
        {/* Table A - Products */}
        <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={6}>
            <DataGrid
              rows={rowsA} // Dữ liệu từ server
              columns={[
                { field: "id", headerName: "ID", flex: 1 },
                { field: "name", headerName: t("product-name"), flex: 1 },
                { field: "category", headerName: t("category"), flex: 1 },
                {
                  field: "subCategory",
                  headerName: t("sub-category"),
                  flex: 1,
                },
              ]}
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSize={rowsPerPageA} // Số dòng hiển thị mỗi trang
              pageSizeOptions={[5, 10, 25]}
              pagination
              paginationMode="server" // Phân trang từ phía server
              rowCount={totalRowCount} // Tổng số lượng dòng (nếu biết trước)
              onPaginationModelChange={({ page, pageSize }) => {
                setCurrentPageA(page + 1); // Cập nhật trang hiện tại
                setRowsPerPageA(pageSize); // Cập nhật số dòng mỗi trang
              }}
              checkboxSelection
              rowSelectionModel={[...selectedIds]} // Các sản phẩm được chọn
              onRowSelectionModelChange={handleSelectionChange}
              disableSelectionOnClick
              isRowSelectable={(params) => {
                const productsFromB = new Set(rowsB.map((prod) => prod.id));
                const productId = params.row.id;
                // Disable selection for products that are in rowsB or match the current product ID
                return !(productsFromB.has(productId) || productId === id);
              }}
            />
          </Grid2>
          <Grid2 size={6}>
            <DataGrid
              rows={rowsB}
              pagination
              pageSizeOptions={[5, 10, 25]}
              autoPageSize
              columns={[
                { field: "id", headerName: "ID", flex: 1 },
                { field: "name", headerName: t("product-name"), flex: 1 },
                {
                  field: "action",
                  headerName: t("actions"),
                  flex: 1,
                  renderCell: (params) => (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleRemoveProduct(params.row.id)} // Gọi hàm xóa khi nhấn nút
                    >
                      {t("remove")}
                    </Button>
                  ),
                },
              ]}
            />
          </Grid2>
        </Grid2>

        {/* Table B - Selected Recommendations */}
      </Paper>

      {/* Preview */}
      <PreviewRecommend
        open={open}
        onClose={handleClose}
        previewRows={rowsB}
        availableProducts={rowsA.filter((row) => selectedIds.has(row.id))}
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
        {/* <Button variant="outlined" color="success" onClick={handleOpen}>
          {t("preview")}
        </Button> */}
        <Button variant="outlined" color="warning" onClick={handleCancel}>
          {t("cancel")}
        </Button>
        <Button variant="outlined" color="primary" onClick={handleRefresh}>
          {t("refresh")}
        </Button>
      </Box>
    </Box>
  );
};

export default ProdRecommendSystem;
