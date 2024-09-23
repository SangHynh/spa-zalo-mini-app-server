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
import { Container, ImageList, ImageListItem, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { apiGetProducts } from "../../apis/products";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTranslation } from "react-i18next";

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation();

  return (
    <React.Fragment>
      <TableRow
        sx={{ "& > *": { borderBottom: "unset" } }}
        className="bg-gray-100"
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row._id}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(row.price)}
        </TableCell>
        <TableCell align="right">{row.category}</TableCell>
        <TableCell align="right">{row.stock}</TableCell>
        <TableCell align="right">
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
        <TableCell align="right" sx={{ width: "250px" }}>
          {row.benefits.join(", ")}
        </TableCell>
        <TableCell align="right" sx={{ width: "350px" }}>
          {row.description}
        </TableCell>
        <TableCell align="right" sx={{ width: "10px" }}>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell align="right" sx={{ width: "10px" }}>
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
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
                  {row.variants.map((variantRow) => (
                    <TableRow key={variantRow.volume}>
                      <TableCell component="th" scope="row" align="center">
                        {variantRow.volume}
                      </TableCell>
                      <TableCell align="center">{variantRow.price}</TableCell>
                      <TableCell align="center">{variantRow.stock}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <TableRow>
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
                      {t("usageInstructions")}
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
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={11}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                {t("images")}
              </Typography>
              {/* Image List */}
              {row.images.length > 0 && (
                <ImageList sx={{ height: 250, mt: 2 }} cols={5} rowHeight={150}>
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
  );
}

const CustomerTable = () => {
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

  const [products, setProducts] = useState([]);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts();
      if (response.status === 200) setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "600px", overflowY: "auto", overflowX: "auto" }}
      >
        <Table aria-label="collapsible table">
          <TableHead
            sx={{
              backgroundColor: "pink",
              position: "sticky",
              top: 0,
              zIndex: 10,
            }}
          >
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("name")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("price")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("category")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("stock")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("expDate")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("benefits")}
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {t("description")}
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row._id} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rowsOfPage")}
      />
    </>
  );
};

export default CustomerTable;
