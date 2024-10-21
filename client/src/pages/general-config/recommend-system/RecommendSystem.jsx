import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import UserCate from "./UserCate";
import UserProd from "./UserProd";
import UserSvc from "./UserSvc";

const RecommendSystem = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("user-prod");

  // Lưu trạng thái khi reload trang
  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOption");
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    localStorage.setItem("selectedOption", newValue);
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("recommend-system")}</Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel>{t("select-option")}</InputLabel>
        <Select
          value={selectedOption}
          onChange={handleChange}
          label={t("select-option")}
        >
          <MenuItem value="user-cate">{t("user-cate")}</MenuItem>
          <MenuItem value="user-prod">{t("user-prod")}</MenuItem>
          <MenuItem value="user-svc">{t("user-svc")}</MenuItem>
        </Select>
      </FormControl>

      {selectedOption === "user-cate" && <UserCate />}
      {selectedOption === "user-prod" && <UserProd />}
      {selectedOption === "user-svc" && <UserSvc />}
    </Box>
  );
};

export default RecommendSystem;
