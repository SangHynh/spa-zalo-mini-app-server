import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  apiGetService,
  apiGetServices,
  apiGetServicesByIDs,
} from "../../apis/services";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import {
  apiConfigServiceRecommendations,
  apiGetServiceRecommendations,
} from "../../apis/recommend-system";
import path from "../../utils/path";
import Swal from "sweetalert2";
import { useLoading } from "../../context/LoadingProvider";
import PreviewSvcRecommend from "../services/PreviewSvcRecommend";

const SvcRecommendSystem = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [serviceName, setServiceName] = useState("");

  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const [initialSelectedIds, setInitialSelectedIds] = useState(new Set());

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [services, setServices] = useState([]);
  const [totalServices, setTotalServices] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  // GET SERVICE
  useEffect(() => {
    const fetchService = async () => {
      try {
        const serviceResponse = await apiGetService(id);
        if (serviceResponse.status === 200) {
          setServiceName(serviceResponse.data.name);
        }
      } catch (error) {
        console.error("Error fetching service:", error);
      }
    };
    fetchService();
  }, [id]);

  // GET RECOMMENDATIONS (Table B)
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendationsResponse = await apiGetServiceRecommendations(id);
        if (recommendationsResponse.status === 200) {
          const recommendedServiceIds =
            recommendationsResponse.data.suggestions.map(
              (service) => service.itemId
            );
          setSelectedIds(recommendedServiceIds);
          setInitialSelectedIds(recommendedServiceIds);
        }
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };
    fetchRecommendations();
  }, [id]);

  // GET SERVICES (Table A)
  useEffect(() => {
    const fetchServices = async () => {
      // showLoading();
      try {
        const servicesResponse = await apiGetServices(
          currentPage,
          rowsPerPage,
          searchTerm
        );
        if (servicesResponse.status === 200) {
          setServices(servicesResponse.data.services); // Cập nhật dữ liệu bảng A

          // Nếu server cung cấp tổng số lượng sản phẩm, cập nhật rowCount
          setTotalServices(servicesResponse.data.totalServices);
          setTotalPages(servicesResponse.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        // hideLoading();
      }
    };

    fetchServices();
  }, [currentPage, rowsPerPage, searchTerm]);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1);
  };

  // Handle user rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page
  };

  // Handle search for users
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page on search
  };

  const [selectedServices, setSelectedServices] = useState([]);
  const [open, setOpen] = useState(false);

  const handleOpen = async () => {
    console.log(selectedIds);
    showLoading();
    const response = await apiGetServicesByIDs({ serviceIds: selectedIds });
    if (response.status === 200) {
      setSelectedServices(response.data.services);
      setOpen(true);
    } else {
      toast.error("Chưa có sản phẩm gợi ý được chọn!");
    }
    hideLoading();
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle individual user selection
  const handleClickService = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    if (newSelected.length > 12) {
      toast.error("Đã vượt quá số lượng gợi ý");
    } else {
      setSelectedIds(newSelected);
    }
  };

  const isSelected = (id) => selectedIds.indexOf(id) !== -1;

  const handleUpdate = async () => {
    showLoading();
    try {
      const currentlySelectedServiceIds = selectedIds.map((id) => ({
        serviceId: id,
      }));

      // Kiểm tra có thay đổi không
      const hasChanges =
        initialSelectedIds.length !== selectedIds.length ||
        !initialSelectedIds.every((id) => selectedIds.includes(id));

      if (!hasChanges) {
        toast.info(`${t("no-change")}`);
        return;
      }

      const response = await apiConfigServiceRecommendations(id, {
        mainServiceId: id,
        suggestions: currentlySelectedServiceIds,
      });
      if (response.status === 200) {
        Swal.fire({
          title: `${t("success")}!`,
          text: `${t("update-success")}!`,
          icon: "success",
          confirmButtonText: "Ok",
        }).then(() => {
          window.location.reload();
        });
      } else {
        console.error("Failed to update recommendations");
        Swal.fire({
          title: `${t("error")}!`,
          text: `${t("update-failed")}!`,
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    } catch (error) {
      console.error("Error calling API:", error);
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.SERVICE_MANAGEMENT}`);
  };

  const handleRefresh = () => {
    window.location.reload(); // Làm mới toàn bộ trang
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5" gutterBottom>
        {t("svc-recommend")}
      </Typography>
      <TextField
        id="serviceId"
        label="ID"
        variant="standard"
        fullWidth
        margin="dense"
        value={id}
        disabled
      />
      <TextField
        id="serviceName"
        label={t("service-name")}
        variant="standard"
        fullWidth
        margin="dense"
        value={serviceName}
        disabled
      />
      <Typography variant="h6" gutterBottom>
        {t("select-recommended-services")}
      </Typography>
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <input
            type="text"
            placeholder={t("search...")}
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-300" />
        </div>
        <Box>
          <span>{t("number-of-suggested-services")} : </span>
          <span>{selectedIds.length}</span>
          <span>/12</span>
        </Box>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead className="bg-gray-400 dark:bg-gray-100">
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="dark:text-black"
              >
                {t("service-id")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="dark:text-black"
              >
                {t("name")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="dark:text-black"
              >
                {t("category")}
              </TableCell>
              <TableCell
                align="center"
                sx={{ fontWeight: "bold" }}
                className="dark:text-black"
              >
                {t("sub-category")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {services.map((service, index) => {
              const isItemSelected = isSelected(service._id);
              const labelId = `enhanced-table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => handleClickService(event, service._id)}
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
                  <TableCell>{service.category}</TableCell>
                  <TableCell>{service.subCategory}</TableCell>
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
        rowsPerPage={rowsPerPage}
        page={currentPage - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage={t("rows-per-page")}
      />

      <PreviewSvcRecommend
        open={open}
        onClose={handleClose}
        services={selectedServices}
      />

      <Box className="mt-2 flex justify-end gap-2">
        <Button
          type="submit"
          variant="contained"
          color="success"
          onClick={handleUpdate}
        >
          {t("update")}
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleOpen}>
          {t("preview")}
        </Button>
        <Button variant="outlined" color="warning" onClick={handleCancel}>
          {t("cancel")}
        </Button>
        <Button variant="outlined" color="primary" onClick={handleRefresh}>
          {t("refresh")}
        </Button>
      </Box>
    </Box>
  );
};

export default SvcRecommendSystem;
