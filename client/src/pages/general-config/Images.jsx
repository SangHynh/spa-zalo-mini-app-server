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
import { toast } from "react-toastify";

const Images = () => {
  const { t } = useTranslation();

  // HANDLE IMAGES UPLOAD
  // State to hold uploaded image files
  const [images, setImages] = useState([]);
  const [deleteImages, setDeleteImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [initialImages, setInitialImages] = useState([]);

  const handleFileUpload = (event) => {
    const files = event.target.files;
    const newImages = [...images];
    const invalidFiles = [];

    Array.from(files).forEach((file) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        // Kiểm tra xem kích thước có lớn hơn hoặc bằng 1000x500 không
        if (img.width >= 1000 || img.height >= 500) {
          invalidFiles.push(file.name); // Nếu lớn hơn hoặc bằng, thêm vào danh sách lỗi
        } else {
          newImages.push({
            index: existingImages.length + newImages.length,
            url: img.src,
            file: file,
          });
          setImages(newImages);
        }

        // Nếu có file không hợp lệ thì báo lỗi
        if (invalidFiles.length > 0) {
          Swal.fire({
            icon: "error",
            title: `${t("size-error")}`,
            text: `${t("title-size-err")} ${invalidFiles.join(", ")}`,
          });
        }
      };
    });
  };

  const handleRemoveImage = (index) => {
    const allImages = existingImages.concat(images); // Kết hợp tất cả hình ảnh
    const imgToRemove = allImages[index]; // Lấy hình ảnh muốn xóa theo chỉ số

    if (existingImages.includes(imgToRemove)) {
      // Nếu là hình ảnh đã tồn tại
      setExistingImages(
        existingImages.filter((img) => img.index !== imgToRemove.index)
      );
      setDeleteImages([...deleteImages, imgToRemove.url]); // Thêm URL vào danh sách xóa
    } else {
      // Nếu là hình ảnh mới
      setImages(images.filter((img) => img.index !== imgToRemove.index));
    }
  };

  useEffect(() => {
    const fetchSlider = async () => {
      const response = await apiGetSlider();
      if (response.status === 200) {
        const data = response.data;
        setExistingImages(data.images);
        setInitialImages(data.images);
      }
    };
    fetchSlider();
  }, []);

  // Check handle change
  const checkImagesChanged = () => {
    if (initialImages.length !== existingImages.length) return true;
    for (let i = 0; i < initialImages.length; i++) {
      if (initialImages[i].url !== existingImages[i].url) return true;
    }
    return false;
  };

  // SUBMIT
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    showLoading();

    // Check change
    if (
      !checkImagesChanged() &&
      images.length === 0 &&
      deleteImages.length === 0
    ) {
      toast.info(`${t("no-change")}`);
      hideLoading();
      return;
    }

    const formData = new FormData();

    // Append images
    images.forEach((img) => {
      formData.append("images", img.file); // Actual file to backend
    });

    formData.append(
      "existingImages",
      JSON.stringify(existingImages.map((img) => img.url))
    );

    formData.append("deleteImages", JSON.stringify(deleteImages));

    console.log(formData.entries());

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
          title: t("config-success"),
          showConfirmButton: true,
          confirmButtonText: "Ok",
        }).then(({ isConfirmed }) => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "danger",
        title: t("config-fail"),
        showCancelButton: true,
        cancelButtonText: "Ok",
      });

      console.error("Error config:", error);
    } finally {
      hideLoading();
    }
  };

  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleOpen = (imgSrc) => {
    setSelectedImage(imgSrc);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle image sorting (move up)
  const handleMoveUp = (index) => {
    const allImages = existingImages.concat(images); // Kết hợp tất cả hình ảnh
    if (index > 0) {
      const newImages = [...allImages];
      [newImages[index], newImages[index - 1]] = [
        newImages[index - 1],
        newImages[index],
      ];
      setExistingImages(newImages.slice(0, existingImages.length)); // Cập nhật ảnh hiện có
      setImages(newImages.slice(existingImages.length)); // Cập nhật ảnh mới
    }
  };

  // Handle image sorting (move down)
  const handleMoveDown = (index) => {
    const allImages = existingImages.concat(images); // Kết hợp tất cả hình ảnh
    if (index < allImages.length - 1) {
      const newImages = [...allImages];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      setExistingImages(newImages.slice(0, existingImages.length)); // Cập nhật ảnh hiện có
      setImages(newImages.slice(existingImages.length)); // Cập nhật ảnh mới
    }
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("image-config")}</Typography>
      <form onSubmit={handleSubmit}>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          sx={{ width: "fit-content" }}
        >
          {t("upload-files")}
          <VisuallyHiddenInput
            type="file"
            onChange={handleFileUpload}
            multiple
            accept="image/*"
          />
        </Button>

        <Grid2 container fullWidth spacing={2} sx={{ mt: 2 }}>
          <Grid2 size={6}>
            {/* Table for Existing Images */}
            <Typography variant="h6">{t("existing-images")}</Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-400 dark:bg-gray-100 text-black">
                    <th className="border px-4 py-2">{t("no.")}</th>
                    <th className="border px-4 py-2">{t("nor-image")}</th>
                    <th className="border px-4 py-2">{t("arrange")}</th>
                    <th className="border px-4 py-2">{t("operations")}</th>
                  </tr>
                </thead>
                <tbody>
                  {existingImages.map((imgSrc, index) => (
                    <tr key={imgSrc.index} className="relative">
                      <td className="text-center border">{index + 1}</td>
                      <td className="border">
                        <div className="flex items-center justify-center m-4">
                          <img
                            src={imgSrc.url}
                            alt={`Uploaded ${imgSrc.index}`}
                            loading="lazy"
                            className="w-[150px] h-[75px]"
                            onClick={() => handleOpen(imgSrc.url)}
                          />
                        </div>
                      </td>
                      <td className="border">
                        <div className="flex h-full w-full gap-4 items-center justify-center">
                          <IconButton
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0}
                          >
                            <FaArrowUp />
                          </IconButton>
                          <IconButton
                            onClick={() => handleMoveDown(index)}
                            disabled={index === existingImages.length - 1}
                          >
                            <FaArrowDown />
                          </IconButton>
                        </div>
                      </td>
                      <td className="border">
                        <div className="flex h-full w-full items-center justify-center">
                          <IconButton onClick={() => handleRemoveImage(index)}>
                            <CancelIcon sx={{ color: red[500] }} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid2>
          <Grid2 size={6}>
            {/* Table for Uploaded Images */}
            <Typography variant="h6">{t("uploaded-images")}</Typography>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gray-400 dark:bg-gray-100 text-black">
                    <th className="border px-4 py-2">{t("no.")}</th>
                    <th className="border px-4 py-2">{t("nor-image")}</th>
                    <th className="border px-4 py-2">{t("operations")}</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((imgSrc, index) => (
                    <tr key={imgSrc.index} className="relative">
                      <td className="text-center border">
                        {existingImages.length + index + 1}
                      </td>
                      <td className="border">
                        <div className="flex items-center justify-center m-4">
                          <img
                            src={imgSrc.url}
                            alt={`Uploaded ${imgSrc.index}`}
                            loading="lazy"
                            className="w-[150px] h-[75px]"
                            onClick={() => handleOpen(imgSrc.url)}
                          />
                        </div>
                      </td>
                      <td className="border">
                        <div className="flex h-full w-full items-center justify-center">
                          <IconButton
                            onClick={() =>
                              handleRemoveImage(existingImages.length + index)
                            }
                          >
                            <CancelIcon sx={{ color: red[500] }} />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Grid2>
        </Grid2>

        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
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
        </Grid2>
      </form>
    </Box>
  );
};

export default Images;
