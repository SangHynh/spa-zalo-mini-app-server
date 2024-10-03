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
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const PreviewRecommend = ({
  open,
  onClose,
  previewRows, // Prop chứa các hàng được chọn để xem trước
}) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Số hàng trên mỗi trang

  // Hàm thay đổi trang
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Hàm thay đổi số hàng trên mỗi trang
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Quay lại trang đầu tiên khi thay đổi số hàng
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
                    style={{
                      width: "20%",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    ID
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      width: "30%",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {t("product-name")}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      width: "25%",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {t("category")}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{
                      width: "25%",
                      fontWeight: "bold",
                      color: "black",
                    }}
                  >
                    {t("sub-category")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {previewRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((previewRow) => (
                    <TableRow key={previewRow.id}>
                      <TableCell align="left" style={{ width: "20%" }}>
                        {previewRow.id}
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
            count={previewRows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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

export default PreviewRecommend;
