import React, { useContext, useEffect, useState } from "react";
import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FaMoon, FaSun } from "react-icons/fa";

const options = [
  { value: "vi", label: "Tiếng Việt", flag: "/vietnam.png" },
  { value: "en", label: "English", flag: "/united-states.png" },
];

const Topheader = ({ height }) => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(options[0]);

  useEffect(() => {
    // Khởi tạo selectedOption dựa trên ngôn ngữ hiện tại của i18n
    const currentLang = i18n.language;
    const currentOption = options.find(
      (option) => option.value === currentLang
    );
    setSelectedOption(currentOption);
  }, [i18n.language]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    changeLanguage(selectedOption.value);
  };

  const formatOptionLabel = ({ label, flag }) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <img
        src={flag}
        alt={`${label} flag`}
        style={{ width: 20, height: 20, marginRight: 8 }}
      />
      {label}
    </div>
  );

  return (
    <div
      className="flex justify-end items-center fixed z-50 w-full top-0 dark:border-none dark:bg-[#121212] border-b pr-10 gap-4 py-2"
      style={{ height: `${height}px` }}
    >
      <button
        onClick={toggleDarkMode}
        className={
          "flex items-center p-2 rounded-full transition-colors duration-300"
        }
      >
        {isDarkMode ? (
          <FaMoon className="w-5 h-5 text-yellow-400" />
        ) : (
          <FaSun className="w-5 h-5 text-gray-600" />
        )}
      </button>
      <Select
        value={selectedOption}
        onChange={handleChange}
        options={options}
        formatOptionLabel={formatOptionLabel}
        className="w-fit text-black"
      />
      <Button
        onClick={handleClick}
        variant="contained"
        className="flex border gap-4 items-center"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Avatar alt="Remy Sharp" src="" sx={{ width: 40, height: 40 }} />
        <span className="font-bold">Admin.name</span>
        <ArrowDropDownIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: anchorEl ? anchorEl.offsetWidth : "auto",
          },
        }}
      >
        <MenuItem onClick={handleClose}>{t("setting")}</MenuItem>
        <MenuItem onClick={handleClose}>{t("logout")}</MenuItem>
      </Menu>
    </div>
  );
};

export default Topheader;
