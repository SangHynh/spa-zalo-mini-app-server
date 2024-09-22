import { styled } from "@mui/material";
import path from "./path";
import { RiDashboardLine } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { MdRoomService } from "react-icons/md";
import { LuShoppingBag } from "react-icons/lu";
import { MdCategory } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import { GoDash } from "react-icons/go";

export const getSidebar = (t) => [
  {
    id: 1,
    name: t("dashboard"),
    path: `/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`,
    icon: <RiDashboardLine size={25} />,
    type: "SINGLE",
  },
  {
    id: 2,
    name: t("product"),
    path: `/${path.ADMIN_LAYOUT}/${path.PRODUCT_MANAGEMENT}`,
    icon: <LuShoppingBag size={25} />,
    type: "SINGLE",
  },
  {
    id: 3,
    name: t("user"),
    path: `/${path.ADMIN_LAYOUT}/${path.USER_MANAGEMENT}`,
    icon: <FaUserCog size={25} />,
    type: "SINGLE",
  },
  {
    id: 4,
    name: t("category"),
    path: `/${path.ADMIN_LAYOUT}/${path.CATEGORY_MANAGEMENT}`,
    icon: <MdCategory size={25} />,
    type: "SINGLE",
  },
  {
    id: 5,
    name: t("booking"),
    path: `/${path.ADMIN_LAYOUT}/${path.BOOKING_MANAGEMENT}`,
    icon: <MdRoomService size={25} />,
    type: "SINGLE",
  },
  {
    id: 6,
    name: t("order"),
    path: `/${path.ADMIN_LAYOUT}/${path.ORDER_MANAGEMENT}`,
    icon: <MdProductionQuantityLimits size={25} />,
    type: "SINGLE",
  },
  {
    id: 7,
    name: t("general-config"),
    icon: <IoSettingsSharp size={25} />,
    type: "PARENT",
    subs: [
      {
        id: 11,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.AFFILIATE_MARKETING}`,
        name: t("affiliate-marketing"),
      },
      {
        id: 12,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.COMMISSION}`,
        name: t("commission"),
      },
      {
        id: 13,
        icon: <GoDash />,
        path: `/${path.ADMIN_LAYOUT}/${path.RANK_POINT}`,
        name: t("rank-point"),
      },
    ],
  },
];

export const categories = [
  "Tẩy trang mặt",
  "Sữa rửa mặt",
  "Tẩy tế bào chết da mặt",
  "Sữa dưỡng ẩm",
  "Sữa dưỡng trắng",
];

export const benefits = [
  "Giúp dưỡng ẩm cho da",
  "Làm dịu da",
  "Tẩy tế bào chết da mặt",
  "Làm sạch da mặt",
];

// UI CONSTANTS
export const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// export const productColumns = [
//   { id: "name", label: "Name" },
//   { id: "description", label: "Description" },
//   {
//     id: "amount",
//     label: "Population",
//     align: "right",
//     format: (value) => value.toLocaleString("en-US"),
//   },
//   { id: "category", label: "Category" },
//   { id: "benefit", label: "Benefit" },

//   {
//     id: "size",
//     label: "Size\u00a0(km\u00b2)",
//     align: "right",
//     format: (value) => value.toLocaleString("en-US"),
//   },
//   {
//     id: "density",
//     label: "Density",
//     minWidth: 170,
//     align: "right",
//     format: (value) => value.toFixed(2),
//   },
// ];

// export const productRows = [
//   { name: "India", code: "IN", population: 1324171354, size: 3287263 },
//   { name: "China", code: "CN", population: 1403500365, size: 9596961 },
//   { name: "Italy", code: "IT", population: 60483973, size: 301340 },
// ];
