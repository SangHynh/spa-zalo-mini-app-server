import {
  Box,
  Button,
  Grid2,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  Modal,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VisuallyHiddenInput } from "../../utils/constants";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CancelIcon from "@mui/icons-material/Cancel";
import { blue, green, red } from "@mui/material/colors";
import { apiGetSlider, apiUpdateSlider } from "../../apis/config";
import { useLoading } from "../../context/LoadingProvider";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import path from "../../utils/path";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import CloseIcon from "@mui/icons-material/Close";

const Images = () => {
  const { t } = useTranslation();

  // HANDLE IMAGES UPLOAD
  // State to hold uploaded image files
  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];

    // Thêm ảnh mới với index tiếp theo
    for (let i = 0; i < files.length; i++) {
      newImages.push({
        index: newImages.length, // Đặt index là độ dài hiện tại của mảng
        url: url.createObjecturl(files[i]), // Tạo url cho từng file
      });
    }

    // Cập nhật lại index của từng ảnh
    const updatedImages = newImages.map((img, i) => ({ ...img, index: i }));

    setImages(updatedImages);
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prevImages) => {
      const imageToRemove = prevImages.find(
        (img) => img.index === indexToRemove
      );
      if (imageToRemove) {
        setDeleteImages((prevDeleteImages) => {
          if (existingImages.some((img) => img.index === imageToRemove.index)) {
            return [...prevDeleteImages, imageToRemove];
          }
          return prevDeleteImages;
        });
      }

      const filteredImages = prevImages.filter(
        (img) => img.index !== indexToRemove
      );
      // Cập nhật lại index của từng ảnh sau khi xóa
      return filteredImages.map((img, i) => ({ ...img, index: i }));
    });
  };

  useEffect(() => {
    const fetchSlider = async () => {
      const response = await apiGetSlider();
      if (response.status === 200) {
        const data = response.data;

        setImages(data.images);
        setExistingImages(data.images);
        console.log("Images set from fetched data:", data.images);
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
      (imageurl) => !deleteImages.includes(imageurl)
    );

    const newImages = images.filter(
      (imgSrc) => !existingImages.includes(imgSrc)
    );

    // Append images
    for (let index = 0; index < newImages.length; index++) {
      const imageSrc = newImages[index];

      // Chuyển đổi blob url thành Blob
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

      const imageName = `${Math.random().toString(36).substring(2, 8)}-${
        index + 1
      }.${extension}`; // Tạo tên hình ảnh
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
      });

      console.error("Error config:", error);
    } finally {
      hideLoading();
    }
  };

  // const handleCancel = () => {
  //   navigate(`/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`);
  // };

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleOpen = (imgSrc) => {
    setSelectedImage(imgSrc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        // Swap urls
        [newImages[index].url, newImages[index - 1].url] = [
          newImages[index - 1].url,
          newImages[index].url,
        ];
      });
    }
  };

  const handleMoveDown = (index) => {
    if (index < images.length - 1) {
      setImages((prevImages) => {
        const newImages = [...prevImages];
        // Swap urls
        [newImages[index].url, newImages[index + 1].url] = [
          newImages[index + 1].url,
          newImages[index].url,
        ];
        return newImages;
      });
    }
  };

  return (
    <Box className="p-8 w-full flex flex-col gap-6">
      <Typography variant="h5">{t("image-config")}</Typography>
      {/* <form onSubmit={handleSubmit}> */}
      <Button
        component="label"
        variant="contained"
        tabindex={-1}
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

      <div className="overflow-x-auto">
        {console.log("Images trước khi render:", images)}
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-400 dark:bg-gray-100 text-black">
              <th className="border px-4 py-2">{t("no.")}</th>
              <th className="border px-4 py-2">{t("nor-image")}</th>
              <th className="border px-4 py-2">{t("arrange")}</th>
              <th className="border px-4 py-2">{t("operations")}</th>
            </tr>
          </thead>
          {images.length > 0 && (
            <tbody>
              {images.map((imgSrc, index) => (
                <tr key={imgSrc._id} className="relative">
                  <td className="text-center border">{imgSrc.index}</td>
                  {console.log("URL img:", imgSrc.url)}
                  <td className="border">
                    <div className="flex items-center justify-center m-4">
                      {/* <img
                        src={imgSrc.url}
                        alt={`Uploaded ${imgSrc.index}`}
                        loading="lazy"
                        className="w-[500px] h-[250px]"
                        onClick={() => handleOpen(imgSrc.url)}
                      /> */}
                      {imgSrc.url}
                    </div>
                  </td>
                  <td className="border">
                    <div className="flex h-full w-full gap-4 items-center justify-center">
                      <button
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        <FaArrowUp />
                      </button>
                      <button
                        onClick={() => handleMoveDown(index)}
                        disabled={index === images.length - 1}
                      >
                        <FaArrowDown />
                      </button>
                    </div>
                  </td>
                  <td className="border">
                    <div className="flex h-full w-full items-center justify-center">
                      {/* <Tooltip title={t("detail")}>
                            <IconButton>
                              <PendingIcon sx={{ color: blue[500] }} />
                            </IconButton>
                          </Tooltip> */}
                      <IconButton onClick={() => handleRemoveImage(index)}>
                        <CancelIcon sx={{ color: red[500] }} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        // disableScrollLock
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            position: "relative",
          }}
          onClick={handleClose}
        >
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "white",
            }}
          >
            <CloseIcon fontSize="large" />
          </IconButton>
          <img
            src={selectedImage}
            alt="Selected"
            style={{ maxWidth: "100%", maxHeight: "100%" }}
            onClick={(e) => e.stopPropagation()}
          />
        </Box>
      </Modal>

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
        {/* <Grid2>
          <Button variant="outlined" color="warning" onClick={handleCancel}>
            {t("cancel")}
          </Button>
        </Grid2> */}
      </Grid2>
      {/* </form> */}
    </Box>
  );
};

export default Images;
