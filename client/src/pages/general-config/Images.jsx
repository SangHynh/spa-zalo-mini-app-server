import {
  Box,
  Button,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { VisuallyHiddenInput } from "../../utils/constants";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const Images = () => {
  const { t } = useTranslation();

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
        setDeleteImages((prevDeleteImages) => [
          ...prevDeleteImages,
          existingImages[indexToRemove],
        ]); // Use existing image URL for deletion
      }
      return prevImages.filter((_, index) => index !== indexToRemove); // Remove from displayed images
    });
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("image-config")}</Typography>
      <Button
        component="label"
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{ mt: 2, width: "fit-content" }}
      >
        {t("upload-files")}
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileUpload}
          multiple
          accept="image/*"
        />
      </Button>

      {images.length > 0 && (
        <ImageList sx={{ height: 600, mt: 2 }} cols={5} rowHeight={500}>
          {images.map((imgSrc, index) => (
            <ImageListItem key={index}>
              <img src={imgSrc} alt={`Uploaded ${index}`} loading="lazy" />

              {/* Nút xóa */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                }}
                size="small"
                onClick={() => handleRemoveImage(index)}
              >
                <CancelIcon fontSize="small" />
              </IconButton>

              {/* Nút xsao */}
              <IconButton
                sx={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  backgroundColor: "transparent",
                  borderRadius: "50%",
                }}
                size="small"
                onClick={() => handleRemoveImage(index)}
              >
                <StarBorderIcon />
              </IconButton>

              {/* Tên ảnh */}
              <ImageListItemBar
                title={`Image ${index + 1}`}
                position="bottom"
                sx={{
                  background: "rgba(0, 0, 0, 0.5)",
                }}
                // subtitle={}
                actionIcon={
                  <IconButton
                    sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                    // aria-label={}
                  >
                    <InfoIcon />
                  </IconButton>
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
    </Box>
  );
};

export default Images;
