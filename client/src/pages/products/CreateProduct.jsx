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
import { apiCreateProducts } from "../../apis/products";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import path from "../../utils/path";
import { apiGetCategories } from "../../apis/categories";
import PreviewProduct from "./PreviewProduct";
import { useLoading } from "../../context/LoadingProvider";
import { useTranslation } from "react-i18next";

const CreateProduct = () => {
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

  // HANDLE CREATE VARIANTS
  // Create variant button
  const [variants, setVariants] = useState([]);
  const [variantId, setVariantId] = useState(1);
  const [variantVolume, setVariantVolume] = useState("");
  const [variantPrice, setVariantPrice] = useState("");
  const [variantStock, setVariantStock] = useState("");

  const createVariant = () => {
    if (variantVolume && variantPrice && variantStock) {
      const newVariant = {
        _id: variantId, // Generate unique ID for each variant
        volume: variantVolume,
        price: variantPrice,
        stock: variantStock,
      };

      // Add new variant to the state
      setVariants([...variants, newVariant]);

      setVariantId(variantId + 1);

      // Clear input fields after creating a variant
      setVariantVolume("");
      setVariantPrice("");
      setVariantStock("");
    } else {
      alert("Please fill in all fields.");
    }
  };

  const deleteVariant = (id) => {
    setVariants(variants.filter((variant) => variant._id !== id));
  };

  const handleEditVariantRow = (updatedRow) => {
    setVariants((prevVariants) =>
      prevVariants.map((variant) =>
        variant._id === updatedRow._id ? updatedRow : variant
      )
    );
  };

  // HANDLE CREATE INGREDIENTS
  const [ingredients, setIngredients] = useState([]);
  const [ingredientId, setIngredientId] = useState(1);
  const [ingredientName, setIngredientName] = useState("");
  const [ingredientPercentage, setIngredientPercentage] = useState("");
  const [ingredientUsageInstructions, setIngredientUsageInstructions] =
    useState("");

  const createIngredient = () => {
    if (ingredientName && ingredientPercentage) {
      const newIngredient = {
        _id: ingredientId,
        name: ingredientName,
        percentage: ingredientPercentage,
        usageInstructions: ingredientUsageInstructions || "N/A", // Default if not provided
      };

      setIngredients([...ingredients, newIngredient]);
      setIngredientId(ingredientId + 1);

      setIngredientName("");
      setIngredientPercentage("");
      setIngredientUsageInstructions("");
    } else {
      alert("Please fill in required fields.");
    }
  };

  const deleteIngredient = (id) => {
    setIngredients(ingredients.filter((ingredient) => ingredient._id !== id));
  };

  const handleEditIngredientRow = (updatedRow) => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) =>
        ingredient._id === updatedRow._id ? updatedRow : ingredient
      )
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
    setProductCategory(selectedCategory);

    const category = categories.find((cat) => cat._id === selectedCategory._id);
    setSubCategories(category ? category.subCategory : []);
    setProductSubCategory("");

    console.log(productCategory);
    console.log(productSubCategory);
  };

  // PREVIEW PRODUCT
  // Calculate total stock
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productAmount, setProductAmount] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productSubCategory, setProductSubCategory] = useState("");
  const [productBenefits, setProductBenefits] = useState([]);
  const [productExpiredDate, setProductExpiredDate] = useState(dayjs());

  const calculateTotalStock = () => {
    return variants.reduce((total, variant) => total + variant.stock, 0);
  };

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
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("price", productAmount);
    formData.append("categoryId", productCategory._id);
    formData.append("category", productCategory.name);
    formData.append("subCategoryId", productSubCategory._id);
    formData.append("subCategory", productSubCategory.name);
    formData.append("stock", calculateTotalStock());
    formData.append("expiryDate", productExpiredDate.format("DD/MM/YYYY"));
    formData.append("benefits", JSON.stringify(productBenefits));
    formData.append(
      "variants",
      JSON.stringify(variants.map(({ _id, ...rest }) => rest))
    );
    formData.append(
      "ingredients",
      JSON.stringify(ingredients.map(({ _id, ...rest }) => rest))
    );

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

      const imageName = `${productName}-${index + 1}.${extension}`; // Tạo tên hình ảnh
      formData.append("images", blob, imageName); // Thêm hình ảnh vào FormData
    }

    try {
      const response = await apiCreateProducts(formData);

      // console.log(response.data)
      console.log(response.status);

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Successfully create new product!",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
        }).then(({ isConfirmed }) => {
          if (isConfirmed) {
            navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`);
          } else {
            window.location.reload();
          }
        });
      }
    } catch (error) {
      console.error("Error creating product:", error);
      // Handle error (e.g., show an error message)
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`);
  };

  return (
    <Container className="m-5">
      <Typography variant="h5" gutterBottom>
        {t("new-product")}
      </Typography>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <TextField
          id="productName"
          label={t("product-name")}
          variant="standard"
          fullWidth
          margin="dense"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        {/* Description */}
        <TextField
          id="productDescription"
          label={t("description")}
          multiline
          fullWidth
          rows={4}
          variant="standard"
          margin="dense"
          value={productDescription}
          onChange={(e) => setProductDescription(e.target.value)}
        />

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
                <img src={imgSrc} alt={`Uploaded ${index}`} loading="lazy" />

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

        <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={12}>
            {/* Price */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="productPrice">{t("price")}</InputLabel>
              <Input
                id="productPrice"
                endAdornment={
                  <InputAdornment position="end">VNĐ</InputAdornment>
                }
                value={productAmount}
                onChange={(e) => setProductAmount(e.target.value)}
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
              value={productCategory}
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
              value={productSubCategory}
              onChange={(e) => setProductSubCategory(e.target.value)}
              disabled={!productCategory}
            >
              {!productCategory ? (
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
          <Grid2 size={6}>
            {/* Benefits */}
            <Autocomplete
              multiple
              id="productBenefits"
              options={benefits}
              freeSolo
              getOptionLabel={(option) => option}
              onChange={(event, newValue) => {
                setProductBenefits(newValue); // Update the selected benefits
              }}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Checkbox
                      icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
                      checkedIcon={<CheckBoxIcon fontSize="small" />}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {option}
                  </li>
                );
              }}
              fullWidth
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("benefits")}
                  variant="standard"
                  margin="dense"
                />
              )}
            />
          </Grid2>
          <Grid2 size={6}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DemoContainer components={["DatePicker"]}>
                <DatePicker
                  label={t("exp-date")}
                  variant="standard"
                  fullWidth
                  margin="dense"
                  value={productExpiredDate}
                  onChange={(e) => setProductExpiredDate(e)}
                />
              </DemoContainer>
            </LocalizationProvider>
          </Grid2>
        </Grid2>

        {/* Variants */}
        <Grid2 container fullWidth spacing={1} sx={{ mt: 6 }}>
          <Grid2 size={12}>
            <Typography variant="h6" gutterBottom>
              {t("create-variant-product")}
              <IconButton color="secondary" onClick={createVariant}>
                <ControlPointIcon />
              </IconButton>
            </Typography>
          </Grid2>
          {/* Variant Input */}
          <Grid2 size={4}>
            {/* Volume */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="variantVolume">{t("volume")}</InputLabel>
              <Input
                id="variantVolume"
                value={variantVolume}
                onChange={(e) => setVariantVolume(e.target.value)}
              />
            </FormControl>
            {/* Stock */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="variantStock">{t("stock")}</InputLabel>
              <Input
                id="variantStock"
                value={variantStock}
                onChange={(e) => setVariantStock(e.target.value)}
              />
            </FormControl>
            {/* Price */}
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="variantPrice">{t("price")}</InputLabel>
              <Input
                id="variantPrice"
                value={variantPrice}
                onChange={(e) => setVariantPrice(e.target.value)}
                endAdornment={
                  <InputAdornment position="end">VNĐ</InputAdornment>
                }
              />
            </FormControl>
          </Grid2>
          <Grid2 size={1}></Grid2>
          <Grid2 size={7}>
            <Box className="border-gray-300 shadow-xl border-2 rounded-md ml-10 mt-4">
              <PaginationTable
                rows={variants}
                columns={["_id", "volume", "price", "stock"]}
                onDelete={deleteVariant}
                onEditRow={handleEditVariantRow}
              />
            </Box>
          </Grid2>
        </Grid2>

        {/* Ingredients */}
        <Grid2 container fullWidth spacing={1} sx={{ mt: 6 }}>
          <Grid2 size={12}>
            <Typography variant="h6" gutterBottom>
              {t("create-ingredient-product")}
              <IconButton color="secondary" onClick={createIngredient}>
                <ControlPointIcon />
              </IconButton>
            </Typography>
          </Grid2>
          <Grid2 size={4}>
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="ingredientName">{t("name")}</InputLabel>
              <Input
                id="ingredientName"
                value={ingredientName}
                onChange={(e) => setIngredientName(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="ingredientPercentage">
                {t("percentage")}
              </InputLabel>
              <Input
                id="ingredientPercentage"
                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                value={ingredientPercentage}
                onChange={(e) => setIngredientPercentage(e.target.value)}
              />
            </FormControl>
            <FormControl fullWidth margin="dense" variant="standard">
              <InputLabel htmlFor="ingredientUsageInstructions">
                {t("usage-instructions")}
              </InputLabel>
              <Input
                id="ingredientUsageInstructions"
                multiline
                rows={3}
                value={ingredientUsageInstructions}
                onChange={(e) => setIngredientUsageInstructions(e.target.value)}
              />
            </FormControl>
          </Grid2>
          {/* <Grid2 size={1}></Grid2> */}
          <Grid2 size={8}>
            <Box className="border-gray-300 shadow-xl border-2 rounded-md ml-10 mt-4">
              <PaginationTable
                rows={ingredients}
                columns={["_id", "name", "percentage", "usageInstructions"]}
                onDelete={deleteIngredient}
                onEditRow={handleEditIngredientRow}
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
            <Button variant="outlined" color="success" onClick={handleOpen}>
              {t("preview")}
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </Grid2>
        </Grid2>

        {/* Preview Product Before Create */}
        <PreviewProduct
          open={open}
          handleClose={handleClose}
          productName={productName}
          productAmount={productAmount}
          productCategory={productCategory}
          productSubCategory={productSubCategory}
          productExpiredDate={productExpiredDate}
          productDescription={productDescription}
          productBenefits={productBenefits}
          images={images}
          variants={variants}
          ingredients={ingredients}
          calculateTotalStock={calculateTotalStock}
        />
      </form>
    </Container>
  );
};

export default CreateProduct;
