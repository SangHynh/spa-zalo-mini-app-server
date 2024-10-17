import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TablePagination,
  Slide,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  Checkbox,
  Paper,
  TableBody,
  Grid2,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useLoading } from "../../context/LoadingProvider";
import { apiGetCustomers } from "../../apis/users";
import { FaPlus, FaSearch } from "react-icons/fa";
import { apiGetVouchers, apiGiveAwayVouchersToUsers } from "../../apis/voucher";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const GiveVoucher = ({ open, onClose }) => {
  const { t } = useTranslation();
  const { showLoading, hideLoading } = useLoading();

  // USERS
  const [currentPageUser, setCurrentPageUser] = useState(1);
  const [rowsPerPageUser, setRowsPerPageUser] = useState(5);
  const [totalPagesUser, setTotalPagesUser] = useState(0);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTermUser, setSearchTermUser] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // VOUCHERS
  const [currentPageVoucher, setCurrentPageVoucher] = useState(1);
  const [rowsPerPageVoucher, setRowsPerPageVoucher] = useState(5);
  const [totalPagesVoucher, setTotalPagesVoucher] = useState(0);
  const [vouchers, setVouchers] = useState([]);
  const [totalVouchers, setTotalVouchers] = useState(0);
  const [searchTermVoucher, setSearchTermVoucher] = useState("");
  const [selectedVoucherIds, setSelectedVoucherIds] = useState([]);

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

  // GET VOUCHERS
  useEffect(() => {
    const fetchVouchers = async () => {
      const response = await apiGetVouchers(
        currentPageVoucher,
        rowsPerPageVoucher,
        searchTermVoucher
      );
      if (response.status === 200) {
        setVouchers(response.data.vouchers || []);
        setTotalVouchers(response.data.totalVouchers);
        setTotalPagesVoucher(response.data.totalPages);
      }
    };

    fetchVouchers();
  }, [currentPageVoucher, rowsPerPageVoucher, searchTermVoucher]);

  // Handle user page change
  const handleChangePageUser = (event, newPage) => {
    setCurrentPageUser(newPage + 1);
  };

  // Handle user rows per page change
  const handleChangeRowsPerPageUser = (event) => {
    setRowsPerPageUser(parseInt(event.target.value, 10));
    setCurrentPageUser(1); // Reset to the first page
  };

  // Handle voucher page change
  const handleChangePageVoucher = (event, newPage) => {
    setCurrentPageVoucher(newPage + 1);
  };

  // Handle voucher rows per page change
  const handleChangeRowsPerPageVoucher = (event) => {
    setRowsPerPageVoucher(parseInt(event.target.value, 10));
    setCurrentPageVoucher(1); // Reset to the first page
  };

  // Handle search for users
  const handleSearchChangeUser = (e) => {
    setSearchTermUser(e.target.value);
    setCurrentPageUser(1); // Reset to the first page on search
  };

  // Handle search for vouchers
  const handleSearchChangeVoucher = (e) => {
    setSearchTermVoucher(e.target.value);
    setCurrentPageVoucher(1); // Reset to the first page on search
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

  // Handle selection of vouchers
  const handleSelectAllVouchers = (event) => {
    if (event.target.checked) {
      const now = new Date();
      const newSelectedVouchers = vouchers
        .filter((voucher) => {
          const validFrom = new Date(voucher.validFrom);
          const validTo = new Date(voucher.validTo);
          const isExpired = voucher.usageLimit <= 0;
          const isInvalidPeriod = now < validFrom || now > validTo;

          return !isExpired && !isInvalidPeriod;
        })
        .map((voucher) => voucher._id);

      setSelectedVoucherIds(newSelectedVouchers);
    } else {
      setSelectedVoucherIds([]);
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

  // Handle individual voucher selection
  const handleClickVoucher = (event, id) => {
    const selectedIndex = selectedVoucherIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedVoucherIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedVoucherIds.slice(1));
    } else if (selectedIndex === selectedVoucherIds.length - 1) {
      newSelected = newSelected.concat(selectedVoucherIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedVoucherIds.slice(0, selectedIndex),
        selectedVoucherIds.slice(selectedIndex + 1)
      );
    }

    setSelectedVoucherIds(newSelected);
  };

  const isUserSelected = (id) => selectedUserIds.indexOf(id) !== -1;
  const isVoucherSelected = (id) => selectedVoucherIds.indexOf(id) !== -1;

  // Handle submit
  const handleSubmit = async () => {
    console.log("Selected User IDs:", selectedUserIds);
    console.log("Selected Voucher IDs:", selectedVoucherIds);

    if (selectedUserIds.length <= 0 || selectedVoucherIds.length <= 0) {
      // console.log("HAHA")
      Swal.fire({
        icon: "warning",
        title: `${t("warning")}!`,
        text: "Vui lòng chọn khách hàng và voucher",
        target: "",
      });
    }

    const formData = {
      users: selectedUserIds,
      vouchers: selectedVoucherIds,
    };

    try {
      showLoading();
      const response = await apiGiveAwayVouchersToUsers(formData);
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: `${t("give-success")}!`,
          showConfirmButton: true,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "danger",
        title: `${t("error")}!`,
        text: error.message,
      });
    } finally {
      hideLoading();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      TransitionComponent={Transition}
    >
      <DialogTitle>
        <Typography variant="h5" gutterBottom>
          {t("give-away-vouchers")}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          {/* SELECT USERS */}
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

          {/* SELECT VOUCHERS */}
          <Grid2 size={6}>
            <Typography variant="h6" gutterBottom>
              {t("select-vouchers")}
            </Typography>
            <div className="flex justify-between items-center space-x-3 my-4">
              <div className="flex-1 w-64 relative">
                <input
                  type="text"
                  placeholder={t("search...")}
                  value={searchTermVoucher}
                  onChange={handleSearchChangeVoucher}
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
                          selectedVoucherIds.length > 0 &&
                          selectedVoucherIds.length < vouchers.length
                        }
                        checked={
                          vouchers.length > 0 &&
                          selectedVoucherIds.length === vouchers.length
                        }
                        onChange={handleSelectAllVouchers}
                        sx={{ color: "black" }}
                      />
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {t("code")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {t("discount-type")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {t("discount-value")}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ color: "black", fontWeight: "bold" }}
                    >
                      {t("usage-limit")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vouchers.map((voucher, index) => {
                    const isItemSelected = isVoucherSelected(voucher._id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    const now = new Date();
                    const validFrom = new Date(voucher.validFrom);
                    const validTo = new Date(voucher.validTo);

                    const isExpired = voucher.usageLimit <= 0;
                    const isInvalidPeriod = now < validFrom || now > validTo;

                    const handleClickDisabledCheckbox = () => {
                      if (isExpired) {
                        toast.warning(t("voucher-expired"));
                      } else if (isInvalidPeriod) {
                        toast.warning(t("voucher-invalid-period"));
                      }
                    };
                    return (
                      <TableRow
                        hover
                        onClick={(event) => {
                          if (isExpired || isInvalidPeriod) {
                            handleClickDisabledCheckbox();
                          } else {
                            handleClickVoucher(event, voucher._id);
                          }
                        }}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={voucher._id}
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
                          {voucher.code}
                        </TableCell>
                        <TableCell>{voucher.discountType}</TableCell>
                        <TableCell>{voucher.discountValue}</TableCell>
                        <TableCell>{voucher.usageLimit}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20]}
              component="div"
              count={totalVouchers}
              rowsPerPage={rowsPerPageVoucher}
              page={currentPageVoucher - 1}
              onPageChange={handleChangePageVoucher}
              onRowsPerPageChange={handleChangeRowsPerPageVoucher}
              labelRowsPerPage={t("rows-per-page")}
            />
          </Grid2>
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="success">
          {t("confirm")}
        </Button>
        <Button variant="outlined" color="warning" onClick={onClose}>
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GiveVoucher;
