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
import { apiGetCategories } from "../../../apis/categories";

const UserCate = () => {
  const { t } = useTranslation();

  // USERS
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [rowsPerPageUser, setRowsPerPageUser] = useState(5);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTermUser, setSearchTermUser] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  //CATEGORIES
  const [categories, setCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchTermCategory, setSearchTermCategory] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [scores, setScores] = useState({});

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChangeCategory = (event) => {
    setSearchTermCategory(event.target.value);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTermCategory.toLowerCase()) ||
      category._id.toLowerCase().includes(searchTermCategory.toLowerCase())
  );

  const displayedCategories = filteredCategories.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Hàm xử lý thay đổi số lượng
  const handleScoreChange = (id, value) => {
    // Chỉ cho phép số hoặc chuỗi rỗng
    if (value === "" || /^[0-9]*$/.test(value)) {
      setScores({
        ...scores,
        [id]: value,
      });
    }
  };

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

  // GET CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetCategories();
      if (response.status === 200) setCategories(response.data);
    };

    fetchCategories();
  }, [searchTermCategory]);

  // Handle user page change
  const handleChangePageUser = (event, newPage) => {
    setCurrentPageUser(newPage + 1);
  };

  // Handle user rows per page change
  const handleChangeRowsPerPageUser = (event) => {
    setRowsPerPageUser(parseInt(event.target.value, 10));
    setCurrentPageUser(1); // Reset to the first page
  };

  // Handle search for users
  const handleSearchChangeUser = (e) => {
    setSearchTermUser(e.target.value);
    setCurrentPageUser(1); // Reset to the first page on search
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

  // Handle selection of categories
  const handleSelectAllCategories = (event) => {
    if (event.target.checked) {
      const newSelectedCategories = categories.map((category) => category._id);

      setSelectedCategoryIds(newSelectedCategories);
    } else {
      setSelectedCategoryIds([]);
    }
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

  // Handle individual category selection
  const handleClickCategory = (event, id) => {
    const selectedIndex = selectedCategoryIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedCategoryIds, id);
    } else {
      newSelected = newSelected.concat(
        selectedCategoryIds.slice(0, selectedIndex),
        selectedCategoryIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCategoryIds(newSelected);
  };

  const isUserSelected = (id) => selectedUserIds.indexOf(id) !== -1;
  const isCategorySelected = (id) => selectedCategoryIds.indexOf(id) !== -1;

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
            {t("select-cate")}
          </Typography>
          <div className="flex justify-between items-center space-x-3 my-4">
            <div className="flex-1 w-64 relative">
              <input
                type="text"
                placeholder={t("search...")}
                value={searchTermCategory}
                onChange={handleSearchChangeCategory}
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
                        selectedCategoryIds.length > 0 &&
                        selectedCategoryIds.length < categories.length
                      }
                      checked={
                        categories.length > 0 &&
                        selectedCategoryIds.length === categories.length
                      }
                      onChange={handleSelectAllCategories}
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
                    {t("category-name")}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ color: "black", fontWeight: "bold" }}
                  >
                    {t("suggestion-score")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedCategories.map((category, index) => {
                  const isItemSelected = isCategorySelected(category._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClickCategory(event, category._id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={category._id}
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
                        {category._id}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell align="center">
                        <input
                          type="text"
                          value={scores[category._id] || ""}
                          onChange={(e) =>
                            handleScoreChange(category._id, e.target.value)
                          }
                          className="border-b border-gray-300 bg-transparent focus:outline-none py-1 px-2 w-10 text-center"
                          min="0"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredCategories.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage={t("rows-per-page")}
          />
        </Grid2>
      </Grid2>
      <Box className="mt-2 flex justify-end gap-2">
        <Button
          type="submit"
          variant="contained"
          color="success"
          //   onClick={handleUpdate}
        >
          {t("update")}
        </Button>
        <Button
          variant="outlined"
          color="primary"
          // onClick={handleRefresh}
        >
          {t("refresh")}
        </Button>
      </Box>
    </Box>
  );
};

export default UserCate;
