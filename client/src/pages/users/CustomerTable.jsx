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
import { ImageList, ImageListItem, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { apiGetCustomers } from "../../apis/users";

function Row(props) {
  const { row, searchTerm } = props;

  // Chuyển đổi searchTerm và các trường thành chữ thường để việc so sánh không phân biệt chữ hoa chữ thường
  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // Kiểm tra nếu bất kỳ ký tự nào trong searchTerm có trong các trường
  const isVisible =
    row.name.toLowerCase().includes(lowerCaseSearchTerm) ||
    row._id.toLowerCase().includes(lowerCaseSearchTerm);

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

  return (
    <>
      {isVisible && (
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
              align="right"
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
              align="right"
              sx={{
                minWidth: "150px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="relative"
            >
              {row.phone}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: "150px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="relative"
            >
              {row.points}
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
              {row.gender}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: "200px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="relative"
            >
              {row.cumulativePoints}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                minWidth: "100px",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
              className="relative"
            >
              {row.age}
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
              {row.skinType}
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
              {row.hairType}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              sx={{
                minWidth: "120px",
                whiteSpace: "nowrap",
                // overflowX: "auto",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="relative cursor-pointer"
              onClick={() => handleCopy(row._id)}
            >
              {row.refferalCode}
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
              {row.refferedBy}
            </TableCell>
            <TableCell
              align="right"
              sx={{ minWidth: "100px" }}
              className="sticky right-0 z-10  bg-white dark:bg-[#2F2F2F]"
            >
              <div className="flex gap-2">
                <Tooltip title={t("edit")}>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("delete")}>
                  <IconButton>
                    <DeleteIcon className="text-red-500" />
                  </IconButton>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
          <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {t("favorite-services")}
                  </Typography>
                  <Table
                    size="small"
                    aria-label="purchases"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">{t("service-id")}</TableCell>
                        <TableCell align="center">
                          {t("service-name")}
                        </TableCell>
                        <TableCell align="center">{t("usage-count")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.favoriteServices &&
                        row.favoriteServices.map((favoriteServiceRow) => (
                          <TableRow key={favoriteServiceRow._id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {favoriteServiceRow._id}
                            </TableCell>
                            <TableCell align="center">
                              {favoriteServiceRow.serviceName}
                            </TableCell>
                            <TableCell align="center">
                              {favoriteServiceRow.usageCount}
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {t("product-suggestions")}
                  </Typography>
                  <Table
                    size="small"
                    aria-label="related-products"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">{t("product-id")}</TableCell>
                        <TableCell align="center">
                          {t("product-name")}
                        </TableCell>
                        <TableCell align="center">
                          {t("suggested-score")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.productSuggestions &&
                        row.productSuggestions.map((productSuggestion) => (
                          <TableRow key={productSuggestion._id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {productSuggestion._id}
                            </TableCell>
                            <TableCell align="center">
                              {productSuggestion.productName}
                            </TableCell>
                            <TableCell align="center">
                              {productSuggestion.suggestedScore}
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {t("discounts")}
                  </Typography>
                  <Table
                    size="small"
                    aria-label="related-products"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">{t("voucher-id")}</TableCell>
                        <TableCell align="center">{t("used-at")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.discountsUsed &&
                        row.discountsUsed.map((discountUsed) => (
                          <TableRow key={discountUsed._id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {discountUsed._id}
                            </TableCell>
                            <TableCell align="center">
                              {discountUsed.usedAt}
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {t("cart")}
                  </Typography>
                  <Table
                    size="small"
                    aria-label="related-products"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">{t("product-id")}</TableCell>
                        <TableCell align="center">{t("name")}</TableCell>
                        <TableCell align="center">{t("price")}</TableCell>
                        <TableCell align="center">{t("quantity")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.carts &&
                        row.carts.map((cart) => (
                          <TableRow key={cart._id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {cart._id}
                            </TableCell>
                            <TableCell align="center">
                              {cart.productName}
                            </TableCell>
                            <TableCell align="center">{cart.price}</TableCell>
                            <TableCell align="center">
                              {cart.quantity}
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
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography variant="h6" gutterBottom component="div">
                    {t("voucher")}
                  </Typography>
                  <Table
                    size="small"
                    aria-label="related-products"
                    sx={{ tableLayout: "fixed", width: "100%" }}
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">{t("voucher-id")}</TableCell>
                        <TableCell align="center">{t("code")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.vouchers &&
                        row.vouchers.map((voucher) => (
                          <TableRow key={voucher._id}>
                            <TableCell
                              component="th"
                              scope="row"
                              align="center"
                            >
                              {voucher.voucherId}
                            </TableCell>
                            <TableCell align="center">
                              {voucher.code}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </React.Fragment>
      )}
    </>
  );
}

const CustomerTable = ({ searchTerm }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  // GET CUSTOMERS
  useEffect(() => {
    const fetchCustomers = async () => {
      const response = await apiGetCustomers(
        currentPage,
        rowsPerPage,
        searchTerm
      );
      if (response.status === 200) {
        setCustomers(response.data.users);
        setTotalCustomers(response.data.totalUsers);
        setTotalPages(response.data.totalPages);
      } 
    };

    fetchCustomers();
  }, [currentPage, rowsPerPage, searchTerm]);

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
        className="border"
      >
        <Table aria-label="collapsible table">
          <TableHead className="sticky top-0 z-20 bg-gray-400 dark:bg-gray-100">
            <TableRow>
              <TableCell className="relative" />
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", maxWidth: "100px" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "300px" }}
                className="relative dark:text-black"
              >
                {t("customer-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("phone")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("points")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("gender")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("cumulative-points")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", maxWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("age")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("skin-style")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("hair-style")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("referral-code")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("referred-by")}
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
          {Array.isArray(customers) && customers.length > 0 ? (
              customers.map((row) => (
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
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCustomers}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default CustomerTable;
