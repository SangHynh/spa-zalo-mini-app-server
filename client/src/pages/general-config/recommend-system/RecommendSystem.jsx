import { Box, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import UserCate from "./UserCate";
import UserProd from "./UserProd";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

const RecommendSystem = () => {
  const { t } = useTranslation();
  const [showUserProd, setShowUserProd] = useState(false);
  const [showUserCate, setShowUserCate] = useState(false);
  const [userCateMaxHeight, setUserCateMaxHeight] = useState("0");
  const [userProdMaxHeight, setUserProdMaxHeight] = useState("0");
  const userCateRef = useRef(null);
  const userProdRef = useRef(null);

  const toggleUserCate = () => {
    setShowUserCate((prev) => !prev);
  };

  const toggleUserProd = () => {
    setShowUserProd((prev) => !prev);
  };

  useEffect(() => {
    if (showUserCate) {
      setUserCateMaxHeight(`${userCateRef.current.scrollHeight}px`);
    } else {
      setUserCateMaxHeight("0");
    }
  }, [showUserCate]);

  useEffect(() => {
    if (showUserProd) {
      setUserProdMaxHeight(`${userProdRef.current.scrollHeight}px`);
    } else {
      setUserProdMaxHeight("0");
    }
  }, [showUserProd]);

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("recommend-system")}</Typography>

      {/* User-Cate */}
      <Typography
        variant="h7"
        onClick={toggleUserCate}
        className={twMerge(
          "px-2 py-1 border rounded-md cursor-pointer flex justify-between items-center transition-all duration-300",
          clsx(
            showUserCate ? "bg-gray-100 dark:bg-gray-100 text-black" : "",
            "hover:bg-gray-100 dark:hover:bg-gray-100 hover:text-black"
          )
        )}
      >
        {t("user-cate")}
        {showUserCate ? (
          <FaChevronDown size={14} />
        ) : (
          <FaChevronRight size={14} />
        )}
      </Typography>
      <Box
        style={{
          maxHeight: userCateMaxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <Box ref={userCateRef}>
          <UserCate />
        </Box>
      </Box>

      {/* User-Prod */}
      <Typography
        variant="h7"
        onClick={toggleUserProd}
        className={twMerge(
          "px-2 py-1 border rounded-md cursor-pointer flex justify-between items-center transition-all duration-300",
          clsx(
            showUserProd ? "bg-gray-100 dark:bg-gray-100 text-black" : "",
            "hover:bg-gray-100 dark:hover:bg-gray-100 hover:text-black"
          )
        )}
      >
        {t("user-prod")}
        {showUserProd ? (
          <FaChevronDown size={14} />
        ) : (
          <FaChevronRight size={14} />
        )}
      </Typography>
      <Box
        style={{
          maxHeight: userProdMaxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <Box ref={userProdRef}>
          <UserProd />
        </Box>
      </Box>
    </Box>
  );
};

export default RecommendSystem;
