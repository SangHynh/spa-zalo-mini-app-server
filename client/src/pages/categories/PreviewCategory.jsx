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

const PreviewCategory = ({
  open,
  handleClose,
  categoryName,
  categoryDescription,
  subCategories,
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
          {t("preview-category")}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>{t("category-name")} :</strong> {categoryName}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          <strong>{t("description")} :</strong> {categoryDescription}
        </Typography>

        <Typography sx={{ mt: 2 }}>
          <strong>{t("sub-category")} :</strong>
        </Typography>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {subCategories?.length > 0
            ? subCategories?.map((subCategory) => (
                <ListItem key={subCategory.id}>
                  <ListItemText
                    primary={
                      <React.Fragment>
                        <Typography>{subCategory.name}</Typography>
                      </React.Fragment>
                    }
                    secondary={
                      <React.Fragment>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ color: "text.primary", display: "inline" }}
                        >
                          {t("description")}: {subCategory.description}
                        </Typography>
                      </React.Fragment>
                    }
                  />
                </ListItem>
              ))
            : `${t("no-sub-categories-added")}.`}
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

export default PreviewCategory;
