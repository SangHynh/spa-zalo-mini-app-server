import React, { useState } from "react";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Autocomplete, Checkbox, Container, FormControl, Grid2, IconButton, ImageList, ImageListItem, Input, InputAdornment, InputLabel, MenuItem, styled, TextField } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CancelIcon from "@mui/icons-material/Cancel";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { benefits, categories, VisuallyHiddenInput } from "../../utils/constants";

const CreateProduct = () => {
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
        setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    };

    return (
        <Container className="m-5">
            <Typography variant="h5" gutterBottom>
                New Product
            </Typography>

            {/* Name */}
            <TextField
                id="productName"
                label="Product Name"
                variant="standard"
                fullWidth
                placeholder="Product name..."
                margin="dense"
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
                <Grid2 size={4}>
                    {/* Price */}
                    <FormControl fullWidth margin="dense" variant="standard">
                        <InputLabel htmlFor="productPrice">Amount</InputLabel>
                        <Input
                            id="productPrice"
                            endAdornment={<InputAdornment position="end">VNĐ</InputAdornment>}
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
            </Grid2>
        </Container>
    );
};

export default CreateProduct;
