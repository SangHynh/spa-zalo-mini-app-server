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
import { Avatar, Chip, ImageList, ImageListItem, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { apiGetStaffs } from "../../apis/staffs";
import { stringAvatar } from "../../utils/constants";

function Row(props) {
  const { row } = props;

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
      <React.Fragment>
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#2F2F2F" : "#FFFFFF",
          }}
        >
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
              minWidth: "100px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            <Avatar
              src={row.avatar && row.avatar !== '' ? row.avatar : undefined}
              {...(!row.avatar || row.avatar === '' ? stringAvatar(row.name) : {})}
            >
            </Avatar>

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
            {row.name}
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
            {row.email}
          </TableCell>
          <TableCell
            align="right"
            sx={{
              maxWidth: "500px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            {row.permissions.map((permission, index) => (
              <Chip
                key={index}
                label={permission}
                color="success"
                // variant="outlined"
                sx={{ marginRight: 0.5 }}
              />
            ))}
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
      </React.Fragment>
    </>
  );
}

const StaffTable = ({ searchTerm }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [staffs, setStaffs] = useState([]);
  const [totalStaffs, setTotalStaffs] = useState(0);

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
    const fetchStaffs = async () => {
      const response = await apiGetStaffs(
        currentPage,
        rowsPerPage,
        searchTerm
      );
      if (response.status === 200) {
        setStaffs(response.data.staffs);
        setTotalStaffs(response.data.totalStaffs);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchStaffs();
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
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", maxWidth: "100px" }}
                className="relative dark:text-black"
              >
                Id
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="relative dark:text-black"
              >
                {t("customer-avatar")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("staff-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "300px" }}
                className="relative dark:text-black"
              >
                {t("staff-email")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("permissions")}
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
            {Array.isArray(staffs) && staffs.length > 0 ? (
              staffs.map((row) => (
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
                  No staffs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalStaffs}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default StaffTable;
