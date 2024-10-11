import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {
  Autocomplete,
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
import { apiCreateServices } from "../../apis/services";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { apiGetCategories } from "../../apis/categories";
import PreviewService from "./PreviewService";
import { useLoading } from "../../context/LoadingProvider";
import { useTranslation } from "react-i18next";

const CreateService = () => {
  const { t } = useTranslation();

  // HANDLE IMAGES UPLOAD
  // State to hold uploaded image files
  const [images, setImages] = useState([]);

  // Handle file upload and store files in the state
  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];

    // Convert the FileList to an array and create object URLs for each file
    for (let i = 0; i < files.length; i++) {
      newImages.push(URL.createObjectURL(files[i]));
    }

    setImages(newImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  // FETCH CATEGORIES
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await apiGetCategories();
      if (response.status === 200) setCategories(response.data);
    };

    fetchCategories();
  }, []);

  // Display sub category
  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setServiceCategory(selectedCategory);

    const category = categories.find((cat) => cat._id === selectedCategory._id);
    setSubCategories(category ? category.subCategory : []);
    setServiceSubCategory("");

    console.log(serviceCategory);
    console.log(serviceSubCategory);
  };

  // PREVIEW SERVICE
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [serviceAmount, setServiceAmount] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [serviceSubCategory, setServiceSubCategory] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // SUBMIT
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const formData = new FormData();
    formData.append("name", serviceName);
    formData.append("description", serviceDescription);
    formData.append("price", serviceAmount);
    formData.append("categoryId", serviceCategory._id);
    formData.append("category", serviceCategory.name);
    formData.append("subCategoryId", serviceSubCategory._id);
    formData.append("subCategory", serviceSubCategory.name);

    // Append images
    for (let index = 0; index < images.length; index++) {
      const imageSrc = images[index];

      // Chuyển đổi blob URL thành Blob
      const response = await fetch(imageSrc);
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
        continue; // Bỏ qua hình ảnh này nếu không phải định dạng hỗ trợ
      }

      const imageName = `${serviceName}-${index + 1}.${extension}`; // Tạo tên hình ảnh
      formData.append("images", blob, imageName); // Thêm hình ảnh vào FormData
    }

    try {
      const response = await apiCreateServices(formData);

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
            navigate(`/${path.ADMIN_LAYOUT}/${path.SERVICE_MANAGEMENT}`);
          } else {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating service:", error);
      // Handle error (e.g., show an error message)
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.SERVICE_MANAGEMENT}`);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {t("new-service")}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          id="serviceName"
          label={t("service-name")}
          variant="standard"
          fullWidth
          margin="dense"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
        />

        {/* Description */}
        <TextField
          id="serviceDescription"
          label={t("description")}
          multiline
          fullWidth
          rows={4}
          variant="standard"
          margin="dense"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
        />

        <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            {/* Price */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="servicePrice">{t("price")}</InputLabel>
              <Input
                id="servicePrice"
                endAdornment={
                  <InputAdornment position="end">VNĐ</InputAdornment>
                }
                value={serviceAmount}
                onChange={(e) => setServiceAmount(e.target.value)}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={6}>
            {/* Category */}
            <TextField
              select
              fullWidth
              label={t("category")}
              variant="standard"
              margin="dense"
              value={serviceCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid2>
          <Grid2 size={6}>
            {/* SubCategory */}
            <TextField
              select
              fullWidth
              label={t("sub-category")}
              variant="standard"
              margin="dense"
              value={serviceSubCategory}
              onChange={(e) => setServiceSubCategory(e.target.value)}
              disabled={!serviceCategory}
            >
              {!serviceCategory ? (
                <MenuItem value="">Choose category first</MenuItem>
              ) : (
                subCategories.map((subCategory) => (
                  <MenuItem key={subCategory._id} value={subCategory}>
                    {subCategory.name}
                  </MenuItem>
                ))
              )}
            </TextField>
          </Grid2>

          <Grid2 size={12}>
            {/* Images */}
            <Button
              component="label"
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
              sx={{ mt: 2 }}
            >
              {t("upload-files")}
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileUpload}
                multiple
                accept="image/*"
              />
            </Button>

            {/* Image List */}
            {images.length > 0 && (
              <ImageList sx={{ height: 250, mt: 2 }} cols={5} rowHeight={150}>
                {images.map((imgSrc, index) => (
                  <ImageListItem key={index}>
                    <img
                      src={imgSrc}
                      alt={`Uploaded ${index}`}
                      loading="lazy"
                    />

                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                        borderRadius: "50%",
                      }}
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </ImageListItem>
                ))}
              </ImageList>
            )}
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
            <Button variant="outlined" color="secondary" onClick={handleOpen}>
              {t("preview")}
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </Grid2>
        </Grid2>

        {/* Preview Service Before Create */}
        <PreviewService
          open={open}
          handleClose={handleClose}
          serviceName={serviceName}
          serviceAmount={serviceAmount}
          serviceCategory={serviceCategory}
          serviceSubCategory={serviceSubCategory}
          serviceDescription={serviceDescription}
          images={images}
        />
      </form>
    </Container>
  );
};

export default CreateService;
