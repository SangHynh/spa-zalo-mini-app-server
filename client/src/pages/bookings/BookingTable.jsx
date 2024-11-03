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
import { Chip, ImageList, ImageListItem, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WidgetsIcon from "@mui/icons-material/Widgets";
import { apiGetBookings, apiUpdateBookingStatus } from "../../apis/bookings";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import path from "../../utils/path";
import { toast } from "react-toastify";
import { useTheme } from "@emotion/react";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingProvider";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RecommendIcon from "@mui/icons-material/Recommend";
import { blue, green, red, yellow } from "@mui/material/colors";

function Row(props) {
  const { showLoading, hideLoading } = useLoading();

  const { row, searchTerm } = props;

  // // Chuyển đổi searchTerm và các trường thành chữ thường để việc so sánh không phân biệt chữ hoa chữ thường
  // const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // // Kiểm tra nếu bất kỳ ký tự nào trong searchTerm có trong các trường
  // const isVisible =
  //     // row.customerId.name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     row._id.toLowerCase().includes(lowerCaseSearchTerm);
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

  const handleUpdateStatus = (id, status) => {
    Swal.fire({
      icon: "warning",
      title: `${t("confirm")}!`,
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoading();
        const data = {
          status: status,
        };
        console.log(data);
        const res = await apiUpdateBookingStatus(id, data);
        if (res.status === 200) {
          Swal.fire(`${t("update-success")}!`, "", "success").then(() => {
            // Tải lại trang sau khi thông báo thành công
            window.location.reload();
          });
        } else {
          Swal.fire(`${t("update-failed")}!`, res.data.message, "error");
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
              maxWidth: "150px",
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
            component="th"
            scope="row"
            sx={{
              maxWidth: "150px",
              whiteSpace: "nowrap",
              // overflowX: "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="relative cursor-pointer"
            onClick={() => handleCopy(row.customerId)}
          >
            {row.customerId}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "150px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.customer?.name}
          </TableCell>
          <TableCell
            align="left"
            sx={{
              minWidth: "150px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.customer?.phone}
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
            <Chip
              label={row.status}
              color={
                row.status === "pending"
                  ? "primary"
                  : row.status === "cancelled"
                  ? "error"
                  : row.status === "completed"
                  ? "success"
                  : row.status === "approved"
                  ? "warning"
                  : "default"
              }
            />
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
            {new Date(row.date).toLocaleString("vi-VN", {
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
              <Tooltip title={t("complete")}>
                <IconButton
                  color="primary"
                  onClick={() => handleUpdateStatus(row._id, "completed")}
                  disabled={row.status === "completed"}
                >
                  <CheckCircleIcon
                    sx={{
                      color:
                        row.status === "completed" ? "gray.400" : green[500],
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("approve")}>
                <IconButton
                  onClick={() => handleUpdateStatus(row._id, "approved")}
                  disabled={row.status === "approved"}
                >
                  <RecommendIcon
                    sx={{
                      color:
                        row.status === "approved" ? "gray.400" : yellow[500],
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("pending")}>
                <IconButton
                  onClick={() => handleUpdateStatus(row._id, "pending")}
                  disabled={row.status === "pending"}
                >
                  <PendingIcon
                    sx={{
                      color: row.status === "pending" ? "gray.400" : blue[500],
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("cancel")}>
                <IconButton
                  onClick={() => handleUpdateStatus(row._id, "cancelled")}
                  disabled={row.status === "cancelled"}
                >
                  <CancelIcon
                    sx={{
                      color: row.status === "cancelled" ? "gray.400" : red[500],
                    }}
                  />
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
                  {t("service")}
                </Typography>
                <Table
                  size="small"
                  aria-label="purchases"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("id")}</TableCell>
                      <TableCell align="center">{t("name")}</TableCell>
                      <TableCell align="center">{t("price")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.services &&
                      row.services.map((service) => (
                        <TableRow key={service.serviceId}>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            onClick={() => handleCopy(service.serviceId)}
                          >
                            {service.serviceId}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {service.serviceName}
                          </TableCell>
                          <TableCell align="center">{service.price}</TableCell>
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
                  {t("product")}
                </Typography>
                <Table
                  size="small"
                  aria-label="purchases"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("id")}</TableCell>
                      <TableCell align="center">{t("name")}</TableCell>
                      <TableCell align="center">{t("price")}</TableCell>
                      <TableCell align="center">{t("quantity")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.products &&
                      row.products.map((product) => (
                        <TableRow key={product.productId}>
                          <TableCell
                            component="th"
                            scope="row"
                            align="center"
                            onClick={() => handleCopy(product.productId)}
                          >
                            {product.productId}
                          </TableCell>
                          <TableCell component="th" scope="row" align="center">
                            {product.productName}
                          </TableCell>
                          <TableCell align="center">{product.price}</TableCell>
                          <TableCell align="center">
                            {product.quantity}
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
      {/* )} */}
    </>
  );
}

const BookingTable = ({ searchTerm, status, sortDate }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);

  // GET PRODUCTS
  useEffect(() => {
    const fetchBookings = async () => {
      const response = await apiGetBookings(
        currentPage,
        rowsPerPage,
        searchTerm,
        status,
        sortDate
      );
      if (response.status === 200) {
        setBookings(response.data.bookings);
        setTotalBookings(response.data.totalBookings);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchBookings();
  }, [currentPage, rowsPerPage, searchTerm, status, sortDate]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1); // Chuyển sang trang tiếp theo
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1); // Quay lại trang trước
    }
  };

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
                sx={{ fontWeight: "bold", maxWidth: "150px" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("customer-id")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
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
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="sticky right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("status")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("booking-date")}
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
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((row) => (
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
        count={totalBookings}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default BookingTable;
