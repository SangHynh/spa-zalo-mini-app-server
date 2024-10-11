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
import { apiCreateCategory } from "../../apis/categories";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { apiGetCategories } from "../../apis/categories";
import PreviewCategory from "./PreviewCategory";
import { useLoading } from "../../context/LoadingProvider";
import { useTranslation } from "react-i18next";

const CreateCategory = () => {
  const { t } = useTranslation();

  // HANDLE CREATE SUBCATEGORIES
  // Create subCategory button
  const [subCategories, setSubCategories] = useState([]);
  const [subCategoryId, setSubCategoryId] = useState(1);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryDescription, setSubCategoryDescription] = useState("");

  const createSubCategory = () => {
    if (subCategoryName && subCategoryDescription) {
      const newSubCategory = {
        _id: subCategoryId, // Generate unique ID for each subCategory
        name: subCategoryName,
        description: subCategoryDescription,
      };

      // Add new subCategory to the state
      setSubCategories([...subCategories, newSubCategory]);

      setSubCategoryId(subCategoryId + 1);

      // Clear input fields after creating a subCategory
      setSubCategoryName("");
      setSubCategoryDescription("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteSubCategory = (id) => {
    setSubCategories(
      subCategories.filter((subCategory) => subCategory.id !== id)
    );
  };

  // PREVIEW CATEGORY
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // SUBMIT
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const data = {
      name: categoryName,
      description: categoryDescription,
      subCategory: subCategories.map(({ _id, ...rest }) => rest),
    };

    try {
      const response = await apiCreateCategory(data);

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
            navigate(`/${path.ADMIN_LAYOUT}/${path.CATEGORY_MANAGEMENT}`);
          } else {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
      // Handle error (e.g., show an error message)
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.CATEGORY_MANAGEMENT}`);
  };

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        {t("new-category")}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          id="categoryName"
          label={t("category-name")}
          variant="standard"
          fullWidth
          // placeholder="Category name..."
          margin="dense"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />

        {/* Description */}
        <TextField
          id="categoryDescription"
          label={t("description")}
          multiline
          fullWidth
          rows={4}
          // placeholder="Description..."
          variant="standard"
          margin="dense"
          value={categoryDescription}
          onChange={(e) => setCategoryDescription(e.target.value)}
        />

        {/* SubCategories */}
        <Grid2 container fullWidth spacing={1} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            <Typography variant="h6" gutterBottom>
              {t("create-subcategory")}
              <IconButton color="secondary" onClick={createSubCategory}>
                <ControlPointIcon />
              </IconButton>
            </Typography>
          </Grid2>
          {/* SubCategory Input */}
          <Grid2 size={4}>
            {/* Name */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="subCategoryName">
                {t("sub-category-name")}
              </InputLabel>
              <Input
                id="subCategoryName"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
              />
            </FormControl>
            {/* Description */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="subCategoryDescription">
                {t("description")}
              </InputLabel>
              <Input
                id="subCategoryDescription"
                value={subCategoryDescription}
                onChange={(e) => setSubCategoryDescription(e.target.value)}
                multiline
                rows={3}
              />
            </FormControl>
          </Grid2>
          <Grid2 size={1}></Grid2>
          <Grid2 size={7}>
            <Box className="border-gray-300 shadow-xl border-2 rounded-md ml-10 mt-4">
              {/* SubCategories table */}
              <PaginationTable
                rows={subCategories}
                columns={["_id", "name", "description"]}
                onDelete={deleteSubCategory}
              />
            </Box>
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

        {/* Preview Category Before Create */}
        <PreviewCategory
          open={open}
          handleClose={handleClose}
          categoryName={categoryName}
          categoryDescription={categoryDescription}
          subCategories={subCategories}
        />
      </form>
    </Container>
  );
};

export default CreateCategory;
