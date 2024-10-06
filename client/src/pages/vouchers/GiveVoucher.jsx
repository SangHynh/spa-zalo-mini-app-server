import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { DataGrid } from "@mui/x-data-grid";
import { apiGetProducts } from "../../apis/products";
import { useLoading } from "../../context/LoadingProvider";

const GiveVoucher = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [page, setPage] = useState(0);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      showLoading();
      const response = await apiGetProducts(page + 1, pageSize);
      if (response.status === 200) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.totalProducts);
      } else {
        toast.error("Failed to fetch products");
      }
      hideLoading();
    };

    fetchProducts();
  }, [page, pageSize]);

  const columns = [
    { field: "_id", headerName: "ID", width: 200 },
    { field: "name", headerName: t("product-name"), width: 300 },
    { field: "category", headerName: t("category"), width: 200 },
    { field: "subCategory", headerName: t("sub-category"), width: 200 },
  ];

  const handleSelectionChange = (newSelection) => {
    const newSelectedIds = new Set(newSelection);
    setSelectedIds(newSelectedIds);
  };

  const handleSubmit = () => {
    selectedIds.forEach((id) => console.log("Selected Product ID:", id));
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t("Tặng Voucher")}</DialogTitle>
      <DialogContent>
        <Typography variant="h5" gutterBottom>
          {t("select-account")}
        </Typography>
        {/* <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 25]}
            pagination
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            onPageChange={(newPage) => setPage(newPage)}
            rowCount={totalProducts}
            paginationMode="server"
            loading={!products.length} // Show loading while fetching data
          />
        </div> */}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Hủy
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Gửi
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiveVoucher;
