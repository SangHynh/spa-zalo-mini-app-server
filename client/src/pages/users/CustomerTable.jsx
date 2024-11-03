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
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid2, ImageList, ImageListItem, Modal, Slide, Stack, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { apiGetCustomer, apiGetCustomers } from "../../apis/users";
import { apiGetRanks, apiUpdateUserPoints } from "../../apis/rank";
import Swal from "sweetalert2";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Row(props) {
  const { row } = props;

  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const [ranks, setRanks] = useState([]);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [currentUserRankPoints, setCurrentUserRankPoints] = useState(0);
  const [currentUserRank, setCurrentUserRank] = useState('');
  const [currentUserRankColor, setCurrentUserRankColor] = useState('');

  const { t } = useTranslation();

  useEffect(() => {
    const fetchRanks = async () => {
      try {
        const response = await apiGetRanks();
  
        if (response.status === 200) {
          const sortedRanks = response.data.sort((a, b) => b.minPoints - a.minPoints);
          setRanks(sortedRanks);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchRanks();
  }, [])

  const handleClose = () => setOpenModal(false);

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

  const handleOpen = async (userId) => {
    try {
      setSelectedUserId(userId);

      const response = await apiGetCustomer(userId);

      if (response.status === 200) {
        setSelectedUser(response.data);
        setCurrentUserPoints(response.data.points);
        setCurrentUserRankPoints(response.data.rankPoints);
        setCurrentUserRank(response.data.membershipTier);
        setCurrentUserRankColor(response.data.rankColor);
        setOpenModal(true);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleRankPointsChange = (event) => {
    const newRankPoints = event.target.value;
    setCurrentUserRankPoints(newRankPoints);
  
    const matchedRank = ranks.find((rank) => newRankPoints >= rank.minPoints);
  
    if (matchedRank) {
      setCurrentUserRank(matchedRank.tier);
      setCurrentUserRankColor(matchedRank.color);
    }
  };
  
  const handleUpdateUserPoints = async () => {
    if (
      currentUserRankPoints !== selectedUser.rankPoints ||
      currentUserPoints !== selectedUser.points
    ) {
      try {
        // Gửi yêu cầu cập nhật chỉ khi có sự thay đổi
        const response = await apiUpdateUserPoints({
          userId: selectedUserId,
          rankPoints: currentUserRankPoints,
          points: currentUserPoints,
        });
  
        if (response.status === 200) {
          Swal.fire({
            icon: "success",
            title: `${t("update-success")}!`,
            showConfirmButton: true,
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        toast.error(error.message);
      }
    } else {
      toast.info(t("no-change"));
    }
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
            <img
              class="w-12 h-12 rounded-full"
              src={row.avatar}
              alt={row.name}
            ></img>
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
            {row.phone}
          </TableCell>
          <TableCell
            align="center"
            sx={{
              minWidth: "100px",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
            className="relative"
          >
            <Chip label={row.membershipTier} variant="outlined" sx={{ color: (row.rankColor), borderColor: (row.rankColor) }} />
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
            {row.rankPoints}
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
            {row.points}
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
            {row.gender}
          </TableCell>
          <TableCell
            component="th"
            scope="row"
            sx={{
              minWidth: "120px",
              whiteSpace: "nowrap",
              // overflowX: "auto",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            className="relative cursor-pointer"
            onClick={() => handleCopy(row.referralCode)}
          >
            {row.referralCode}
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
            {row.referralInfo?.paths}
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
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(row.amounts)}
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
            {new Date(row.referralInfo?.referredAt).toLocaleString("vi-VN", {
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
            sx={{ minWidth: "100px" }}
            className="sticky right-0 z-10  bg-white dark:bg-[#2F2F2F]"
          >
            <div className="flex gap-2">
              <Tooltip title={t("edit")}>
                <IconButton color="primary" onClick={() => handleOpen(row._id)}>
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
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("addresses")}
                </Typography>
                <Table
                  size="small"
                  aria-label="purchases"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("Id")}</TableCell>
                      <TableCell align="center">{t("house-number")}</TableCell>
                      <TableCell align="center">{t("ward")}</TableCell>
                      <TableCell align="center">{t("district")}</TableCell>
                      <TableCell align="center">{t("city")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.addresses &&
                      row.addresses.map((address) => (
                        <TableRow key={address._id}>
                          <TableCell component="th" scope="row" align="center">
                            {address._id}
                          </TableCell>
                          <TableCell align="center">
                            {address.number}
                          </TableCell>
                          <TableCell align="center">
                            {address.ward}
                          </TableCell>
                          <TableCell align="center">
                            {address.district}
                          </TableCell>
                          <TableCell align="center">
                            {address.city}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("favorite-services")}
                </Typography>
                <Table
                  size="small"
                  aria-label="purchases"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("service-id")}</TableCell>
                      <TableCell align="center">{t("service-name")}</TableCell>
                      <TableCell align="center">{t("usage-count")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.favoriteServices &&
                      row.favoriteServices.map((favoriteServiceRow) => (
                        <TableRow key={favoriteServiceRow._id}>
                          <TableCell component="th" scope="row" align="center">
                            {favoriteServiceRow._id}
                          </TableCell>
                          <TableCell align="center">
                            {favoriteServiceRow.serviceName}
                          </TableCell>
                          <TableCell align="center">
                            {favoriteServiceRow.usageCount}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("product-suggestions")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("product-id")}</TableCell>
                      <TableCell align="center">{t("product-name")}</TableCell>
                      <TableCell align="center">
                        {t("suggested-score")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.productSuggestions &&
                      row.productSuggestions.map((productSuggestion) => (
                        <TableRow key={productSuggestion._id}>
                          <TableCell component="th" scope="row" align="center">
                            {productSuggestion._id}
                          </TableCell>
                          <TableCell align="center">
                            {productSuggestion.productName}
                          </TableCell>
                          <TableCell align="center">
                            {productSuggestion.suggestedScore}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("discounts")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("voucher-id")}</TableCell>
                      <TableCell align="center">{t("used-at")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.discountsUsed &&
                      row.discountsUsed.map((discountUsed) => (
                        <TableRow key={discountUsed._id}>
                          <TableCell component="th" scope="row" align="center">
                            {discountUsed._id}
                          </TableCell>
                          <TableCell align="center">
                            {discountUsed.usedAt}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("cart")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("product-id")}</TableCell>
                      <TableCell align="center">{t("name")}</TableCell>
                      <TableCell align="center">{t("price")}</TableCell>
                      <TableCell align="center">{t("quantity")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.carts &&
                      row.carts.map((cart) => (
                        <TableRow key={cart._id}>
                          <TableCell component="th" scope="row" align="center">
                            {cart._id}
                          </TableCell>
                          <TableCell align="center">
                            {cart.productName}
                          </TableCell>
                          <TableCell align="center">{cart.price}</TableCell>
                          <TableCell align="center">{cart.quantity}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("voucher")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("voucher-id")}</TableCell>
                      <TableCell align="center">{t("code")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.vouchers &&
                      row.vouchers.map((voucher) => (
                        <TableRow key={voucher._id}>
                          <TableCell component="th" scope="row" align="center">
                            {voucher.voucherId}
                          </TableCell>
                          <TableCell align="center">{voucher.code}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className="bg-[#F0F2F5] dark:bg-[#121212]">
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={13}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t("cate-suggest")}
                </Typography>
                <Table
                  size="small"
                  aria-label="related-products"
                  sx={{ tableLayout: "fixed", width: "100%" }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell align="center">{t("category-id")}</TableCell>
                      <TableCell align="center">
                        {t("suggestion-score")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.suggestions &&
                      row.suggestions.map((suggestion) => (
                        <TableRow key={suggestion._id}>
                          <TableCell component="th" scope="row" align="center">
                            {suggestion.categoryId}
                          </TableCell>
                          <TableCell align="center">
                            {suggestion.suggestedScore}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>

        <Dialog
          open={openModal}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Stack direction="row" spacing={2} divider={<Divider orientation="vertical" flexItem />}>
              <div>{selectedUser?.name}</div>
              <Chip label={currentUserRank} variant="outlined" sx={{ color: (currentUserRankColor), borderColor: (currentUserRankColor) }} />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <Grid2 container spacing={2}>
                <Grid2 size={6}>
                  <TextField
                    id="rankPoints"
                    label={`${t('rankPoints')} - ${t('use-for-rank')}`}
                    type="number"
                    variant="standard"
                    value={currentUserRankPoints}
                    onChange={handleRankPointsChange}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid2>
                <Grid2 size={6}>
                  <TextField
                    id="points"
                    label={`${t('points')} - ${t('use-for-earn')}`}
                    type="number"
                    variant="standard"
                    value={currentUserPoints}
                    onChange={(e) => setCurrentUserPoints(e.target.value)}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                  />
                </Grid2>
              </Grid2>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="success" onClick={handleUpdateUserPoints}>{t('update')}</Button>
            <Button variant="outlined" color="warning" onClick={handleClose}>{t('cancel')}</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </>
  );
}

const CustomerTable = ({ searchTerm }) => {
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);

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
    const fetchCustomers = async () => {
      const response = await apiGetCustomers(
        currentPage,
        rowsPerPage,
        searchTerm
      );
      if (response.status === 200) {
        setCustomers(response.data.users);
        setTotalCustomers(response.data.totalUsers);
        setTotalPages(response.data.totalPages);
      }
    };

    fetchCustomers();
  }, [currentPage, rowsPerPage, searchTerm]);

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
              <TableCell className="relative" />
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
                {t("customer-name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "150px" }}
                className="relative dark:text-black"
              >
                {t("phone")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("membership-tier")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("rankPoints")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("points")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "100px" }}
                className="relative dark:text-black"
              >
                {t("gender")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "120px" }}
                className="relative dark:text-black"
              >
                {t("referral-code")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("referred-by")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("amounts")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold", minWidth: "200px" }}
                className="relative dark:text-black"
              >
                {t("referred-at")}
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
            {Array.isArray(customers) && customers.length > 0 ? (
              customers.map((row) => (
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
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCustomers}
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />
    </>
  );
};

export default CustomerTable;
