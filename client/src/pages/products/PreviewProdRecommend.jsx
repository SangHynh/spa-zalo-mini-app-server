import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
  Grid2,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const PreviewProdRecommend = ({ open, onClose, products }) => {
  const { t } = useTranslation();

  const [pagePreview, setPagePreview] = useState(0);
  const [rowsPerPagePreview, setRowsPerPagePreview] = useState(5);

  // Hàm thay đổi trang cho bảng preview
  const handleChangePagePreview = (event, newPage) => {
    setPagePreview(newPage);
  };

  // Hàm thay đổi số hàng trên mỗi trang cho bảng preview
  const handleChangeRowsPerPagePreview = (event) => {
    setRowsPerPagePreview(parseInt(event.target.value, 10));
    setPagePreview(0); // Quay lại trang đầu tiên khi thay đổi số hàng
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>{t("selected-products")}</DialogTitle>
      <DialogContent>
        <Paper className="border">
          <TableContainer>
            <Table>
              <TableHead className="bg-gray-400 dark:bg-gray-100">
                <TableRow>
                  <TableCell
                    align="center"
                    style={{ width: "20%", fontWeight: "bold", color: "black" }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "30%", fontWeight: "bold", color: "black" }}
                  >
                    {t("product-name")}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "25%", fontWeight: "bold", color: "black" }}
                  >
                    {t("category")}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ width: "25%", fontWeight: "bold", color: "black" }}
                  >
                    {t("sub-category")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products
                  .slice(
                    pagePreview * rowsPerPagePreview,
                    pagePreview * rowsPerPagePreview + rowsPerPagePreview
                  )
                  .map((previewRow) => (
                    <TableRow key={previewRow._id}>
                      <TableCell align="left" style={{ width: "20%" }}>
                        {previewRow._id}
                      </TableCell>
                      <TableCell align="left" style={{ width: "30%" }}>
                        {previewRow.name}
                      </TableCell>
                      <TableCell align="left" style={{ width: "25%" }}>
                        {previewRow.category}
                      </TableCell>
                      <TableCell align="left" style={{ width: "25%" }}>
                        {previewRow.subCategory}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[6, 12]}
            component="div"
            count={products.length}
            rowsPerPage={rowsPerPagePreview}
            page={pagePreview}
            onPageChange={handleChangePagePreview}
            onRowsPerPageChange={handleChangeRowsPerPagePreview}
            labelRowsPerPage={t("rows-per-page")}
          />
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PreviewProdRecommend;
