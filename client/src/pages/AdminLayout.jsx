import React, { Fragment, useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { getSidebar } from "../utils/constants";
import Topheader from "../components/banners/Topheader";
import { useTranslation } from "react-i18next";
import { FaCaretDown, FaCaretRight } from "react-icons/fa";
import { useTheme } from "@emotion/react";
import Swal from "sweetalert2";
import PrivateRoute from "../context/PrivateRoute";

const drawerWidth = 240;

const AdminLayout = () => {
  const location = useLocation();
  const theme = useTheme();

  const activeColor =
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, 0.12)" // Màu active cho chế độ tối
      : "rgba(0, 0, 0, 0.08)"; // Màu active cho chế độ sáng

  const [activeTabs, setActiveTabs] = useState([]);

  const handleActiveTabs = (tabId) => {
    if (activeTabs.some((el) => el === tabId)) {
      setActiveTabs((prev) => prev.filter((el) => el !== tabId));
    } else {
      setActiveTabs((prev) => [...prev, tabId]);
    }
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const { t } = useTranslation();
  const sidebar = getSidebar(t);

  const navigate = useNavigate();

  return (
    <PrivateRoute>
      <main className="w-full flex h-screen overflow-auto">
        <Drawer
          variant="persistent"
          open={isDrawerOpen}
          sx={{
            width: isDrawerOpen ? drawerWidth : 0,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              transition: "width 5s ease",
              border: theme.palette.mode === "dark" ? "none" : "",
              overflowY: "auto",
              boxShadow:
                theme.palette.mode === "dark"
                  ? "none"
                  : "0px 4px 10px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <div className="h-fit w-full flex items-center justify-center">
            <img src="/logo.png" alt="logo" className="w-40 h-20 mt-4" />
          </div>
          <List>
            {sidebar.map((item) => (
              <Fragment key={item.id}>
                {item.type === "SINGLE" && (
                  <ListItem
                    button
                    component={Link}
                    to={item.path}
                    className={`my-4 ${
                      location.pathname === item.path ? "bg-gray-200" : ""
                    }`}
                    sx={{
                      backgroundColor:
                        location.pathname === item.path
                          ? activeColor
                          : "transparent",
                      "&:hover": {
                        backgroundColor: activeColor, // Màu nền hover
                      },
                    }}
                  >
                    {item.icon && (
                      <ListItemIcon className="-mr-2">{item.icon}</ListItemIcon>
                    )}
                    <ListItemText primary={item.name} />
                  </ListItem>
                )}

                {item.type === "PARENT" && (
                  <>
                    <ListItem
                      button
                      onClick={() => handleActiveTabs(item.id)}
                      className={"mt-4 mb-2 cursor-pointer"}
                    >
                      <ListItemIcon className="-mr-2">{item.icon}</ListItemIcon>
                      <ListItemText primary={item.name} />
                      {activeTabs.some((tabId) => tabId === item.id) ? (
                        <FaCaretDown className="text-gray-500 dark:text-white" />
                      ) : (
                        <FaCaretRight className="text-gray-500 dark:text-white" />
                      )}
                    </ListItem>

                    {activeTabs.some((tabId) => tabId === item.id) && (
                      <div>
                        {item.subs.map((sub) => (
                          <ListItem
                            button
                            key={sub.id}
                            component={Link}
                            to={sub.path}
                            style={{ paddingLeft: "34px" }}
                            className={
                              location.pathname === sub.path
                                ? "bg-gray-300"
                                : ""
                            }
                            sx={{
                              backgroundColor:
                                location.pathname === sub.path
                                  ? activeColor
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: activeColor, // Màu nền hover
                              },
                            }}
                          >
                            <ListItemText
                              primary={sub.icon}
                              className="w-fit"
                            />
                            <div className="flex justify-start w-full ml-5">
                              <ListItemText primary={sub.name} />
                            </div>
                          </ListItem>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </List>
        </Drawer>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          edge="start"
          sx={{
            position: "absolute",
            top: 13,
            left: isDrawerOpen ? drawerWidth + 32 : 32,
            zIndex: 1300,
            transition: "left 0.2s ease",
          }}
        >
          <MenuIcon />
        </IconButton>
        <Topheader />
        <div
          className="mt-[68px] px-8 py-4"
          style={{
            transition: "margin-left 5s ease",
            width: `calc(100% - ${isDrawerOpen ? drawerWidth : 0}px)`,
          }}
        >
          <Outlet />
        </div>
      </main>
    </PrivateRoute>
  );
};

export default AdminLayout;
