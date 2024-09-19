import React, { useState } from "react";
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
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function createData(
  id,
  name,
  price,
  category,
  stock,
  expiryDate,
  salesQuality,
  variants = [],
  relatedProducts = [],
  usageInstructions
) {
  return {
    id,
    name,
    price,
    category,
    stock,
    expiryDate,
    salesQuality,
    variants,
    relatedProducts,
    usageInstructions,
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          {row.id}
        </TableCell>
        <TableCell align="right">{row.name}</TableCell>
        <TableCell align="right">{row.price}</TableCell>
        <TableCell align="right">{row.category}</TableCell>
        <TableCell align="right">{row.stock}</TableCell>
        <TableCell align="right">{row.expiryDate}</TableCell>
        <TableCell align="right">{row.salesQuality}</TableCell>
        <TableCell align="right" sx={{ width: "350px" }}>
          {row.usageInstructions}
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
                Variants
              </Typography>
              <Table
                size="small"
                aria-label="purchases"
                sx={{ tableLayout: "fixed", width: "100%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Volume</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.variants.map((variantRow) => (
                    <TableRow key={variantRow.volume}>
                      <TableCell component="th" scope="row">
                        {variantRow.volume}
                      </TableCell>
                      <TableCell>{variantRow.price}</TableCell>
                      <TableCell>{variantRow.stock}</TableCell>
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
                Related Products
              </Typography>
              <Table
                size="small"
                aria-label="related-products"
                sx={{ tableLayout: "fixed", width: "100%" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Volume</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.relatedProducts &&
                    row.relatedProducts.map((relatedRow) => (
                      <TableRow key={relatedRow.name}>
                        <TableCell component="th" scope="row">
                          {relatedRow.name}
                        </TableCell>
                        <TableCell>{relatedRow.price}</TableCell>
                        <TableCell>{relatedRow.stock}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

const rows = [
  createData(
    1,
    "Frozen yoghurt",
    159,
    "Desserts",
    24,
    "2024-12-01",
    3.99,
    [{ volume: "100ml", price: 55, stock: 20 }],
    [
      { name: "Ice cream sandwich", price: 237, stock: 37 },
      { name: "Cupcake", price: 305, stock: 67 },
    ],
    "Here is the product manual (if available)"
  ),
  createData(
    2,
    "Ice cream sandwich",
    237,
    "Desserts",
    37,
    "2024-11-15",
    4.99,
    [{ volume: "100ml", price: 55, stock: 18 }],
    [
      { name: "Frozen yoghurt", price: 159, stock: 24 },
      { name: "Cupcake", price: 305, stock: 67 },
    ],
    "Here is the product manual (if available)"
  ),
  createData(
    3,
    "Eclair",
    262,
    "Desserts",
    24,
    "2024-10-20",
    3.79,
    [{ volume: "100ml", price: 50, stock: 15 }],
    [
      { name: "Gingerbread", price: 356, stock: 49 },
      { name: "Ice cream sandwich", price: 237, stock: 37 },
    ],
    "Here is the product manual (if available)"
  ),
  createData(
    4,
    "Cupcake",
    305,
    "Desserts",
    67,
    "2024-09-30",
    2.5,
    [{ volume: "150ml", price: 60, stock: 30 }],
    [
      { name: "Frozen yoghurt", price: 159, stock: 24 },
      { name: "Eclair", price: 262, stock: 24 },
    ],
    "Here is the product manual (if available)"
  ),
  createData(
    5,
    "Gingerbread",
    356,
    "Desserts",
    49,
    "2024-08-15",
    1.5,
    [{ volume: "200ml", price: 70, stock: 10 }],
    [
      { name: "Eclair", price: 262, stock: 24 },
      { name: "Cupcake", price: 305, stock: 67 },
    ],
    "Here is the product manual (if available)"
  ),
];

const ProductTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
      >
        <Table aria-label="collapsible table">
          <TableHead
            sx={{
              backgroundColor: "pink",
              position: "sticky",
              top: 0,
            }}
          >
            <TableRow>
              <TableCell />
              <TableCell sx={{ fontWeight: "bold" }}>Id</TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Name
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Stock
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Expiry Date
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Sales Quality
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                Usage Instructions
              </TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <Row key={row.name} row={row} />
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default ProductTable;
