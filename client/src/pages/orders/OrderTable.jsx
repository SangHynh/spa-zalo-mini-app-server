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
import {
  Button,
  Checkbox,
  Chip,
  ImageList,
  ImageListItem,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import WidgetsIcon from "@mui/icons-material/Widgets";
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
import { blue, green, red } from "@mui/material/colors";
import {
  apiDeleteOrder,
  apiDeleteOrders,
  apiGetOrders,
} from "../../apis/payments";
import PrintIcon from "@mui/icons-material/Print";
import InvoiceModal from "./InvoiceModal";

function Row(props) {
  const { showLoading, hideLoading } = useLoading();

  const { row, isSelected, handleClick, openInvoiceModal } = props;

  // // Chuyển đổi searchTerm và các trường thành chữ thường để việc so sánh không phân biệt chữ hoa chữ thường
  // const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // // Kiểm tra nếu bất kỳ ký tự nào trong searchTerm có trong các trường
  // const isVisible =
  //     row.customerId.name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //     row.customerId.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
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

  const handleDeleteOrder = (id, status) => {
    Swal.fire({
      icon: "warning",
      title: `${t("confirm")}`,
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoading();

        const res = await apiDeleteOrder(id);
        if (res.status === 200) {
          Swal.fire(`${t("delete-success")}!`, "", "success").then(() => {
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
            <Stack
              direction="row"
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Checkbox
                color="primary"
                checked={isSelected}
                onClick={(event) => handleClick(event, row._id)}
              />
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </Stack>
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
            onClick={() => handleCopy(row?._id)}
          >
            {row?._id}
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
            onClick={() => handleCopy(row.customerId?._id)}
          >
            {row.customerId?._id}
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
            {row.customerId?.name}
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
            {row.customerId?.phone}
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
            <Chip
              label={row.paymentStatus}
              color={
                row.paymentStatus === "pending"
                  ? "primary"
                  : row.paymentStatus === "cancelled"
                  ? "error"
                  : row.paymentStatus === "completed"
                  ? "success"
                  : "default"
              }
            />
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
            {new Date(row.orderDate).toLocaleString("vi-VN", {
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
            }).format(row.totalAmount)}
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
            {row.discountApplied ? "Yes" : "No"}
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
            }).format(row.discountAmount)}
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
            }).format(row.finalAmount)}
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
            {row.paymentMethod}
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
            onClick={() => handleCopy(row.transactionId)}
          >
            {row.transactionId}
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
            onClick={() => handleCopy(row.referralId)}
          >
            {row.referralId}
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
            onClick={() => handleCopy(row.voucherId)}
          >
            {row.voucherId}
          </TableCell>

          <TableCell
            align="right"
            sx={{ minWidth: "100px" }}
            className="sticky right-0 z-10 bg-white dark:bg-[#2F2F2F]"
          >
            <div className="flex gap-2">
              <Tooltip title={t("print")}>
                <IconButton
                  color="primary"
                  onClick={() => openInvoiceModal(row)}
                  // disabled={row.paymentStatus === "completed"}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title={t("delete")}>
                <IconButton
                  color="error"
                  onClick={() => handleDeleteOrder(row._id)}
                  // disabled={row.paymentStatus === "completed"}
                >
                  <CancelIcon />
                </IconButton>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={17}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("products")}
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

const OrderTable = ({ searchTerm, status }) => {
  const { t } = useTranslation();

  const { showLoading, hideLoading } = useLoading();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState([]);
  const [isInvoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const openInvoiceModal = (order) => {
    setSelectedOrder(order);
    setInvoiceModalOpen(true);
  };

  const closeInvoiceModal = () => {
    setInvoiceModalOpen(false);
  };

  const handleClick = (event, id) => {
    event.stopPropagation();

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  // Hàm kiểm tra xem row có được chọn hay không
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleDeleteSelectedOrders = () => {
    if (selected.length <= 0) {
      toast.warning(`${t("toast-selected")}!`);
    } else {
      Swal.fire({
        title: `${t("confirm")}`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `${t("yes")}`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          // Gọi API để xóa các đơn hàng đã chọn
          showLoading();

          const res = await apiDeleteOrders({ orderIds: selected }); // Truyền danh sách orderIds
          if (res.status === 200) {
            Swal.fire(`${t("delete-success")}!`, "", "success").then(() => {
              window.location.reload();
            });
          } else {
            Swal.fire(`${t("delete-failed")}!`, "", "error");
          }
          hideLoading();
        }
      });
    }
  };

  // GET PRODUCTS
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await apiGetOrders(
        currentPage,
        rowsPerPage,
        searchTerm,
        status
      );
      if (response.status === 200) {
        setOrders(response.data.orders);
        setTotalOrders(response.data.totalOrders);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchOrders();
  }, [currentPage, rowsPerPage, searchTerm, status]);

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
              <TableCell className="relative dark:text-black">
                <Button
                  variant="contained"
                  color="error"
                  className="flex-none gap-2"
                  onClick={handleDeleteSelectedOrders}
                >
                  {t("delete")} {selected.length}
                </Button>
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", maxWidth: "120px" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("customer-id")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("customer-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("phone")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("payment-status")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("order-date")}
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
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("discount-applied")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("discount-amount")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("final-amount")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("payment-method")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("transaction-id")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("referral-id")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("voucher-id")}
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
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((row) => (
                <Row
                  key={row?._id}
                  row={row}
                  isSelected={isSelected(row._id)}
                  handleClick={handleClick}
                  className="bg-[343541]"
                  openInvoiceModal={openInvoiceModal}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalOrders}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />

      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        setIsOpen={closeInvoiceModal}
        order={selectedOrder}
      />
    </>
  );
};

export default OrderTable;
