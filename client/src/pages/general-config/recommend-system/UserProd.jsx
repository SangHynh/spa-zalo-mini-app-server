import {
  Box,
  Button,
  Checkbox,
  Grid2,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";
import { apiGetCustomers } from "../../../apis/users";
import Swal from "sweetalert2";
import { apiUpdateMultipleSuggestionScores } from "../../../apis/recommend-system";
import { FaEye } from "react-icons/fa";
import { apiGetProducts } from "../../../apis/products";

const UserProd = () => {
  const { t } = useTranslation();

  // USERS
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [rowsPerPageUser, setRowsPerPageUser] = useState(5);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTermUser, setSearchTermUser] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // PRODUCTS
  const [currentPageProduct, setCurrentPageProduct] = useState(1);
  const [rowsPerPageProduct, setRowsPerPageProduct] = useState(5);
  const [totalPagesProduct, setTotalPagesProduct] = useState(0);
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchTermProduct, setSearchTermProduct] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);

  // GET USERS
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await apiGetCustomers(
        currentPageUser,
        rowsPerPageUser,
        searchTermUser
      );
      if (response.status === 200) {
        setUsers(response.data.users || []);
        setTotalUsers(response.data.totalUsers);
        setTotalPagesUser(response.data.totalPages);
      }
    };

    fetchUsers();
  }, [currentPageUser, rowsPerPageUser, searchTermUser]);

  // GET PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetProducts(
        currentPageProduct,
        rowsPerPageProduct,
        searchTermProduct
      );
      if (response.status === 200) {
        setProducts(response.data.products || []);
        setTotalProducts(response.data.totalProducts);
        setTotalPagesProduct(response.data.totalPages);
      }
    };

    fetchProducts();
  }, [currentPageProduct, rowsPerPageProduct, searchTermProduct]);

  // Handle user page change
  const handleChangePageUser = (event, newPage) => {
    setCurrentPageUser(newPage + 1);
  };

  // Handle product page change
  const handleChangePageProduct = (event, newPage) => {
    setCurrentPageProduct(newPage + 1);
  };

  // Handle user rows per page change
  const handleChangeRowsPerPageUser = (event) => {
    setRowsPerPageUser(parseInt(event.target.value, 10));
    setCurrentPageUser(1); // Reset to the first page
  };

  // Handle product rows per page change
  const handleChangeRowsPerPageProduct = (event) => {
    setRowsPerPageProduct(parseInt(event.target.value, 10));
    setCurrentPageProduct(1); // Reset to the first page
  };

  // Handle search for users
  const handleSearchChangeUser = (e) => {
    setSearchTermUser(e.target.value);
    setCurrentPageUser(1); // Reset to the first page on search
  };

  // Handle search for products
  const handleSearchChangeProduct = (e) => {
    setSearchTermProduct(e.target.value);
    setCurrentPageProduct(1); // Reset to the first page on search
  };

  // Handle selection of users
  const handleSelectAllUsers = (event) => {
    if (event.target.checked) {
      const newSelectedUsers = users.map((user) => user._id);
      setSelectedUserIds(newSelectedUsers);
      return;
    }
    setSelectedUserIds([]);
  };

  // Handle selection of products
  const handleSelectAllProducts = (event) => {
    if (event.target.checked) {
      const newSelectedProducts = products.map((product) => product._id);
      setSelectedProductIds(newSelectedProducts);
      return;
    }
    setSelectedProductIds([]);
  };

  // Handle individual user selection
  const handleClickUser = (event, id) => {
    const selectedIndex = selectedUserIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUserIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUserIds.slice(1));
    } else if (selectedIndex === selectedUserIds.length - 1) {
      newSelected = newSelected.concat(selectedUserIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUserIds.slice(0, selectedIndex),
        selectedUserIds.slice(selectedIndex + 1)
      );
    }

    setSelectedUserIds(newSelected);
  };

  // Handle individual product selection
  const handleClickProduct = (event, id) => {
    const selectedIndex = selectedProductIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedProductIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedProductIds.slice(1));
    } else if (selectedIndex === selectedProductIds.length - 1) {
      newSelected = newSelected.concat(selectedProductIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedProductIds.slice(0, selectedIndex),
        selectedProductIds.slice(selectedIndex + 1)
      );
    }

    setSelectedProductIds(newSelected);
  };

  const isUserSelected = (id) => selectedUserIds.indexOf(id) !== -1;

  const isProductSelected = (id) => selectedProductIds.indexOf(id) !== -1;

  const handleUpdate = async () => {
    console.log("Selected User IDs:", selectedUserIds);
    console.log("Selected Category IDs:", selectedProductIds);
  };

  return (
    <Box className="w-full flex flex-col gap-4">
      <Grid2 container spacing={4}>
        <Grid2 size={6}>
          <Typography variant="h6" gutterBottom>
            {t("select-accounts")}
          </Typography>
          <div className="flex justify-between items-center space-x-3 my-4">
            <div className="flex-1 w-64 relative">
              <input
                type="text"
                placeholder={t("search...")}
                value={searchTermUser}
                onChange={handleSearchChangeUser}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
            </div>
          </div>
          <TableContainer component={Paper} className="border shadow-2xl">
            <Table>
              <TableHead className="sticky top-0 z-20 bg-gray-400 dark:bg-gray-100">
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedUserIds.length > 0 &&
                        selectedUserIds.length < users.length
                      }
                      checked={
                        users.length > 0 &&
                        selectedUserIds.length === users.length
                      }
                      onChange={handleSelectAllUsers}
                      sx={{ color: "black" }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    Id
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    {t("name")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    {t("phone")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user, index) => {
                  const isItemSelected = isUserSelected(user._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClickUser(event, user._id)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={user._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {user._id}
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalUsers}
            rowsPerPage={rowsPerPageUser}
            page={currentPageUser - 1}
            onPageChange={handleChangePageUser}
            onRowsPerPageChange={handleChangeRowsPerPageUser}
            labelRowsPerPage={t("rows-per-page")}
          />
        </Grid2>
        <Grid2 size={6}>
          <Typography variant="h6" gutterBottom>
            {t("select-prod")}
          </Typography>
          <div className="flex justify-between items-center space-x-3 my-4">
            <div className="flex-1 w-64 relative">
              <input
                type="text"
                placeholder={t("search...")}
                value={searchTermProduct}
                onChange={handleSearchChangeProduct}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
            </div>
          </div>
          <TableContainer component={Paper} className="border shadow-2xl">
            <Table>
              <TableHead className="sticky top-0 z-20 bg-gray-400 dark:bg-gray-100">
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      indeterminate={
                        selectedProductIds.length > 0 &&
                        selectedProductIds.length < products.length
                      }
                      checked={
                        products.length > 0 &&
                        selectedProductIds.length === products.length
                      }
                      onChange={handleSelectAllProducts}
                      sx={{ color: "black" }}
                    />
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    Id
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    {t("name")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => {
                  const isItemSelected = isProductSelected(product._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClickProduct(event, product._id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={product._id}
                      selected={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{
                            "aria-labelledby": labelId,
                          }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {product._id}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalProducts}
            rowsPerPage={rowsPerPageProduct}
            page={currentPageProduct - 1}
            onPageChange={handleChangePageProduct}
            onRowsPerPageChange={handleChangeRowsPerPageProduct}
            labelRowsPerPage={t("rows-per-page")}
          />
        </Grid2>
      </Grid2>
      <Box className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={handleUpdate}
        >
          {t("update")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserProd;
