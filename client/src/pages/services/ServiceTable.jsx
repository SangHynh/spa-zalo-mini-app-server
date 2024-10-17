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
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { apiDeleteService, apiGetServices } from "../../apis/services";
import path from "../../utils/path";
import { useLoading } from "../../context/LoadingProvider";
import Swal from "sweetalert2";
import WidgetsIcon from "@mui/icons-material/Widgets";

function Row(props) {
  const { showLoading, hideLoading } = useLoading();

  const { row, searchTerm } = props;

  // // Chuyển đổi searchTerm và các trường thành chữ thường để việc so sánh không phân biệt chữ hoa chữ thường
  // const lowerCaseSearchTerm = searchTerm.toLowerCase();

  // // Kiểm tra nếu bất kỳ ký tự nào trong searchTerm có trong các trường
  // const isVisible =
  //   row.name.toLowerCase().includes(lowerCaseSearchTerm) ||
  //   row._id.toLowerCase().includes(lowerCaseSearchTerm);

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

  const handleDelete = (id) => {
    Swal.fire({
      icon: "warning",
      title: `${t("confirm")}!`,
      showCancelButton: true,
      confirmButtonText: `${t("yes")}`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        showLoading();
        const res = await apiDeleteService(id);
        if (res) {
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
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell
            align="right"
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
            align="center"
            className="sticky right-0 z-10 bg-white dark:bg-[#2F2F2F]"
          >
            <div className="flex items-center justify-center gap-2">
              <Tooltip title={t("edit")}>
                <IconButton
                  color="primary"
                  href={`${path.EDIT_SERVICE}/${row._id}`}
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
                <IconButton href={`${path.SVC_RECOMMEND_SYSTEM}/${row._id}`}>
                  <WidgetsIcon className="text-green-500" />
                </IconButton>
              </Tooltip>
            </div>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
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

const ServiceTable = ({ searchTerm, subCategoryId, priceSort }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);

  // GET SERVICES
  useEffect(() => {
    const fetchServices = async () => {
      const response = await apiGetServices(
        currentPage,
        rowsPerPage,
        searchTerm,
        subCategoryId,
        priceSort
      );
      if (response.status === 200) {
        setServices(response.data.services);
        setTotalServices(response.data.totalServices);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchServices();
  }, [currentPage, rowsPerPage, searchTerm, subCategoryId, priceSort]);

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
              <TableCell className="relative" sx={{ maxWidth: "100px" }} />
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("service-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("category")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("sub-category")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("description")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("price")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="sticky right-0 z-10 bg-gray-400 dark:bg-gray-100 dark:text-black"
              >
                {t("operations")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(services) && services.length > 0 ? (
              services.map((row) => (
                <Row key={row._id} row={row} searchTerm={searchTerm} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align="center">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalServices}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default ServiceTable;
