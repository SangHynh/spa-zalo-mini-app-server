import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import TablePagination from "@mui/material/TablePagination";
import { Button, ImageList, ImageListItem, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { apiDeleteProduct, apiGetProducts } from "../../apis/products";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import path from "../../utils/path";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingProvider";

function Row(props) {
  const { showLoading, hideLoading } = useLoading();

  const { row, searchTerm } = props;

  // // Chuyển đổi searchTerm và các trường thành chữ thường để việc so sánh không phân biệt chữ hoa chữ thường
  // const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // // Kiểm tra nếu bất kỳ ký tự nào trong searchTerm có trong các trường
  // const isVisible =
  //   row.name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //   row._id.toLowerCase().includes(lowerCaseSearchTerm);
  // // row.category.toLowerCase().includes(lowerCaseSearchTerm);

  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation();

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success(`${t("copy-success")}!`);
      })
      .catch((err) => {
        toast.success("Copy thất bại");
      });
  };
  const theme = useTheme();

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: `${t("confirm")}!`,
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoading();
        const res = await apiDeleteProduct(id);
        if (res) {
          Swal.fire(`${t("delete-success")}!`, "", "success").then(() => {
            // Tải lại trang sau khi thông báo thành công
            window.location.reload();
          });
        } else {
          Swal.fire(`${t("delete-failed")}!`, "", "error");
        }
        hideLoading();
      }
    });
  };

  return (
    <>
      {/* {isVisible && ( */}
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#2F2F2F" : "#FFFFFF",
          }}
        >
          <TableCell className="relative">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            sx={{
              maxWidth: "100px",
              whiteSpace: "nowrap",
              // overflowX: "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="relative cursor-pointer"
            onClick={() => handleCopy(row._id)}
          >
            {row._id}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "300px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.name}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "200px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.category}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "200px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.subCategory}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "250px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.benefits.join(", ")}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              maxWidth: "400px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.description}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              minWidth: "150px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.price)}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              minWidth: "100px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.stock}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              minWidth: "100px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.salesQuantity}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              minWidth: "200px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {new Date(row.expiryDate).toLocaleString("vi-VN", {
              timeZone: "Asia/Ho_Chi_Minh",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // 24-hour format
            })}
          </TableCell>
          <TableCell
            align="right"
            sx={{ minWidth: "100px" }}
            className="sticky right-0 z-10 bg-white dark:bg-[#2F2F2F]"
          >
            <div className="flex gap-2">
              <Tooltip title={t("edit")}>
                <IconButton
                  color="primary"
                  href={`${path.EDIT_PRODUCT}/${row._id}`}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("delete")}>
                <IconButton onClick={() => handleDelete(row._id)}>
                  <DeleteIcon className="text-red-500" />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("config")}>
                <IconButton href={`${path.PROD_RECOMMEND_SYSTEM}/${row._id}`}>
                  <WidgetsIcon className="text-green-500" />
                </IconButton>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("variants")}
                </Typography>
                <Table
                  size="small"
                  aria-label="purchases"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("volume")}</TableCell>
                      <TableCell align="center">{t("price")}</TableCell>
                      <TableCell align="center">{t("stock")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.variants &&
                      row.variants.map((variantRow) => (
                        <TableRow key={variantRow.volume}>
                          <TableCell component="th" scope="row" align="center">
                            {variantRow.volume}
                          </TableCell>
                          <TableCell align="center">
                            {variantRow.price}
                          </TableCell>
                          <TableCell align="center">
                            {variantRow.stock}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("ingredients")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("name")}</TableCell>
                      <TableCell align="center">{t("percentage")}</TableCell>
                      <TableCell align="center">
                        {t("usage-instructions")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.ingredients &&
                      row.ingredients.map((ingredient) => (
                        <TableRow key={ingredient.name}>
                          <TableCell component="th" scope="row" align="center">
                            {ingredient.name}
                          </TableCell>
                          <TableCell align="center">
                            {ingredient.percentage}
                          </TableCell>
                          <TableCell align="center">
                            {ingredient.usageInstructions}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("images")}
                </Typography>
                {/* Image List */}
                {row.images.length > 0 && (
                  <ImageList
                    sx={{ height: 250, mt: 2 }}
                    cols={5}
                    rowHeight={150}
                  >
                    {row.images.map((imgSrc, index) => (
                      <ImageListItem key={index}>
                        <img
                          src={imgSrc}
                          alt={`Uploaded ${index}`}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
      {/* )} */}
    </>
  );
}

const ProductTable = ({
  searchTerm,
  subCategoryId,
  stockSort,
  priceSort,
  expiryDateSort,
}) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts(
        currentPage,
        rowsPerPage,
        searchTerm,
        subCategoryId,
        stockSort,
        priceSort,
        expiryDateSort
      );
      if (response.status === 200) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.totalProducts);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    rowsPerPage,
    searchTerm,
    subCategoryId,
    stockSort,
    priceSort,
    expiryDateSort,
  ]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
        className="border shadow-2xl"
      >
        <Table aria-label="collapsible table">
          <TableHead className="sticky top-0 z-20 bg-gray-400 dark:bg-gray-100">
            <TableRow>
              <TableCell className="relative" />
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", maxWidth: "120px" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "300px" }}
                className="relative dark:text-black"
              >
                {t("product-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("category")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("sub-category")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "250px" }}
                className="relative dark:text-black"
              >
                {t("benefits")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "300px" }}
                className="relative dark:text-black"
              >
                {t("description")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("price")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("stock")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("sales-quantity")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("exp-date")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="sticky right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("operations")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(products) && products.length > 0 ? (
              products.map((row) => (
                <Row
                  key={row._id}
                  row={row}
                  searchTerm={searchTerm}
                  className="bg-[343541]"
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalProducts}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default ProductTable;
