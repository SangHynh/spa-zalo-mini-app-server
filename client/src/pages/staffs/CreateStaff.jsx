import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
  Avatar,
  Backdrop,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  Grid2,
  IconButton,
  ImageList,
  ImageListItem,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  styled,
  TextField,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { benefits, VisuallyHiddenInput } from "../../utils/constants";
import PaginationTable from "../../components/tables/PaginationTable";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { apiCreateStaff } from "../../apis/staffs";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { apiGetCategories } from "../../apis/categories";
import { useLoading } from "../../context/LoadingProvider";
import { useTranslation } from "react-i18next";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { apiGetPermission } from "../../apis/config";
import { DataGrid } from "@mui/x-data-grid";

const CreateStaff = () => {
  const { t } = useTranslation();

  // HANDLE IMAGE UPLOAD
  const [image, setImage] = useState(null);

  // Handle file upload and store files in the state
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  // FETCH CATEGORIES
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      const response = await apiGetPermission();
      if (response.status === 200) {
        const permissionData = response.data;
        const permissionRows = Object.entries(permissionData).map(
          ([key, value], index) => ({
            id: index + 1,
            key,
            value,
          })
        );
        setPermissions(permissionRows);
      }
    };

    fetchPermissions();
  }, []);

  // PREVIEW SERVICE
  const [staffName, setStaffName] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffPassword, setStaffPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);

  // SUBMIT
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const formData = new FormData();
    formData.append("name", staffName);
    formData.append("email", staffEmail);
    formData.append("password", staffPassword);
    formData.append("role", "admin");

    if (Array.isArray(selectedPermissions) && selectedPermissions.length > 0) {
      selectedPermissions.forEach((permission) => {
        formData.append("permissions[]", permission);
      });
    } else {
      return Swal.fire({
        icon: "error",
        title: "No permissions selected!",
        text: "Please select at least one permission.",
      });
    }

    // Append image
    // Chuyển đổi blob URL thành Blob
    const response = await fetch(image);
    const blob = await response.blob();

    // Kiểm tra định dạng của hình ảnh
    const type = blob.type; // Lấy loại MIME (ví dụ: image/jpeg, image/png)

    let extension = "";
    if (type === "image/jpeg") {
      extension = "jpg";
    } else if (type === "image/png") {
      extension = "png";
    } else if (type === "image/gif") {
      extension = "gif";
    } else {
      console.error("Unsupported image type:", type);
    }

    const imageName = `${staffName}.${extension}`; // Tạo tên hình ảnh
    formData.append("images", blob, imageName); // Thêm hình ảnh vào FormData

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await apiCreateStaff(formData);

      // console.log(response.data)
      console.log(response.status);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: `${t("create-success")}!`,
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: `${t("leave")}`,
          cancelButtonText: `${t("stay")}`,
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            navigate(`/${path.ADMIN_LAYOUT}/${path.STAFF_MANAGEMENT}`);
          } else {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating staff:", error);
      // Handle error (e.g., show an error message)
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.STAFF_MANAGEMENT}`);
  };

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {t("new-staff")}
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={4}>
            {/* Name */}
            <TextField
              id="staffName"
              label={t("staff-name")}
              variant="standard"
              fullWidth
              margin="dense"
              value={staffName}
              onChange={(e) => setStaffName(e.target.value)}
            />
          </Grid2>
          <Grid2 size={4}>
            {/* Email */}
            <TextField
              id="staffEmail"
              label={t("staff-email")}
              fullWidth
              rows={4}
              variant="standard"
              margin="dense"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
            />
          </Grid2>
          <Grid2 size={4}>
            {/* Password */}
            <FormControl variant="standard" margin="dense" fullWidth>
              <InputLabel htmlFor="standard-adornment-password">
                {t("password")}
              </InputLabel>
              <Input
                id="standard-adornment-password"
                value={staffPassword}
                onChange={(e) => setStaffPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid2>

          <Grid2 size={6}>
            <Paper sx={{ width: "100%" }}>
              <DataGrid
                rows={permissions}
                columns={[
                  {
                    field: "key",
                    headerName: `${t("permission-name")}`,
                    width: 250,
                  },
                  {
                    field: "value",
                    headerName: `${t("permission-value")}`,
                    width: 250,
                  },
                ]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
                pageSizeOptions={[5, 10]}
                checkboxSelection
                onRowSelectionModelChange={(newSelection) => {
                  const selectedPerms = newSelection.map(
                    (id) => permissions.find((p) => p.id === id)?.value
                  );
                  setSelectedPermissions(selectedPerms);
                }}
                sx={{ border: 0 }}
              />
            </Paper>
          </Grid2>

          <Grid2 size={6}>
            <Grid2 size={12}>
              {/* Image */}
              <Button
                component="label"
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
              >
                {t("upload-files")}
                <VisuallyHiddenInput
                  type="file"
                  onChange={handleFileUpload}
                  accept="image/*"
                />
              </Button>
            </Grid2>
            <Grid2 size={12}>
              <Avatar
                src={image}
                className="mt-5"
                sx={{ width: 250, height: 250 }}
              />
            </Grid2>
          </Grid2>
        </Grid2>

        <Grid2
          container
          fullWidth
          spacing={2}
          sx={{ mt: 2, justifyContent: "flex-end" }}
        >
          <Grid2>
            <Button type="submit" variant="contained" color="success">
              {t("create")}
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Container>
  );
};

export default CreateStaff;
