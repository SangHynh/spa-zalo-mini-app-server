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
import { apiGetServices } from "../../apis/services";

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
        toast.success("Copy thành công");
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
              align="right"
              component="th"
              scope="row"
              className="relative cursor-pointer"
              onClick={() => handleCopy(row._id)}
            >
              {row._id}
            </TableCell>
            <TableCell align="right" className="relative">
              {row.name}
            </TableCell>
            <TableCell align="right" className="relative">
              {row.category}
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
              {row.description}
            </TableCell>
            <TableCell align="right" className="relative">
              {row.price}
            </TableCell>
            <TableCell
              align="center"
              className="sticky right-0 z-10 bg-white dark:bg-[#2F2F2F]"
            >
              <div className="flex items-center justify-center gap-2">
                <Tooltip title="Edit">
                  <IconButton>
                    <EditIcon className="text-green-500" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton>
                    <DeleteIcon className="text-red-500" />
                  </IconButton>
                </Tooltip>
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
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
      )}
    </>
  );
}

const ServiceTable = ({ searchTerm }) => {
  const { t } = useTranslation();

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [services, setServices] = useState([]);

  // GET SERVICES
  useEffect(() => {
    const fetchServices = async () => {
      const response = await apiGetServices();
      if (response.status === 200) setServices(response.data);
    };

    fetchServices();
  }, []);

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
      >
        <Table aria-label="collapsible table" className="border-2 boder-black">
          <TableHead className="sticky top-0 z-20 dark:bg-gray-100">
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
                className="sticky right-0 z-10 bg-white dark:bg-gray-100 dark:text-black"
              >
                {t("operations")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row._id} row={row} searchTerm={searchTerm} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={services.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rowsOfPage")}
      />
    </>
  );
};

export default ServiceTable;
