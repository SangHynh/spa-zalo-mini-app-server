import React, { useState } from "react";
import { Button, Menu, MenuItem, Avatar } from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Topheader = ({ height }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div
      className="flex justify-end items-center fixed z-50 w-full top-0 bg-white border-b pr-10"
      style={{ height: `${height}px` }}
    >
      <Button
        onClick={handleClick} // Thay đổi từ onMouseEnter sang onClick
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
            width: anchorEl ? anchorEl.offsetWidth : "auto", // Đặt chiều rộng bằng chiều rộng của button
          },
        }}
      >
        <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
        <MenuItem onClick={handleClose}>Cài đặt</MenuItem>
        <MenuItem onClick={handleClose}>Hồ sơ</MenuItem>
      </Menu>
    </div>
  );
};

export default Topheader;
