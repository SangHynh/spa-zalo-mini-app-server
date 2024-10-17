import { Box, Typography } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ForUser from "./ForUser";
import ForOrder from "./ForOrder";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const RanknPoint = () => {
  const { t } = useTranslation();
  const [showUser, setShowUser] = useState(false);
  const [showOrder, setShowOrder] = useState(false);
  const [userMaxHeight, setUserMaxHeight] = useState("0");
  const [orderMaxHeight, setOrderMaxHeight] = useState("0");
  const userRef = useRef(null);
  const orderRef = useRef(null);

  const toggleUser = () => {
    setShowUser((prev) => !prev);
  };

  const toggleOrder = () => {
    setShowOrder((prev) => !prev);
  };

  useEffect(() => {
    if (showUser) {
      setUserMaxHeight(`${userRef.current.scrollHeight}px`);
    } else {
      setUserMaxHeight("0");
    }
  }, [showUser]);

  useEffect(() => {
    if (showOrder) {
      setOrderMaxHeight(`${orderRef.current.scrollHeight}px`);
    } else {
      setOrderMaxHeight("0");
    }
  }, [showOrder]);

  return (
    <Box className="w-full flex flex-col gap-6">
      <Typography variant="h5">{t("rank-point")}</Typography>

      <Typography
        variant="h7"
        onClick={toggleUser}
        className={`px-2 py-1 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:text-black flex justify-between items-center transition-all duration-300`}
      >
        {t("user")}
        {showUser ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
      </Typography>
      <Box
        style={{
          maxHeight: userMaxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <Box ref={userRef}>
          <ForUser />
        </Box>
      </Box>

      <Typography
        variant="h7"
        onClick={toggleOrder}
        className={`px-2 py-1 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100 dark:hover:text-black flex justify-between items-center transition-all duration-300`}
      >
        {t("order")}
        {showOrder ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
      </Typography>
      <Box
        style={{
          maxHeight: orderMaxHeight,
          overflow: "hidden",
          transition: "max-height 0.3s ease",
        }}
      >
        <Box ref={orderRef}>
          <ForOrder />
        </Box>
      </Box>
    </Box>
  );
};

export default RanknPoint;
