import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ForUser from "./ForUser"; // Giả sử đây là component ForUser
import ForOrder from "./ForOrder"; // Giả sử đây là component ForOrder

const RanknPoint = () => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState("for-user");

  // Lưu trạng thái khi reload trang
  useEffect(() => {
    const savedOption = localStorage.getItem("selectedOptionRanknPoint");
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedOption(newValue);
    localStorage.setItem("selectedOptionRanknPoint", newValue);
  };

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("rank-point")}</Typography>

      <FormControl fullWidth variant="outlined">
        <InputLabel>{t("select-option")}</InputLabel>
        <Select
          value={selectedOption}
          onChange={handleChange}
          label={t("select-option")}
        >
          <MenuItem value="for-user">{t("user")}</MenuItem>
          <MenuItem value="for-order">{t("order")}</MenuItem>
        </Select>
      </FormControl>

      {selectedOption === "for-user" && <ForUser />}
      {selectedOption === "for-order" && <ForOrder />}
      <div className="h-50"></div>
    </Box>
  );
};

export default RanknPoint;
