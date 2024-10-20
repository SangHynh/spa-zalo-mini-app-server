import React, { useContext, useEffect, useState } from "react";
import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import { logout } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

const options = [
  { value: "vi", label: "Tiếng Việt", flag: "/vietnam.png" },
  { value: "en", label: "English", flag: "/united-states.png" },
];

const Topheader = () => {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const { t, i18n } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const navigate = useNavigate();

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

  const handleLogout = () => {
    logout();

    navigate("/");
  };

  return (
    <div className="flex justify-end items-center fixed z-50 w-full top-0 left-0 border-none dark:bg-[#1E1E1E] border-b pr-8 gap-10 py-2">
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
      <Avatar
        onClick={handleClick}
        alt="Remy Sharp"
        src=""
        sx={{ width: 40, height: 40 }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          style: {
            transform: "translateX(-10%) translateY(10%)",
            minWidth: 150,
          },
        }}
      >
        <span className="flex justify-center border-b-2 py-1">AdminName</span>
        <MenuItem>{t("setting")}</MenuItem>
        <MenuItem onClick={handleLogout}>{t("logout")}</MenuItem>
      </Menu>
    </div>
  );
};

export default Topheader;
