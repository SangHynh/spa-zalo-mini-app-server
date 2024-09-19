import { Paper, styled } from "@mui/material";
import path from "./path";
import { RiDashboardLine } from "react-icons/ri";
import { MdProductionQuantityLimits } from "react-icons/md";
import { FaUserCog } from "react-icons/fa";
import { MdRoomService } from "react-icons/md";

export const sidebar = [
  {
    id: 1,
    name: "Dashboard",
    path: `/${path.ADMIN_LAYOUT}/${path.DASHBOARD}`,
    icon: <RiDashboardLine size={25} />,
  },
  {
    id: 2,
    name: "Products",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_PRODUCTS}`,
    icon: <MdProductionQuantityLimits size={25} />,
  },
  {
    id: 2,
    name: "Users",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_USERS}`,
    icon: <FaUserCog size={25} />,
  },
  {
    id: 3,
    name: "Services",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_SERVICES}`,
    icon: <MdRoomService size={25} />,
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
