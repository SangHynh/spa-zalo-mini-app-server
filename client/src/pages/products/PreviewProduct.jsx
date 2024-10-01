import React from "react";
import {
  Modal,
  Box,
  Typography,
  ImageList,
  ImageListItem,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid2,
} from "@mui/material";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const PreviewProduct = ({
  open,
  handleClose,
  productName,
  productAmount,
  productCategory,
  productSubCategory,
  productExpiredDate,
  productDescription,
  productBenefits,
  images,
  variants,
  ingredients,
  calculateTotalStock,
}) => {
  const { t } = useTranslation();

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "75%",
          height: "80vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          overflow: "auto",
        }}
      >
        <Typography variant="h5" component="h2">
          {t("preview-product")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("name")} :</strong> {productName}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("total-stock")} :</strong> {calculateTotalStock()}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("price")} :</strong> {productAmount} VND
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("category")} :</strong> {productCategory?.name} -{" "}
          {productSubCategory?.name}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("exp-date")} :</strong>{" "}
          {productExpiredDate.format("DD/MM/YYYY")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("description")} :</strong> {productDescription}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("benefits")} :</strong> {productBenefits.join(", ")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("images")} :</strong>
        </Typography>
        {images.length > 0 && (
          <ImageList sx={{ height: 250, mt: 2 }} cols={5} rowHeight={150}>
            {images.map((imgSrc, index) => (
              <ImageListItem key={index}>
                <img src={imgSrc} alt={`Uploaded ${index}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        )}
        <Typography sx={{ mt: 2 }}>
          <strong>{t("variants")} :</strong>
        </Typography>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {variants.length > 0
            ? variants.map((variant) => (
                <ListItem key={variant.id}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography>
                          {variant.volume} - {variant.stock} {t("in-stock")}
                        </Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {t("price")} : {variant.price} VNĐ
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))
            : `${t("no-variants-added")}.`}
        </List>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("ingredients")} :</strong>
        </Typography>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {ingredients.length > 0
            ? ingredients.map((ingredient) => (
                <ListItem key={ingredient.id}>
                  <ListItemText
                    primary={
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
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {t("usage-instructions")} :{" "}
                          {ingredient.usageInstructions}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))
            : `${t("no-ingredients-added")}.`}
        </List>

        <Grid2
          container
          fullWidth
          spacing={2}
          sx={{ mt: 2, justifyContent: "flex-end" }}
        >
          <Grid2>
            <Button onClick={handleClose} sx={{ mt: 2 }} variant="outlined">
              {t("close")}
            </Button>
          </Grid2>
        </Grid2>
      </Box>
    </Modal>
  );
};

export default PreviewProduct;
