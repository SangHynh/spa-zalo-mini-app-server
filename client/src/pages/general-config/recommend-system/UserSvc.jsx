import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid2,
  Modal,
  Paper,
  Stack,
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
import {
  apiConfigServiceToUser,
  apiGetServiceConfig,
} from "../../../apis/recommend-system";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { apiGetServices } from "../../../apis/services";
import { toast } from "react-toastify";
import { Item } from "../../../utils/constants";

const UserSvc = () => {
  const { t } = useTranslation();

  // USERS
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [rowsPerPageUser, setRowsPerPageUser] = useState(5);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTermUser, setSearchTermUser] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // SERVICES
  const [currentPageService, setCurrentPageService] = useState(1);
  const [rowsPerPageService, setRowsPerPageService] = useState(5);
  const [totalPagesService, setTotalPagesService] = useState(0);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [searchTermService, setSearchTermService] = useState("");
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

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

  // GET SERVICES
  useEffect(() => {
    const fetchServices = async () => {
      const response = await apiGetServices(
        currentPageService,
        rowsPerPageService,
        searchTermService
      );
      if (response.status === 200) {
        setServices(response.data.services || []);
        setTotalServices(response.data.totalServices);
        setTotalPagesService(response.data.totalPages);
      }
    };

    fetchServices();
  }, [currentPageService, rowsPerPageService, searchTermService]);

  // Handle user page change
  const handleChangePageUser = (event, newPage) => {
    setCurrentPageUser(newPage + 1);
  };

  // Handle service page change
  const handleChangePageService = (event, newPage) => {
    setCurrentPageService(newPage + 1);
  };

  // Handle user rows per page change
  const handleChangeRowsPerPageUser = (event) => {
    setRowsPerPageUser(parseInt(event.target.value, 10));
    setCurrentPageUser(1); // Reset to the first page
  };

  // Handle service rows per page change
  const handleChangeRowsPerPageService = (event) => {
    setRowsPerPageService(parseInt(event.target.value, 10));
    setCurrentPageService(1); // Reset to the first page
  };

  // Handle search for users
  const handleSearchChangeUser = (e) => {
    setSearchTermUser(e.target.value);
    setCurrentPageUser(1); // Reset to the first page on search
  };

  // Handle search for services
  const handleSearchChangeService = (e) => {
    setSearchTermService(e.target.value);
    setCurrentPageService(1); // Reset to the first page on search
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

  // Handle selection of services
  const handleSelectAllServices = (event) => {
    if (event.target.checked) {
      const newSelectedServices = services.map((service) => service._id);
      setSelectedServiceIds(newSelectedServices);
      return;
    }
    setSelectedServiceIds([]);
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

  // Handle individual service selection
  const handleClickService = (event, id) => {
    const selectedIndex = selectedServiceIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedServiceIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedServiceIds.slice(1));
    } else if (selectedIndex === selectedServiceIds.length - 1) {
      newSelected = newSelected.concat(selectedServiceIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedServiceIds.slice(0, selectedIndex),
        selectedServiceIds.slice(selectedIndex + 1)
      );
    }

    setSelectedServiceIds(newSelected);
  };

  const isUserSelected = (id) => selectedUserIds.indexOf(id) !== -1;

  const isServiceSelected = (id) => selectedServiceIds.indexOf(id) !== -1;

  const handleUpdate = async () => {
    // console.log("Selected User IDs:", selectedUserIds);
    // console.log("Selected Category IDs:", selectedServiceIds);

    if (selectedUserIds.length === 0 || selectedServiceIds.length === 0) {
      toast.info(`${t("select user-svc pls")}`);
      return;
    }

    try {
      const response = await apiConfigServiceToUser(
        selectedUserIds,
        selectedServiceIds
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `${t("update-success")}!`,
          showConfirmButton: true,
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Error updating suggestions:", error);
    }
  };

  //MODAL
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [serviceConfig, setServiceConfig] = useState(null);
  const handleClose = () => setOpen(false);
  const handleOpen = async (user) => {
    setSelectedUser(user);
    setOpen(true);

    try {
      const response = await apiGetServiceConfig(user._id);
      console.log("Service configuration retrieved:", response.data);
      setServiceConfig(response.data.data);
    } catch (error) {
      console.error("Error fetching service configuration:", error);
    }
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
                  <TableCell></TableCell>
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
                      <TableCell
                        className="cursor-pointer"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleOpen(user);
                        }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </TableCell>
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
            {t("select-svc")}
          </Typography>
          <div className="flex justify-between items-center space-x-3 my-4">
            <div className="flex-1 w-64 relative">
              <input
                type="text"
                placeholder={t("search...")}
                value={searchTermService}
                onChange={handleSearchChangeService}
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
                        selectedServiceIds.length > 0 &&
                        selectedServiceIds.length < services.length
                      }
                      checked={
                        services.length > 0 &&
                        selectedServiceIds.length === services.length
                      }
                      onChange={handleSelectAllServices}
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
                {services.map((service, index) => {
                  const isItemSelected = isServiceSelected(service._id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) =>
                        handleClickService(event, service._id)
                      }
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={service._id}
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
                        {service._id}
                      </TableCell>
                      <TableCell>{service.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={totalServices}
            rowsPerPage={rowsPerPageService}
            page={currentPageService - 1}
            onPageChange={handleChangePageService}
            onRowsPerPageChange={handleChangeRowsPerPageService}
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

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth={true}
      >
        <DialogTitle id="responsive-dialog-title">
          <Stack>
            <Typography variant="h5" sx={{ mt: 2 }}>
              {selectedUser?.name}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              ID: {selectedUser?._id}
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="h6" component="h2">
              {t("exist-prod")}
            </Typography>
            <Stack spacing={2} className="mt-2">
              {Array.isArray(serviceConfig) &&
                serviceConfig.length > 0 ? (
                serviceConfig.map((configSuggestion) => (
                  <Item style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>ID: {configSuggestion._id}</span>
                    <span>{configSuggestion.name}</span>
                  </Item>
                ))
              ) : (
                <Typography align="center">{t("empty")}.</Typography>
              )}
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="outlined"
            color="warning"
          >
            {t("close")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserSvc;
