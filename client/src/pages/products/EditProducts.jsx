import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Autocomplete, Backdrop, Checkbox, CircularProgress, Container, FormControl, Grid2, IconButton, ImageList, ImageListItem, Input, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Modal, styled, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { benefits, categories, VisuallyHiddenInput } from "../../utils/constants";
import PaginationTable from "../../components/tables/PaginationTable";
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { apiCreateProducts, apiGetProduct, apiUpdateProduct } from "../../apis/products";
import Swal from "sweetalert2";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import path from "../../utils/path";

const EditProduct = () => {
    // HANDLE IMAGES UPLOAD
    // State to hold uploaded image files
    const [images, setImages] = useState([]);
    const [deleteImages, setDeleteImages] = useState([]);
    const [existingImages, setExistingImages] = useState([]);

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
        setImages((prevImages) => {
            const imageToRemove = prevImages[indexToRemove];
            if (imageToRemove) {
                setDeleteImages((prevDeleteImages) => [...prevDeleteImages, existingImages[indexToRemove]]); // Use existing image URL for deletion
            }
            return prevImages.filter((_, index) => index !== indexToRemove); // Remove from displayed images
        });
    };    

    // HANDLE CREATE VARIANTS
    // Create variant button
    const [variants, setVariants] = useState([])
    const [variantId, setVariantId] = useState(1);
    const [variantVolume, setVariantVolume] = useState('')
    const [variantPrice, setVariantPrice] = useState('')
    const [variantStock, setVariantStock] = useState('')

    const createVariant = () => {
        if (variantVolume && variantPrice && variantStock) {
            const newVariant = {
                id: variantId, // Generate unique ID for each variant
                volume: variantVolume,
                price: variantPrice,
                stock: variantStock
            };

            // Add new variant to the state
            setVariants([...variants, newVariant]);

            setVariantId(variantId + 1);

            // Clear input fields after creating a variant
            setVariantVolume('');
            setVariantPrice('');
            setVariantStock('');
        } else {
            alert("Please fill in all fields.");
        }
    }

    const deleteVariant = (id) => {
        setVariants(variants.filter(variant => variant.id !== id));
    };

    // HANDLE CREATE INGREDIENTS
    const [ingredients, setIngredients] = useState([]);
    const [ingredientId, setIngredientId] = useState(1);
    const [ingredientName, setIngredientName] = useState('');
    const [ingredientPercentage, setIngredientPercentage] = useState('');
    const [ingredientUsageInstructions, setIngredientUsageInstructions] = useState('');

    const createIngredient = () => {
        if (ingredientName && ingredientPercentage) {
            const newIngredient = {
                id: ingredientId,
                name: ingredientName,
                percentage: ingredientPercentage,
                usageInstructions: ingredientUsageInstructions || 'N/A' // Default if not provided
            };

            setIngredients([...ingredients, newIngredient]);
            setIngredientId(ingredientId + 1);

            setIngredientName('');
            setIngredientPercentage('');
            setIngredientUsageInstructions('');
        } else {
            alert("Please fill in required fields.");
        }
    };

    const deleteIngredient = (id) => {
        setIngredients(ingredients.filter(ingredient => ingredient.id !== id));
    };

    // PREVIEW PRODUCT
    // Calculate total stock
    const [productName, setProductName] = useState('')
    const [productDescription, setProductDescription] = useState('')
    const [productAmount, setProductAmount] = useState('')
    const [productCategory, setProductCategory] = useState('')
    const [productBenefits, setProductBenefits] = useState([])
    const [productExpiredDate, setProductExpiredDate] = useState(dayjs())

    const calculateTotalStock = () => {
        return variants.reduce((total, variant) => total + variant.stock, 0);
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // HANDLE FETCH PRODUCT
    const { id } = useParams()

    useEffect(() => {
        const fetchProduct = async (productId) => {
            const response = await apiGetProduct(productId)
            if (response.status === 200) {
                const product = response.data
                
                setProductName(product.name)
                setProductDescription(product.description)
                setProductAmount(product.amount)
                setProductCategory(product.category)
                setProductBenefits(product.benefits)
                setProductExpiredDate(dayjs(product.expiryDate))
                setVariants(product.variants)
                setIngredients(product.ingredients)
                setProductAmount(product.price)

                setImages(product.images)
                setExistingImages(product.images)
            }
        }

        fetchProduct(id)
    }, [id])

    // SUBMIT
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', productName);
        formData.append('description', productDescription);
        formData.append('price', productAmount);
        formData.append('category', productCategory);
        formData.append('stock', calculateTotalStock());
        formData.append('expiryDate', productExpiredDate.format('DD/MM/YYYY'));
        formData.append('benefits', JSON.stringify(productBenefits));
        formData.append('variants', JSON.stringify(variants));
        formData.append('ingredients', JSON.stringify(ingredients));

        const updatedExistingImages = existingImages.filter(imageUrl => !deleteImages.includes(imageUrl));

        const newImages = images.filter(imgSrc => !existingImages.includes(imgSrc));

        // Append images
        for (let index = 0; index < newImages.length; index++) {
            const imageSrc = newImages[index];
    
            // Chuyển đổi blob URL thành Blob
            const response = await fetch(imageSrc);
            const blob = await response.blob();
    
            // Kiểm tra định dạng của hình ảnh
            const type = blob.type; // Lấy loại MIME (ví dụ: image/jpeg, image/png)
    
            let extension = '';
            if (type === 'image/jpeg') {
                extension = 'jpg';
            } else if (type === 'image/png') {
                extension = 'png';
            } else if (type === 'image/gif') {
                extension = 'gif';
            } else {
                console.error("Unsupported image type:", type);
                continue; // Bỏ qua hình ảnh này nếu không phải định dạng hỗ trợ
            }
    
            const imageName = `${productName}-${index + 1}.${extension}`; // Tạo tên hình ảnh
            formData.append("images", blob, imageName); // Thêm hình ảnh vào FormData
        }

        formData.append('existingImages', JSON.stringify(updatedExistingImages));

        formData.append('deleteImages', JSON.stringify(deleteImages));

        // LOG
        for (let [key, value] of formData.entries()) {
            if (value instanceof Blob) {
                console.log(`${key}: [Blob]`); // Chỉ in ra tên key nếu giá trị là Blob
            } else {
                console.log(`${key}:`, value); // In ra key và value
            }
        }

        try {
            const response = await apiUpdateProduct(id, formData);

            // console.log(response.data)
            console.log(response.status)

            if (response.status === 200) {
                Swal.fire({
                    icon: "success",
                    title: "Successfully update product!",
                    showConfirmButton: true,
                    showCancelButton: true,
                    confirmButtonText: "Confirm",
                    cancelButtonText: "Cancel",
                }).then(({ isConfirmed }) => {
                    if (isConfirmed) {
                        navigate(`/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`)
                    } else {
                        window.location.reload();
                    }
                });
            }
        } catch (error) {
            console.error('Error creating product:', error);
            // Handle error (e.g., show an error message)
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="m-5">
            <Backdrop open={loading} sx={{ color: '#fff', zIndex: 9999 }}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Typography variant="h5" gutterBottom>
                New Product
            </Typography>

            <form onSubmit={handleSubmit}>

                {/* Name */}
                <TextField
                    id="productName"
                    label="Product Name"
                    variant="standard"
                    fullWidth
                    placeholder="Product name..."
                    margin="dense"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                />

                {/* Description */}
                <TextField
                    id="productDescription"
                    label="Description"
                    multiline
                    fullWidth
                    rows={4}
                    placeholder="Description..."
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
                    Upload files
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
                            <InputLabel htmlFor="productPrice">Amount</InputLabel>
                            <Input
                                id="productPrice"
                                endAdornment={<InputAdornment position="end">VNĐ</InputAdornment>}
                                value={productAmount}
                                onChange={(e) => setProductAmount(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={4}>
                        {/* Category */}
                        <TextField
                            id="productCategory"
                            select
                            fullWidth
                            label="Category"
                            defaultValue="Category"
                            variant="standard"
                            margin="dense"
                            value={productCategory}
                            onChange={(e) => setProductCategory(e.target.value)}
                        >
                            {categories.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid2>
                    <Grid2 size={4}>
                        {/* Benefits */}
                        <Autocomplete
                            multiple
                            id="productBenefits"
                            options={benefits}
                            disableCloseOnSelect
                            getOptionLabel={(option) => option}
                            value={productBenefits}
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
                                    label="Benefits"
                                    placeholder="Choose benefits..."
                                    variant="standard"
                                    margin="dense"
                                />
                            )}
                        />
                    </Grid2>
                    <Grid2 size={4}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker
                                    label="Expired Date"
                                    variant="standard"
                                    fullWidth
                                    margin="dense"
                                    value={productExpiredDate}
                                    onChange={(newValue) => setProductExpiredDate(newValue)}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Grid2>
                </Grid2>

                {/* Variants */}
                <Grid2 container fullWidth spacing={1} sx={{ mt: 2 }}>
                    <Grid2 size={12}>
                        <Typography variant="h6" gutterBottom>
                            Create variant of product
                            <IconButton color="secondary" onClick={createVariant}>
                                <ControlPointIcon />
                            </IconButton>
                        </Typography>
                    </Grid2>
                    {/* Variant Input */}
                    <Grid2 size={4}>
                        {/* Volume */}
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="variantVolume">Volume</InputLabel>
                            <Input
                                id="variantVolume"
                                value={variantVolume}
                                onChange={(e) => setVariantVolume(e.target.value)}
                            />
                        </FormControl>
                        {/* Stock */}
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="variantStock">Stock</InputLabel>
                            <Input
                                id="variantStock"
                                value={variantStock}
                                onChange={(e) => setVariantStock(e.target.value)}
                            />
                        </FormControl>
                        {/* Price */}
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="variantPrice">Price</InputLabel>
                            <Input
                                id="variantPrice"
                                value={variantPrice}
                                onChange={(e) => setVariantPrice(e.target.value)}
                                endAdornment={<InputAdornment position="end">VNĐ</InputAdornment>}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={8}>
                        {/* Variants table */}
                        <PaginationTable
                            rows={variants}
                            columns={['volume', 'price', 'stock']}
                            onDelete={deleteVariant}
                        />
                    </Grid2>
                </Grid2>

                {/* Ingredients */}
                <Grid2 container fullWidth spacing={1} sx={{ mt: 2 }}>
                    <Grid2 size={12}>
                        <Typography variant="h6" gutterBottom>
                            Create ingredient of product
                            <IconButton color="secondary" onClick={createIngredient}>
                                <ControlPointIcon />
                            </IconButton>
                        </Typography>
                    </Grid2>
                    <Grid2 size={4}>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="ingredientName">Name</InputLabel>
                            <Input
                                id="ingredientName"
                                value={ingredientName}
                                onChange={(e) => setIngredientName(e.target.value)}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="ingredientPercentage">Percentage</InputLabel>
                            <Input
                                id="ingredientPercentage"
                                endAdornment={<InputAdornment position="end">%</InputAdornment>}
                                value={ingredientPercentage}
                                onChange={(e) => setIngredientPercentage(e.target.value)}
                            />
                        </FormControl>
                        <FormControl fullWidth margin="dense" variant="standard">
                            <InputLabel htmlFor="ingredientUsageInstructions">Usage Instructions</InputLabel>
                            <Input
                                id="ingredientUsageInstructions"
                                multiline
                                rows={3}
                                value={ingredientUsageInstructions}
                                onChange={(e) => setIngredientUsageInstructions(e.target.value)}
                            />
                        </FormControl>
                    </Grid2>
                    <Grid2 size={8}>
                        <PaginationTable
                            rows={ingredients}
                            columns={['name', 'percentage', 'usageInstructions']}
                            onDelete={deleteIngredient}
                        />
                    </Grid2>
                </Grid2>

                <Grid2 container fullWidth spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                    <Grid2>
                        <Button type="submit" variant="contained" color="success">
                            Update
                        </Button>
                    </Grid2>
                    <Grid2>
                        <Button variant="outlined" color="success" onClick={handleOpen}>
                            Preview
                        </Button>
                    </Grid2>
                    <Grid2>
                        <Button variant="outlined" color="warning">
                            Cancel
                        </Button>
                    </Grid2>
                </Grid2>

                {/* Preview Product Before Create */}
                <Modal open={open} onClose={handleClose}>
                    <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '75%', height: '80vh', bgcolor: 'background.paper', boxShadow: 24, p: 4, overflow: 'auto' }}>
                        <Typography variant="h6" component="h2">
                            Product Preview
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Name:</strong> {productName}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Total Stock:</strong> {calculateTotalStock()}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Amount:</strong> {productAmount} VND
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Category:</strong> {productCategory}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Expired Date:</strong> {productExpiredDate.format('DD/MM/YYYY')}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Description:</strong> {productDescription}
                        </Typography>
                        <Typography sx={{ mt: 2 }}>
                            <strong>Benefits:</strong> {productBenefits.join(', ')}
                        </Typography>
                        <Typography sx={{ mt: 2 }}><strong>Images:</strong></Typography>
                        {images.length > 0 && (
                            <ImageList sx={{ height: 250, mt: 2 }} cols={5} rowHeight={150}>
                                {images.map((imgSrc, index) => (
                                    <ImageListItem key={index}>
                                        <img src={imgSrc} alt={`Uploaded ${index}`} loading="lazy" />
                                    </ImageListItem>
                                ))}
                            </ImageList>
                        )}
                        <Typography sx={{ mt: 2 }}><strong>Variants:</strong></Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {variants.length > 0 ? variants.map((variant) => (
                                // <li key={variant.id}>
                                //     {variant.volume} - {variant.stock} in stock, {variant.price} VNĐ
                                // </li>
                                <ListItem key={variant.id}>
                                    <ListItemText
                                        primary={
                                            <React.Fragment>
                                                <Typography>
                                                    {variant.volume} - {variant.stock} in stock
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: 'text.primary', display: 'inline' }}
                                                >
                                                    Price: {variant.price} VNĐ
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            )) : 'No variants added.'}
                        </List>
                        <Typography sx={{ mt: 2 }}><strong>Ingredients:</strong></Typography>
                        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            {ingredients.length > 0 ? ingredients.map((ingredient) => (
                                <ListItem key={ingredient.id}>
                                    <ListItemText
                                        primary={
                                            // ingredient.name
                                            <React.Fragment>
                                                <Typography>
                                                    {ingredient.name} - {ingredient.percentage}%
                                                </Typography>
                                            </React.Fragment>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    sx={{ color: 'text.primary', display: 'inline' }}
                                                >
                                                    {/* {ingredient.percentage}% */}
                                                    Usage: {ingredient.usageInstructions}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            )) : 'No ingredients added.'}
                        </List>

                        <Grid2 container fullWidth spacing={2} sx={{ mt: 2, justifyContent: 'flex-end' }}>
                            <Grid2>
                                <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">
                                    Close
                                </Button>
                            </Grid2>
                        </Grid2>
                    </Box>
                </Modal>
            </form>

        </Container>
    );
};

export default EditProduct;
