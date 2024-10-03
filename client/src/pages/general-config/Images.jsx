import {
  Box,
  Button,
  Grid2,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VisuallyHiddenInput } from "../../utils/constants";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { green, red } from "@mui/material/colors";
import { apiGetSlider, apiUpdateSlider } from "../../apis/config";
import { useLoading } from "../../context/LoadingProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import path from "../../utils/path";

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
        setDeleteImages((prevDeleteImages) => {
          // Chỉ thêm vào deleteImages nếu hình ảnh đang xóa là một hình ảnh đã tồn tại
          if (existingImages.includes(imageToRemove)) {
            return [...prevDeleteImages, imageToRemove]; // Thêm hình ảnh vào danh sách xóa
          }
          return prevDeleteImages;
        });
      }
      return prevImages.filter((_, index) => index !== indexToRemove); // Xóa hình ảnh khỏi danh sách hiển thị
    });
  };

  useEffect(() => {
    const fetchSlider = async () => {
      // Fetch Slider
      const response = await apiGetSlider();
      if (response.status === 200) {
        const data = response.data;

        setImages(data.images);
        setExistingImages(data.images);
      }
    };

    fetchSlider();
  }, []);

  // SUBMIT
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    const formData = new FormData();

    const updatedExistingImages = existingImages.filter(
      (imageUrl) => !deleteImages.includes(imageUrl)
    );

    const newImages = images.filter(
      (imgSrc) => !existingImages.includes(imgSrc)
    );

    // Append images
    for (let index = 0; index < newImages.length; index++) {
      const imageSrc = newImages[index];

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

      const imageName = `${Math.random().toString(36).substring(2, 8)}-${index + 1}.${extension}`; // Tạo tên hình ảnh
      formData.append("images", blob, imageName); // Thêm hình ảnh vào FormData
    }

    formData.append("existingImages", JSON.stringify(updatedExistingImages));

    formData.append("deleteImages", JSON.stringify(deleteImages));

    // LOG
    for (let [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        console.log(`${key}: [Blob]`); // Chỉ in ra tên key nếu giá trị là Blob
      } else {
        console.log(`${key}:`, value); // In ra key và value
      }
    }

    try {
      const response = await apiUpdateSlider(formData);

      console.log(response.status);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("success-config"),
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "Confirm",
          cancelButtonText: "Cancel",
        }).then(({ isConfirmed }) => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "danger",
        title: t("fail-config"),
        showCancelButton: true,
        cancelButtonText: "Cancel",
      })

      console.error("Error config:", error);
    } finally {
      hideLoading();
    }
  };

  const handleCancel = () => {
    navigate(`/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`);
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("image-config")}</Typography>
      <form onSubmit={handleSubmit}>

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
          <ImageList sx={{ height: 600, mt: 2 }} cols={2}>
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
                    color: red[500]
                  }}
                  size="small"
                  onClick={() => handleRemoveImage(index)}
                >
                  <CancelIcon fontSize="small" />
                </IconButton>

                {/* Tên ảnh */}
                <ImageListItemBar
                  title={`Image ${index + 1}`}
                  position="bottom"
                  sx={{
                    background: "rgba(0, 0, 0, 0.5)",
                  }}
                />
              </ImageListItem>
            ))}
          </ImageList>
        )}

        <Grid2
          container
          fullWidth
          spacing={2}
          sx={{ mt: 2, justifyContent: "flex-end" }}
        >
          <Grid2>
            <Button type="submit" variant="contained" color="success">
              {t("update")}
            </Button>
          </Grid2>
          <Grid2>
            <Button variant="outlined" color="warning" onClick={handleCancel}>
              {t("cancel")}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

export default Images;
