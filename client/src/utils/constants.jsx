import { Paper, styled } from "@mui/material";
import path from "./path";
import { RiDashboardLine } from "react-icons/ri";

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
  },
  {
    id: 2,
    name: "Users",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_USERS}`,
  },
  {
    id: 3,
    name: "Services",
    path: `/${path.ADMIN_LAYOUT}/${path.MANAGE_SERVICES}`,
  },
];

export const categories = [
  'Tẩy trang mặt',
  'Sữa rửa mặt',
  'Tẩy tế bào chết da mặt',
  'Sữa dưỡng ẩm',
  'Sữa dưỡng trắng',
]

export const benefits = [
  'Giúp dưỡng ẩm cho da',
  'Làm dịu da',
  'Tẩy tế bào chết da mặt',
  'Làm sạch da mặt',
]

// UI CONSTANTS
export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
