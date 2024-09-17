import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet, Link } from "react-router-dom";
import { sidebar } from "../utils/constants"; // Đường dẫn đến constants.jsx

const drawerWidth = 240;

const AdminLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <main className="w-full grid grid-cols-12 min-h-screen max-h-screen overflow-auto">
        {/* Nút toggle để ẩn/hiện sidebar */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{ position: "absolute", top: 16, left: 16, zIndex: 1300 }} // Đảm bảo nút nằm trên cùng
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer */}
        <Drawer
          variant="persistent"
          open={isDrawerOpen}
          sx={{
            width: isDrawerOpen ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: "width 0.3s ease",
            },
          }}
        >
          <List>
            {sidebar.map((item) => (
              <ListItem button key={item.id} component={Link} to={item.path}>
                {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </Drawer>

        {/* Nội dung chính */}
        <div
          className="col-span-12"
          style={{
            marginLeft: isDrawerOpen ? drawerWidth : 0,
            transition: "margin-left 0.3s ease",
          }}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AdminLayout;
