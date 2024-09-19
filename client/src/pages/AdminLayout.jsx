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
import { sidebar } from "../utils/constants";
import Topheader from "../components/banners/Topheader";

const TOP_HEADER_HEIGHT = 64;
const drawerWidth = 240;

const AdminLayout = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <>
      <Topheader height={TOP_HEADER_HEIGHT} />
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={toggleDrawer}
        edge="start"
        sx={{ position: "absolute", top: 13, left: 16, zIndex: 1300 }}
      >
        <MenuIcon />
      </IconButton>
      <main className="w-full grid grid-cols-12 min-h-screen max-h-screen overflow-auto">
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
              marginTop: `${TOP_HEADER_HEIGHT}px`,
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

        <div
          className="col-span-12 flex flex-col"
          style={{
            marginLeft: isDrawerOpen ? drawerWidth : 0,
            transition: "margin-left 0.3s ease",
            minHeight: "100vh",
            alignItems: "flex-start",
            marginTop: `${TOP_HEADER_HEIGHT}px`,
          }}
        >
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default AdminLayout;
